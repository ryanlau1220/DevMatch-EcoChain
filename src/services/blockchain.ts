import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

// Blockchain Configuration
const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || '0x5bbfeb3847bbea0aad7383da8a6ed826c36a031586858ea8287159cfc85d9105';
const SENSOR_REGISTRY_ID = import.meta.env.VITE_SUI_REGISTRY_ID || '0xa69b46162707233562a70c0565f74513a7a1bf73f54f745d007d6bd0d108a15e';
const NETWORK = import.meta.env.VITE_SUI_NETWORK || 'testnet';

// Initialize Sui client
const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

// Types for blockchain data
export interface BlockchainSensor {
  id: string;
  sensorId: string;
  sensorType: string;
  owner: string;
  registeredAt: number;
  trustScore: number;
  status: number;
}

export interface SensorRegistryStats {
  totalSensors: number;
}

// Blockchain Service Class
export class BlockchainService {
  private client: SuiClient;

  constructor() {
    this.client = client;
  }

  // Get sensor registry statistics
  async getRegistryStats(): Promise<SensorRegistryStats> {
    try {
      const object = await this.client.getObject({
        id: SENSOR_REGISTRY_ID,
        options: { showContent: true }
      });

      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;
        return {
          totalSensors: Number(fields.total_sensors || 0)
        };
      }
      return { totalSensors: 0 };
    } catch (error) {
      console.error('Error fetching registry stats:', error);
      return { totalSensors: 0 };
    }
  }

  // Get all sensors owned by an address
  async getSensorsByOwner(ownerAddress: string): Promise<BlockchainSensor[]> {
    try {
      const objects = await this.client.getOwnedObjects({
        owner: ownerAddress,
        filter: {
          Package: PACKAGE_ID
        },
        options: { showContent: true }
      });

      const sensors: BlockchainSensor[] = [];
      
      for (const obj of objects.data) {
        if (obj.data?.content && 'fields' in obj.data.content) {
          const fields = obj.data.content.fields as any;
          if (fields.sensor_id) { // This is a sensor object
            sensors.push({
              id: obj.data.objectId,
              sensorId: fields.sensor_id,
              sensorType: fields.sensor_type,
              owner: fields.owner,
              registeredAt: Number(fields.registered_at),
              trustScore: Number(fields.trust_score),
              status: Number(fields.status)
            });
          }
        }
      }

      return sensors;
    } catch (error) {
      console.error('Error fetching sensors:', error);
      return [];
    }
  }

  // Get recent sensor registrations (events)
  async getRecentRegistrations(limit: number = 10): Promise<any[]> {
    try {
      const events = await this.client.queryEvents({
        query: {
          MoveModule: {
            package: PACKAGE_ID,
            module: 'simple_sensor',
            event: 'SensorRegistered'
          }
        },
        limit,
        order: 'descending'
      });

      return events.data.map(event => ({
        sensorId: event.parsedJson?.sensor_id,
        owner: event.parsedJson?.owner,
        sensorType: event.parsedJson?.sensor_type,
        timestamp: event.parsedJson?.timestamp,
        transactionDigest: event.id.txDigest
      }));
    } catch (error) {
      console.error('Error fetching recent registrations:', error);
      return [];
    }
  }

  // Check if user has any sensors
  async hasSensors(ownerAddress: string): Promise<boolean> {
    const sensors = await this.getSensorsByOwner(ownerAddress);
    return sensors.length > 0;
  }

  // Get sensor by ID
  async getSensorById(sensorId: string): Promise<BlockchainSensor | null> {
    try {
      const object = await this.client.getObject({
        id: sensorId,
        options: { showContent: true }
      });

      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;
        return {
          id: object.data.objectId,
          sensorId: fields.sensor_id,
          sensorType: fields.sensor_type,
          owner: fields.owner,
          registeredAt: Number(fields.registered_at),
          trustScore: Number(fields.trust_score),
          status: Number(fields.status)
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching sensor:', error);
      return null;
    }
  }

  // Get blockchain network info
  async getNetworkInfo() {
    try {
      const chainIdentifier = await this.client.getChainIdentifier();
      return {
        chainId: chainIdentifier,
        network: NETWORK,
        packageId: PACKAGE_ID,
        registryId: SENSOR_REGISTRY_ID
      };
    } catch (error) {
      console.error('Error fetching network info:', error);
      return null;
    }
  }

  // Register a new sensor
  async registerSensor(sensorId: string, sensorType: string, keypair: Ed25519Keypair) {
    try {
      const tx = new TransactionBlock();
      
      // Get the registry object
      const registry = tx.object(SENSOR_REGISTRY_ID);
      
      // Call the register_sensor function
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_sensor::register_sensor`,
        arguments: [
          registry,
          tx.pure(Array.from(new TextEncoder().encode(sensorId))),
          tx.pure(Array.from(new TextEncoder().encode(sensorType)))
        ]
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
        options: { showEffects: true, showEvents: true }
      });

      return {
        success: true,
        digest: result.digest,
        effects: result.effects
      };
    } catch (error) {
      console.error('Error registering sensor:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Transfer sensor ownership
  async transferSensor(sensorId: string, newOwner: string, keypair: Ed25519Keypair) {
    try {
      const tx = new TransactionBlock();
      
      // Get the sensor object (this would need to be passed as an argument in a real implementation)
      const sensor = tx.object(sensorId);
      
      // Call the transfer_sensor function
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_sensor::transfer_sensor`,
        arguments: [
          sensor,
          tx.pure(newOwner)
        ]
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
        options: { showEffects: true, showEvents: true }
      });

      return {
        success: true,
        digest: result.digest,
        effects: result.effects
      };
    } catch (error) {
      console.error('Error transferring sensor:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Update sensor trust score
  async updateTrustScore(sensorId: string, newScore: number, keypair: Ed25519Keypair) {
    try {
      const tx = new TransactionBlock();
      
      // Get the sensor object
      const sensor = tx.object(sensorId);
      
      // Call the update_trust_score function
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_sensor::update_trust_score`,
        arguments: [
          sensor,
          tx.pure(newScore)
        ]
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
        options: { showEffects: true, showEvents: true }
      });

      return {
        success: true,
        digest: result.digest,
        effects: result.effects
      };
    } catch (error) {
      console.error('Error updating trust score:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get transaction details
  async getTransactionDetails(digest: string) {
    try {
      const txDetails = await this.client.getTransactionBlock({
        digest,
        options: { showEffects: true, showEvents: true, showInput: true }
      });
      return txDetails;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      return null;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();

// Export constants for use in components
export const BLOCKCHAIN_CONFIG = {
  PACKAGE_ID,
  SENSOR_REGISTRY_ID,
  NETWORK
}; 