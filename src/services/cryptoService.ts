import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64, toB64 } from '@mysten/bcs';
import { blake2b } from '@noble/hashes/blake2b';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export class CryptoService {
    private static instance: CryptoService;
    private keypairs: Map<string, Ed25519Keypair>;

    private constructor() {
        this.keypairs = new Map();
    }

    public static getInstance(): CryptoService {
        if (!CryptoService.instance) {
            CryptoService.instance = new CryptoService();
        }
        return CryptoService.instance;
    }

    /**
     * Generate a new keypair for a sensor
     */
    public async generateSensorKeypair(sensorId: string): Promise<Ed25519Keypair> {
        const keypair = Ed25519Keypair.generate();
        this.keypairs.set(sensorId, keypair);
        return keypair;
    }

    /**
     * Get existing keypair for a sensor
     */
    public getSensorKeypair(sensorId: string): Ed25519Keypair | undefined {
        return this.keypairs.get(sensorId);
    }

    /**
     * Sign data with a sensor's private key
     */
    public async signData(sensorId: string, data: any): Promise<{ signature: string; message: string }> {
        const keypair = this.keypairs.get(sensorId);
        if (!keypair) {
            throw new Error('No keypair found for sensor');
        }

        // Convert data to string and hash it
        const message = JSON.stringify(data);
        const messageBytes = new TextEncoder().encode(message);
        const messageHash = blake2b(messageBytes, { dkLen: 32 });

        // Sign the hash
        const signature = keypair.signData(messageHash);

        return {
            signature: toB64(signature),
            message: toB64(messageHash)
        };
    }

    /**
     * Verify a signature
     */
    public async verifySignature(
        publicKeyBytes: Uint8Array,
        signatureBytes: Uint8Array,
        messageBytes: Uint8Array
    ): Promise<boolean> {
        try {
            // Convert the signature and message to base64
            const signature = toB64(signatureBytes);
            const message = toB64(messageBytes);
            const publicKey = toB64(publicKeyBytes);

            // Create verification data
            const verificationData = {
                signature,
                message,
                publicKey
            };

            // In a real implementation, this would use the Sui SDK's cryptographic functions
            // For now, we're returning true to demonstrate the flow
            console.log('Verifying signature:', verificationData);
            return true;
        } catch (error) {
            console.error('Signature verification failed:', error);
            return false;
        }
    }

    /**
     * Register a sensor's public key on-chain
     */
    public async registerPublicKey(
        sensorId: string,
        keypair: Ed25519Keypair,
        registryId: string,
        client: any
    ): Promise<boolean> {
        try {
            const tx = new TransactionBlock();

            // Get the registry object
            const registry = tx.object(registryId);

            // Call the register_key function
            tx.moveCall({
                target: `${process.env.VITE_SUI_PACKAGE_ID}::sensor_auth::register_key`,
                arguments: [
                    registry,
                    tx.pure(Array.from(new TextEncoder().encode(sensorId))),
                    tx.pure(Array.from(new Uint8Array(keypair.getPublicKey().toSuiBytes())))
                ]
            });

            const result = await client.signAndExecuteTransactionBlock({
                signer: keypair,
                transactionBlock: tx,
                options: { showEvents: true }
            });

            return result.effects?.status?.status === 'success';
        } catch (error) {
            console.error('Error registering public key:', error);
            return false;
        }
    }

    /**
     * Format timestamp for blockchain
     */
    private getTimestamp(): number {
        return Math.floor(Date.now() / 1000);
    }
}
