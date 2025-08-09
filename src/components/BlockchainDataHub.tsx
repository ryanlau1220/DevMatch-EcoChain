import React, { useState, useEffect, useMemo } from 'react'
import { 
  FaChartLine, 
  FaDatabase, 
  FaShieldAlt, 
  FaChartBar, 
  FaLeaf, 
  FaBolt, 
  FaGlobe, 
  FaCheckCircle,
  FaThermometerHalf,
  FaTint,
  FaWind,
  FaMapMarkerAlt,
  FaClock,
  FaCloudSun,
  FaExclamationTriangle,
  FaNetworkWired,
  FaSync,
  FaRocket,
  FaEye,
  FaEyeSlash,
  FaDownload,
  FaShare,
  FaCog,
  FaLightbulb
} from 'react-icons/fa'

import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts'

interface EnvironmentalData {
  id: string
  sensorId: string
  timestamp: string
  temperature: string
  humidity: string
  airQuality: string
  pressure: string
  location: string
  verified: boolean
  createdAt: string
  updatedAt: string
}

const BlockchainDataHub: React.FC = () => {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const SUBGRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/118239/ecochain-environmental-data/v0.0.4'

  const fetchEnvironmentalData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const query = `
        {
          environmentalDatas(first: 100, orderBy: timestamp, orderDirection: desc) {
            id
            sensorId
            timestamp
            temperature
            humidity
            airQuality
            pressure
            location
            verified
            createdAt
            updatedAt
          }
        }
      `

      const response = await fetch(SUBGRAPH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const result = await response.json()
      if (result.errors) throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)

      setEnvironmentalData(result.data.environmentalDatas || [])
      setLastSync(new Date())
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (autoRefresh) {
      fetchEnvironmentalData()
      const interval = setInterval(fetchEnvironmentalData, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  useEffect(() => {
    fetchEnvironmentalData()
  }, [])

  const processedData = useMemo(() => {
    return environmentalData.map(data => {
      const timestamp = parseInt(data.timestamp)
      const date = new Date(timestamp * 1000)
      return {
        ...data,
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperatureC: (parseInt(data.temperature) / 100).toFixed(1),
        humidityPct: (parseInt(data.humidity) / 100).toFixed(1),
        timestamp: timestamp
      }
    }).sort((a, b) => a.timestamp - b.timestamp)
  }, [environmentalData])

  const chartData = useMemo(() => {
    return processedData.map(data => ({
      time: data.time,
      temperature: parseFloat(data.temperatureC),
      humidity: parseFloat(data.humidityPct),
      aqi: parseInt(data.airQuality),
      timestamp: data.timestamp
    }))
  }, [processedData])

  if (isLoading && !environmentalData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Connecting to Blockchain</h2>
          <p className="text-gray-500">Fetching real-time environmental data from The Graph...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <FaNetworkWired className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Blockchain Data Hub
              </h1>
              <p className="text-gray-600">Real-time environmental data from The Graph subgraph</p>
            </div>
          </div>
          <button
            onClick={fetchEnvironmentalData}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
          >
            <FaSync className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Data Points</p>
                <p className="text-2xl font-bold">{processedData.length}</p>
              </div>
              <FaDatabase className="text-2xl opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Last Sync</p>
                <p className="text-lg font-bold">{lastSync.toLocaleTimeString()}</p>
              </div>
              <FaNetworkWired className="text-2xl opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Sensors</p>
                <p className="text-2xl font-bold">{new Set(environmentalData.map(d => d.sensorId)).size}</p>
              </div>
              <FaGlobe className="text-2xl opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Auto-Refresh</p>
                <p className="text-lg font-bold">{autoRefresh ? 'ON' : 'OFF'}</p>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-white hover:text-yellow-200 transition-colors"
              >
                {autoRefresh ? <FaEye className="text-2xl" /> : <FaEyeSlash className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaThermometerHalf className="text-red-500 mr-2" />
              Temperature & Humidity Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="left" stroke="#ef4444" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaWind className="text-green-500 mr-2" />
              Air Quality Index (AQI)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="aqi" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaDatabase className="text-blue-500 mr-2" />
          Environmental Data Records
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AQI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedData.map((data, index) => (
                <tr key={data.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(data.timestamp * 1000).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {data.sensorId.slice(0, 8)}...{data.sensorId.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-red-600">{data.temperatureC}°C</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-blue-600">{data.humidityPct}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-green-600">{data.airQuality}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      data.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {data.verified ? <FaCheckCircle className="mr-1" /> : <FaClock className="mr-1" />}
                      {data.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Powered by The Graph Protocol • EcoChain Environmental Data • Real-time Blockchain Integration</p>
        <p className="mt-1">Data updates automatically from smart contract events on Sepolia testnet</p>
      </div>
    </div>
  )
}

export default BlockchainDataHub 