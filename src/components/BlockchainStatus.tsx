import React, { useState, useEffect } from 'react';
import { FaLink, FaNetworkWired, FaDatabase, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { blockchainService, BLOCKCHAIN_CONFIG } from '../services/blockchain';
import LoadingSpinner from './LoadingSpinner';

interface BlockchainStatusProps {
  className?: string;
}

const BlockchainStatus: React.FC<BlockchainStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [registryStats, setRegistryStats] = useState<any>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Test connection by fetching registry stats
        const stats = await blockchainService.getRegistryStats();
        setRegistryStats(stats);
        setIsConnected(true);

        // Fetch recent registrations
        const registrations = await blockchainService.getRecentRegistrations(5);
        setRecentRegistrations(registrations);

      } catch (err) {
        console.error('Blockchain connection error:', err);
        setError('Failed to connect to blockchain');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockchainData();
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <LoadingSpinner variant="spinner" size="sm" />
          <span className="text-gray-600">Connecting to blockchain...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaNetworkWired className={`text-lg ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
          <h3 className="text-lg font-semibold text-gray-800">Blockchain Status</h3>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? (
            <>
              <FaCheckCircle className="text-green-500" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="text-red-500" />
              <span>Disconnected</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {isConnected && (
        <>
          {/* Network Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <FaLink className="text-blue-500" />
              <span className="text-sm font-medium text-blue-800">Network Info</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <div>Network: <span className="font-mono">{BLOCKCHAIN_CONFIG.NETWORK}</span></div>
              <div>Package ID: <span className="font-mono truncate">{BLOCKCHAIN_CONFIG.PACKAGE_ID.slice(0, 8)}...</span></div>
            </div>
          </div>

          {/* Registry Stats */}
          {registryStats && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaDatabase className="text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">Registry Statistics</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total Sensors</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {registryStats.totalSensors}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {recentRegistrations.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm font-medium text-gray-700">Recent Activity</span>
              </div>
              <div className="space-y-2">
                {recentRegistrations.slice(0, 3).map((registration, index) => (
                  <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-green-800">
                          {registration.sensorType} sensor registered
                        </span>
                        <div className="text-green-600 mt-1">
                          ID: {registration.sensorId}
                        </div>
                      </div>
                      <span className="text-green-500 text-xs">
                        {new Date(Number(registration.timestamp) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentRegistrations.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No recent sensor registrations
            </div>
          )}
        </>
      )}

      {/* Connection Instructions */}
      {!isConnected && (
        <div className="text-center py-4">
          <p className="text-gray-600 text-sm mb-2">
            Unable to connect to Sui testnet
          </p>
          <p className="text-xs text-gray-500">
            Check your internet connection and try refreshing the page
          </p>
        </div>
      )}
    </div>
  );
};

export default BlockchainStatus; 