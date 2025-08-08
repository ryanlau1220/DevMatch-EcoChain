import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface EnvironmentalData {
  id: number;
  sensorId: string;
  timestamp: number;
  airQuality: number;
  temperature: number;
  humidity: number;
  waterQuality: number;
  verified: boolean;
  oracle: string;
  dataHash: string;
}

interface Oracle {
  address: string;
  name: string;
  active: boolean;
  reputation: number;
  totalSubmissions: number;
  successfulVerifications: number;
}

const OracleBridge: React.FC = () => {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData[]>([]);
  const [oracles, setOracles] = useState<Oracle[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<string>('');
  const [showSubmitData, setShowSubmitData] = useState(false);
  const [showRegisterOracle, setShowRegisterOracle] = useState(false);
  const [newData, setNewData] = useState({
    sensorId: '',
    airQuality: 0,
    temperature: 0,
    humidity: 0,
    waterQuality: 0
  });
  const [newOracle, setNewOracle] = useState({
    name: ''
  });

  // Load data from localStorage or use mock data
  useEffect(() => {
    const savedData = localStorage.getItem('ecochain-environmental-data');
    const savedOracles = localStorage.getItem('ecochain-oracles');
    
    if (savedData) {
      setEnvironmentalData(JSON.parse(savedData));
    } else {
      // Initial mock data
      const mockData: EnvironmentalData[] = [
        {
          id: 1,
          sensorId: "SUI_SENSOR_001",
          timestamp: Date.now() - 3600000, // 1 hour ago
          airQuality: 45,
          temperature: 22,
          humidity: 65,
          waterQuality: 85,
          verified: true,
          oracle: "0x1234...5678",
          dataHash: "0xabcd1234..."
        },
        {
          id: 2,
          sensorId: "SUI_SENSOR_002",
          timestamp: Date.now() - 7200000, // 2 hours ago
          airQuality: 52,
          temperature: 24,
          humidity: 58,
          waterQuality: 78,
          verified: true,
          oracle: "0x8765...4321",
          dataHash: "0xefgh5678..."
        },
        {
          id: 3,
          sensorId: "SUI_SENSOR_001",
          timestamp: Date.now() - 10800000, // 3 hours ago
          airQuality: 48,
          temperature: 21,
          humidity: 70,
          waterQuality: 82,
          verified: false,
          oracle: "0xabcd...efgh",
          dataHash: "0xijkl9012..."
        }
      ];
      setEnvironmentalData(mockData);
      localStorage.setItem('ecochain-environmental-data', JSON.stringify(mockData));
    }

    if (savedOracles) {
      setOracles(JSON.parse(savedOracles));
    } else {
      // Initial mock oracles
      const mockOracles: Oracle[] = [
        {
          address: "0x1234...5678",
          name: "EcoOracle Alpha",
          active: true,
          reputation: 150,
          totalSubmissions: 45,
          successfulVerifications: 42
        },
        {
          address: "0x8765...4321",
          name: "GreenData Validator",
          active: true,
          reputation: 120,
          totalSubmissions: 32,
          successfulVerifications: 30
        },
        {
          address: "0xabcd...efgh",
          name: "Environmental Bridge",
          active: true,
          reputation: 95,
          totalSubmissions: 18,
          successfulVerifications: 15
        }
      ];
      setOracles(mockOracles);
      localStorage.setItem('ecochain-oracles', JSON.stringify(mockOracles));
    }
  }, []);

  const submitEnvironmentalData = () => {
    if (!newData.sensorId) return;

    const data: EnvironmentalData = {
      id: environmentalData.length + 1,
      sensorId: newData.sensorId,
      timestamp: Date.now(),
      airQuality: newData.airQuality,
      temperature: newData.temperature,
      humidity: newData.humidity,
      waterQuality: newData.waterQuality,
      verified: false,
      oracle: "0x1234...5678", // Mock oracle address
      dataHash: `0x${Math.random().toString(16).substr(2, 8)}...`
    };

    const updatedData = [data, ...environmentalData];
    setEnvironmentalData(updatedData);
    localStorage.setItem('ecochain-environmental-data', JSON.stringify(updatedData));
    setShowSubmitData(false);
    setNewData({ sensorId: '', airQuality: 0, temperature: 0, humidity: 0, waterQuality: 0 });
  };

  const registerOracle = () => {
    if (!newOracle.name) return;

    const oracle: Oracle = {
      address: "0x" + Math.random().toString(16).substr(2, 8) + "...",
      name: newOracle.name,
      active: true,
      reputation: 100,
      totalSubmissions: 0,
      successfulVerifications: 0
    };

    const updatedOracles = [...oracles, oracle];
    setOracles(updatedOracles);
    localStorage.setItem('ecochain-oracles', JSON.stringify(updatedOracles));
    setShowRegisterOracle(false);
    setNewOracle({ name: '' });
  };

  const verifyData = (dataId: number) => {
    const updatedData = environmentalData.map(data => 
      data.id === dataId ? { ...data, verified: true } : data
    );
    setEnvironmentalData(updatedData);
    localStorage.setItem('ecochain-environmental-data', JSON.stringify(updatedData));
  };

  const getAirQualityColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 150) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAirQualityLabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    return 'Unhealthy';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getSensorData = (sensorId: string) => {
    return environmentalData.filter(data => data.sensorId === sensorId);
  };

  const uniqueSensors = [...new Set(environmentalData.map(data => data.sensorId))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Oracle Bridge</h1>
          <p className="text-gray-600">Bridge environmental data from Sui to Ethereum prediction markets</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowSubmitData(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Submit Environmental Data
          </button>
          <button
            onClick={() => setShowRegisterOracle(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Register Oracle
          </button>
        </div>

        {/* Bridge Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Sui Network</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Active Sensors:</span>
                <span className="font-medium">{uniqueSensors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Data Points:</span>
                <span className="font-medium">{environmentalData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verified Data:</span>
                <span className="font-medium text-green-600">
                  {environmentalData.filter(d => d.verified).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Bridge Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Oracles:</span>
                <span className="font-medium">{oracles.filter(o => o.active).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data Transfer Rate:</span>
                <span className="font-medium">2.3/min</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Ethereum Network</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Active Markets:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Liquidity:</span>
                <span className="font-medium">45.2 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data Requests:</span>
                <span className="font-medium">156</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Sensor
          </label>
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Sensors</option>
            {uniqueSensors.map(sensor => (
              <option key={sensor} value={sensor}>{sensor}</option>
            ))}
          </select>
        </div>

        {/* Environmental Data */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Environmental Data</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Sensor ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                  <th className="text-left py-3 px-4 font-semibold">Air Quality</th>
                  <th className="text-left py-3 px-4 font-semibold">Temperature</th>
                  <th className="text-left py-3 px-4 font-semibold">Humidity</th>
                  <th className="text-left py-3 px-4 font-semibold">Water Quality</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Oracle</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {environmentalData
                  .filter(data => !selectedSensor || data.sensorId === selectedSensor)
                  .map((data) => (
                    <tr key={data.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{data.sensorId}</td>
                      <td className="py-3 px-4 text-sm">{formatTime(data.timestamp)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getAirQualityColor(data.airQuality)}`}>
                          {data.airQuality} ({getAirQualityLabel(data.airQuality)})
                        </span>
                      </td>
                      <td className="py-3 px-4">{data.temperature}°C</td>
                      <td className="py-3 px-4">{data.humidity}%</td>
                      <td className="py-3 px-4">{data.waterQuality}/100</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          data.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {data.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{data.oracle}</td>
                      <td className="py-3 px-4">
                        {!data.verified && (
                          <button
                            onClick={() => verifyData(data.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Oracles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Registered Oracles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oracles.map((oracle) => (
              <div key={oracle.address} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{oracle.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    oracle.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {oracle.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span className="font-mono">{oracle.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reputation:</span>
                    <span className="font-medium">{oracle.reputation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submissions:</span>
                    <span className="font-medium">{oracle.totalSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Success Rate:</span>
                    <span className="font-medium">
                      {oracle.totalSubmissions > 0 
                        ? ((oracle.successfulVerifications / oracle.totalSubmissions) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Data Trends</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Air Quality Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getSensorData(selectedSensor || uniqueSensors[0] || '').slice(-10).map(data => ({
                    time: new Date(data.timestamp).toLocaleTimeString(),
                    aqi: data.airQuality
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="aqi" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Oracle Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={oracles.map(oracle => ({
                    name: oracle.name,
                    submissions: oracle.totalSubmissions,
                    verifications: oracle.successfulVerifications
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="submissions" fill="#3B82F6" />
                    <Bar dataKey="verifications" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Data Modal */}
        {showSubmitData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Submit Environmental Data</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sensor ID
                  </label>
                  <input
                    type="text"
                    value={newData.sensorId}
                    onChange={(e) => setNewData({...newData, sensorId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SUI_SENSOR_001"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Air Quality
                    </label>
                    <input
                      type="number"
                      value={newData.airQuality}
                      onChange={(e) => setNewData({...newData, airQuality: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      value={newData.temperature}
                      onChange={(e) => setNewData({...newData, temperature: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="-50"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      value={newData.humidity}
                      onChange={(e) => setNewData({...newData, humidity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water Quality
                    </label>
                    <input
                      type="number"
                      value={newData.waterQuality}
                      onChange={(e) => setNewData({...newData, waterQuality: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={submitEnvironmentalData}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Submit Data
                </button>
                <button
                  onClick={() => setShowSubmitData(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Register Oracle Modal */}
        {showRegisterOracle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Register Oracle</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oracle Name
                  </label>
                  <input
                    type="text"
                    value={newOracle.name}
                    onChange={(e) => setNewOracle({...newOracle, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="My Oracle"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={registerOracle}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Register Oracle
                </button>
                <button
                  onClick={() => setShowRegisterOracle(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OracleBridge; 