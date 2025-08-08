import React, { useState, useEffect, useCallback } from 'react';
import { CryptoService } from '../services/cryptoService';
import { BlockchainService } from '../services/blockchain';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { LoadingSpinner } from './LoadingSpinner';
import { FaKey, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface SensorVerificationProps {
  sensorId: string;
}

export const SensorVerification: React.FC<SensorVerificationProps> = ({ sensorId }): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [keypair, setKeypair] = useState<Ed25519Keypair | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'success' | 'failed'>('none');
  const [lastVerification, setLastVerification] = useState<Date | null>(null);
  const [reputationStats, setReputationStats] = useState({
    verificationCount: 0,
    successfulVerifications: 0,
    reputationMultiplier: 1,
  });

  const cryptoService = CryptoService.getInstance();
  const blockchainService = new BlockchainService();

  const loadSensorKeypair = useCallback(async () => {
    const existingKeypair = cryptoService.getSensorKeypair(sensorId);
    if (existingKeypair) {
      setKeypair(existingKeypair);
    }
  }, [sensorId]);

  const loadReputationStats = useCallback(async () => {
    try {
      const sensor = await blockchainService.getSensorById(sensorId);
      if (sensor) {
        setReputationStats({
          verificationCount: sensor.verificationCount,
          successfulVerifications: sensor.successfulVerifications,
          reputationMultiplier: sensor.reputationMultiplier,
        });
      }
    } catch (error) {
      console.error('Error loading reputation stats:', error);
    }
  }, [sensorId]);

  useEffect(() => {
    loadSensorKeypair();
    loadReputationStats();
  }, [loadSensorKeypair, loadReputationStats]);

  const generateNewKeypair = useCallback(async () => {
    setLoading(true);
    try {
      const newKeypair = await cryptoService.generateSensorKeypair(sensorId);
      setKeypair(newKeypair);

      // Register the public key on chain
      await cryptoService.registerPublicKey(
        sensorId,
        newKeypair,
        process.env.VITE_SUI_REGISTRY_ID!,
        blockchainService.getClient()
      );

      // Refresh reputation stats after key registration
      await loadReputationStats();
    } catch (error) {
      console.error('Error generating keypair:', error);
    } finally {
      setLoading(false);
    }
  }, [sensorId, loadReputationStats]);

  const verifyData = useCallback(async () => {
    if (!keypair) return;

    setLoading(true);
    try {
      // Mock data for demonstration
      const sensorData = {
        temperature: 25.5,
        humidity: 65,
        timestamp: Date.now(),
      };

      // Sign the data
      const { signature, message } = await cryptoService.signData(sensorId, sensorData);

      // Verify the signature
      const isValid = await cryptoService.verifySignature(
        new Uint8Array(keypair.getPublicKey().toSuiBytes()),
        new Uint8Array(Buffer.from(signature, 'base64')),
        new Uint8Array(Buffer.from(message, 'base64'))
      );

      setVerificationStatus(isValid ? 'success' : 'failed');
      setLastVerification(new Date());

      // Update reputation on chain
      await updateSensorReputation(isValid);
    } catch (error) {
      console.error('Error verifying data:', error);
      setVerificationStatus('failed');
    } finally {
      setLoading(false);
    }
  }, [sensorId, keypair]);

  const updateSensorReputation = useCallback(async (success: boolean) => {
    if (!keypair) return;

    try {
      const tx = new TransactionBlock();
      
      // Get the sensor object
      const sensor = tx.object(sensorId);
      
      // Call the handle_verification_result function
      tx.moveCall({
        target: `${process.env.VITE_SUI_PACKAGE_ID}::simple_sensor::handle_verification_result`,
        arguments: [
          sensor,
          tx.pure(success),
        ]
      });

      await blockchainService.getClient().signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
        options: { showEffects: true }
      });

      // Reload reputation stats
      await loadReputationStats();
    } catch (error) {
      console.error('Error updating reputation:', error);
    }
  }, [sensorId, keypair, loadReputationStats]);

  const getSuccessRate = () => {
    return reputationStats.verificationCount === 0
      ? 0
      : (reputationStats.successfulVerifications / reputationStats.verificationCount) * 100;
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Sensor Verification</h2>
        {loading && <LoadingSpinner />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Cryptographic Identity</h3>
          {keypair ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Public Key: {keypair.getPublicKey().toSuiAddress().substring(0, 10)}...
              </p>
              <button
                onClick={generateNewKeypair}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                Rotate Keys
              </button>
            </div>
          ) : (
            <button
              onClick={generateNewKeypair}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={loading}
            >
              Generate Keypair
            </button>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Last Verification:</span>
              <span className="font-medium">
                {lastVerification ? lastVerification.toLocaleString() : 'Never'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {verificationStatus === 'success' && (
                <FaCheckCircle className="text-green-500" />
              )}
              {verificationStatus === 'failed' && (
                <FaTimesCircle className="text-red-500" />
              )}
              <button
                onClick={verifyData}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                disabled={loading || !keypair}
              >
                Verify Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Reputation Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Verification Count</p>
            <p className="text-xl font-bold">{reputationStats.verificationCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-xl font-bold">{getSuccessRate().toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Reputation Multiplier</p>
            <p className="text-xl font-bold">x{reputationStats.reputationMultiplier}</p>
          </div>
        </div>
      </div>
    </div>
  );
};