import React, { useState, useEffect } from 'react';
import { 
  FaNetworkWired, 
  FaDatabase, 
  FaLink, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaPlus,
  FaExchangeAlt,
  FaStar,
  FaEye,
  FaCog,
  FaHistory,
  FaQrcode,
  FaCopy,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { blockchainService, BLOCKCHAIN_CONFIG, BlockchainSensor } from '../services/blockchain';
import LoadingSpinner from './LoadingSpinner';

const BlockchainManagement: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [registryStats, setRegistryStats] = useState<any>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [userSensors, setUserSensors] = useState<BlockchainSensor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'register' | 'transfer' | 'trust'>('overview');

  // Form states
  const [sensorId, setSensorId] = useState('');
  const [sensorType, setSensorType] = useState('air_quality');
  const [transferAddress, setTransferAddress] = useState('');
  const [selectedSensor, setSelectedSensor] = useState<BlockchainSensor | null>(null);
  const [newTrustScore, setNewTrustScore] = useState(50);

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
        const registrations = await blockchainService.getRecentRegistrations(10);
        setRecentRegistrations(registrations);

        // Fetch user's sensors (using a demo address for now)
        const demoAddress = '0xfe437a5797e88395e73bf78f3c7cd01b099bbcd6ecbc57845341113a12c9669b';
        const sensors = await blockchainService.getSensorsByOwner(demoAddress);
        setUserSensors(sensors);

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

  const handleRegisterSensor = async () => {
    if (!sensorId.trim()) {
      alert('Please enter a sensor ID');
      return;
    }

    try {
      // For demo purposes, we'll show a success message
      // In a real implementation, you would need to:
      // 1. Get the user's keypair from their wallet
      // 2. Call blockchainService.registerSensor()
      // 3. Handle the transaction result
      
      alert(`Sensor registration initiated!\nSensor ID: ${sensorId}\nType: ${sensorType}\n\nNote: This is a demo. In production, this would create a real blockchain transaction.`);
      
      // Clear the form
      setSensorId('');
      setSensorType('air_quality');
      
      // Refresh the data
      const demoAddress = '0xfe437a5797e88395e73bf78f3c7cd01b099bbcd6ecbc57845341113a12c9669b';
      const sensors = await blockchainService.getSensorsByOwner(demoAddress);
      setUserSensors(sensors);
      
    } catch (error) {
      alert(`Error registering sensor: ${error}`);
    }
  };

  const handleTransferSensor = async () => {
    if (!selectedSensor || !transferAddress.trim()) {
      alert('Please select a sensor and enter transfer address');
      return;
    }

    try {
      // For demo purposes, we'll show a success message
      // In a real implementation, you would need to:
      // 1. Get the user's keypair from their wallet
      // 2. Call blockchainService.transferSensor()
      // 3. Handle the transaction result
      
      alert(`Sensor transfer initiated!\nSensor: ${selectedSensor.sensorId}\nTo: ${transferAddress}\n\nNote: This is a demo. In production, this would create a real blockchain transaction.`);
      
      // Clear the form
      setSelectedSensor(null);
      setTransferAddress('');
      
      // Refresh the data
      const demoAddress = '0xfe437a5797e88395e73bf78f3c7cd01b099bbcd6ecbc57845341113a12c9669b';
      const sensors = await blockchainService.getSensorsByOwner(demoAddress);
      setUserSensors(sensors);
      
    } catch (error) {
      alert(`Error transferring sensor: ${error}`);
    }
  };

  const handleUpdateTrustScore = async () => {
    if (!selectedSensor) {
      alert('Please select a sensor');
      return;
    }

    if (newTrustScore < 0 || newTrustScore > 100) {
      alert('Trust score must be between 0 and 100');
      return;
    }

    try {
      // For demo purposes, we'll show a success message
      // In a real implementation, you would need to:
      // 1. Get the user's keypair from their wallet
      // 2. Call blockchainService.updateTrustScore()
      // 3. Handle the transaction result
      
      alert(`Trust score update initiated!\nSensor: ${selectedSensor.sensorId}\nNew Score: ${newTrustScore}\n\nNote: This is a demo. In production, this would create a real blockchain transaction.`);
      
      // Clear the form
      setSelectedSensor(null);
      setNewTrustScore(50);
      
      // Refresh the data
      const demoAddress = '0xfe437a5797e88395e73bf78f3c7cd01b099bbcd6ecbc57845341113a12c9669b';
      const sensors = await blockchainService.getSensorsByOwner(demoAddress);
      setUserSensors(sensors);
      
    } catch (error) {
      alert(`Error updating trust score: ${error}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Connecting to blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Blockchain Management</h2>
            <p className="text-gray-600 text-lg">Manage your environmental sensors on the Sui blockchain</p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FaNetworkWired className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <span>{isConnected ? 'Connected to Sui Testnet' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaDatabase className="h-4 w-4" />
                <span>Package: {BLOCKCHAIN_CONFIG.PACKAGE_ID.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              <FaQrcode className={`h-16 w-16 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 shadow-lg">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'overview', label: 'Overview', icon: FaEye },
            { id: 'sensors', label: 'My Sensors', icon: FaDatabase },
            { id: 'register', label: 'Register Sensor', icon: FaPlus },
            { id: 'transfer', label: 'Transfer', icon: FaExchangeAlt },
            { id: 'trust', label: 'Trust Scores', icon: FaStar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="backdrop-blur-md bg-red-50/10 rounded-xl p-6 border border-red-200/20 shadow-lg">
          <div className="flex items-center space-x-3">
            <FaExclamationTriangle className="text-red-500 h-6 w-6" />
            <div>
              <h3 className="text-red-800 font-semibold">Connection Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Blockchain Overview</h3>
            
            {/* Network Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <FaNetworkWired className="text-blue-500 h-6 w-6" />
                  <h4 className="font-semibold text-blue-800">Network Status</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span className="font-mono text-blue-600">{BLOCKCHAIN_CONFIG.NETWORK}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <FaDatabase className="text-purple-500 h-6 w-6" />
                  <h4 className="font-semibold text-purple-800">Registry Stats</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Sensors:</span>
                    <span className="font-semibold text-purple-600">
                      {registryStats?.totalSensors || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Sensors:</span>
                    <span className="font-semibold text-purple-600">{userSensors.length}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <FaLink className="text-green-500 h-6 w-6" />
                  <h4 className="font-semibold text-green-800">Contract Info</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Package ID:</span>
                    <button
                      onClick={() => copyToClipboard(BLOCKCHAIN_CONFIG.PACKAGE_ID)}
                      className="font-mono text-green-600 hover:underline flex items-center space-x-1"
                    >
                      <span>{BLOCKCHAIN_CONFIG.PACKAGE_ID.slice(0, 8)}...</span>
                      <FaCopy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span>Registry ID:</span>
                    <button
                      onClick={() => copyToClipboard(BLOCKCHAIN_CONFIG.SENSOR_REGISTRY_ID)}
                      className="font-mono text-green-600 hover:underline flex items-center space-x-1"
                    >
                      <span>{BLOCKCHAIN_CONFIG.SENSOR_REGISTRY_ID.slice(0, 8)}...</span>
                      <FaCopy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
              {recentRegistrations.length > 0 ? (
                <div className="space-y-3">
                  {recentRegistrations.slice(0, 5).map((registration, index) => (
                    <div key={index} className="p-3 bg-green-50/50 border border-green-200/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-green-800">
                            {registration.sensorType} sensor registered
                          </span>
                          <div className="text-green-600 text-sm mt-1">
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaHistory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sensors' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">My Sensors</h3>
            
            {userSensors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSensors.map((sensor) => (
                  <div key={sensor.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-indigo-800">{sensor.sensorType}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sensor.status === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {sensor.status === 0 ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sensor ID:</span>
                        <span className="font-mono text-indigo-600">{sensor.sensorId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trust Score:</span>
                        <span className="font-semibold text-indigo-600">{sensor.trustScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registered:</span>
                        <span className="text-indigo-600">
                          {new Date(sensor.registeredAt * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSensor(sensor);
                          setActiveTab('transfer');
                        }}
                        className="flex-1 px-3 py-1 bg-indigo-500 text-white rounded text-xs hover:bg-indigo-600 transition-colors"
                      >
                        Transfer
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSensor(sensor);
                          setNewTrustScore(sensor.trustScore);
                          setActiveTab('trust');
                        }}
                        className="flex-1 px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                      >
                        Trust Score
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaDatabase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No Sensors Found</h4>
                <p className="text-gray-500 mb-4">You haven't registered any sensors yet.</p>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Register Your First Sensor
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Register New Sensor</h3>
            
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sensor ID
                </label>
                <input
                  type="text"
                  value={sensorId}
                  onChange={(e) => setSensorId(e.target.value)}
                  placeholder="Enter unique sensor ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sensor Type
                </label>
                <select
                  value={sensorType}
                  onChange={(e) => setSensorType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="air_quality">Air Quality</option>
                  <option value="water_quality">Water Quality</option>
                  <option value="temperature">Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="wind_speed">Wind Speed</option>
                  <option value="noise_level">Noise Level</option>
                </select>
              </div>

              <button
                onClick={handleRegisterSensor}
                disabled={!sensorId.trim()}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FaPlus className="inline mr-2" />
                Register Sensor
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Registration Info</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Each sensor becomes a unique NFT on the blockchain</li>
                <li>• You become the owner and can transfer ownership</li>
                <li>• Initial trust score is set to 50</li>
                <li>• Sensor status starts as active</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Transfer Sensor Ownership</h3>
            
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Sensor
                </label>
                <select
                  value={selectedSensor?.id || ''}
                  onChange={(e) => {
                    const sensor = userSensors.find(s => s.id === e.target.value);
                    setSelectedSensor(sensor || null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a sensor...</option>
                  {userSensors.map((sensor) => (
                    <option key={sensor.id} value={sensor.id}>
                      {sensor.sensorType} - {sensor.sensorId}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSensor && (
                <div className="p-4 bg-indigo-50/50 border border-indigo-200/50 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">Selected Sensor</h4>
                  <div className="text-sm text-indigo-700 space-y-1">
                    <div>Type: {selectedSensor.sensorType}</div>
                    <div>ID: {selectedSensor.sensorId}</div>
                    <div>Trust Score: {selectedSensor.trustScore}/100</div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  placeholder="Enter Sui address (0x...)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleTransferSensor}
                disabled={!selectedSensor || !transferAddress.trim()}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FaExchangeAlt className="inline mr-2" />
                Transfer Ownership
              </button>
            </div>

            <div className="mt-8 p-4 bg-orange-50/50 border border-orange-200/50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Transfer Info</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Only the current owner can transfer the sensor</li>
                <li>• Transfer is irreversible once confirmed</li>
                <li>• The recipient becomes the new owner</li>
                <li>• Trust score and status remain unchanged</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'trust' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Manage Trust Scores</h3>
            
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Sensor
                </label>
                <select
                  value={selectedSensor?.id || ''}
                  onChange={(e) => {
                    const sensor = userSensors.find(s => s.id === e.target.value);
                    setSelectedSensor(sensor || null);
                    if (sensor) setNewTrustScore(sensor.trustScore);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a sensor...</option>
                  {userSensors.map((sensor) => (
                    <option key={sensor.id} value={sensor.id}>
                      {sensor.sensorType} - {sensor.sensorId} (Score: {sensor.trustScore})
                    </option>
                  ))}
                </select>
              </div>

              {selectedSensor && (
                <div className="p-4 bg-purple-50/50 border border-purple-200/50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Current Trust Score</h4>
                  <div className="text-2xl font-bold text-purple-600 mb-2">{selectedSensor.trustScore}/100</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedSensor.trustScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Trust Score: {newTrustScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newTrustScore}
                  onChange={(e) => setNewTrustScore(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 (Low)</span>
                  <span>50 (Medium)</span>
                  <span>100 (High)</span>
                </div>
              </div>

              <button
                onClick={handleUpdateTrustScore}
                disabled={!selectedSensor || newTrustScore === selectedSensor.trustScore}
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FaStar className="inline mr-2" />
                Update Trust Score
              </button>
            </div>

            <div className="mt-8 p-4 bg-purple-50/50 border border-purple-200/50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Trust Score Info</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Trust scores range from 0 to 100</li>
                <li>• Higher scores indicate more reliable sensors</li>
                <li>• Scores can be updated by authorized parties</li>
                <li>• Affects data credibility and rewards</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainManagement; 