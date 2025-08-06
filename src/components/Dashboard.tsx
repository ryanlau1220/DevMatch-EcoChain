import React, { useState, useEffect } from 'react'
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
  FaClock
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
  Cell
} from 'recharts'

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [airQualityData, setAirQualityData] = useState<any[]>([])
  const [temperatureData, setTemperatureData] = useState<any[]>([])
  const [waterQualityData, setWaterQualityData] = useState<any[]>([])

  // Generate real-time simulated data
  const generateSimulatedData = () => {
    const now = new Date()
    const baseTime = now.getTime()
    
    // Generate air quality data (last 24 hours)
    const airQuality = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(baseTime - (23 - i) * 60 * 60 * 1000)
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        aqi: Math.floor(Math.random() * 50) + 20, // 20-70 AQI
        pm25: Math.floor(Math.random() * 15) + 5, // 5-20 μg/m³
        no2: Math.floor(Math.random() * 30) + 10, // 10-40 ppb
        timestamp: time.getTime()
      }
    })

    // Generate temperature data (last 7 days)
    const temperature = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseTime - (6 - i) * 24 * 60 * 60 * 1000)
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temp: Math.floor(Math.random() * 20) + 10, // 10-30°C (wider range)
        humidity: Math.floor(Math.random() * 40) + 30, // 30-70% (lower range)
        timestamp: date.getTime()
      }
    })

    // Generate water quality data (last 12 hours)
    const waterQuality = Array.from({ length: 12 }, (_, i) => {
      const time = new Date(baseTime - (11 - i) * 2 * 60 * 60 * 1000)
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        ph: (Math.random() * 2 + 6.5).toFixed(1), // 6.5-8.5 pH
        turbidity: Math.floor(Math.random() * 10) + 2, // 2-12 NTU
        dissolvedOxygen: (Math.random() * 3 + 6).toFixed(1), // 6-9 mg/L
        timestamp: time.getTime()
      }
    })

    setAirQualityData(airQuality)
    setTemperatureData(temperature)
    setWaterQualityData(waterQuality)
  }

  // Update data every 30 seconds
  useEffect(() => {
    generateSimulatedData()
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      generateSimulatedData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Calculate current statistics
  const currentStats = {
    dataPoints: airQualityData.length + temperatureData.length + waterQualityData.length,
    verifiedRecords: Math.floor((airQualityData.length + temperatureData.length + waterQualityData.length) * 0.95),
    onChainTransactions: Math.floor((airQualityData.length + temperatureData.length + waterQualityData.length) * 0.7),
    activeSensors: 156
  }

  // Recent data points
  const recentData = [
    {
      id: 1,
      type: 'Air Quality',
      location: 'New York, NY',
      value: `${airQualityData[airQualityData.length - 1]?.aqi || 42} AQI`,
      status: 'verified',
      timestamp: '2 min ago',
      icon: FaThermometerHalf,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      type: 'Water Quality',
      location: 'San Francisco, CA',
      value: `${waterQualityData[waterQualityData.length - 1]?.ph || 7.2} pH`,
      status: 'verified',
      timestamp: '5 min ago',
      icon: FaTint,
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      id: 3,
      type: 'Temperature',
      location: 'Austin, TX',
      value: `${temperatureData[temperatureData.length - 1]?.temp || 18.5}°C`,
      status: 'pending',
      timestamp: '8 min ago',
      icon: FaThermometerHalf,
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 4,
      type: 'Wind Speed',
      location: 'Miami, FL',
      value: `${Math.floor(Math.random() * 20) + 5} km/h`,
      status: 'verified',
      timestamp: '12 min ago',
      icon: FaWind,
      color: 'from-green-400 to-green-600'
    }
  ]

  // Sensor distribution data for pie chart
  const sensorDistribution = [
    { name: 'Air Quality', value: 45, color: '#3B82F6' },
    { name: 'Water Quality', value: 30, color: '#06B6D4' },
    { name: 'Temperature', value: 15, color: '#F59E0B' },
    { name: 'Wind Speed', value: 10, color: '#10B981' }
  ]

  const stats = [
    { 
      label: 'Data Points Collected', 
      value: currentStats.dataPoints.toLocaleString(), 
      icon: FaDatabase, 
      color: 'from-blue-400 to-blue-600',
      change: '+12.5%'
    },
    { 
      label: 'Verified Records', 
      value: currentStats.verifiedRecords.toLocaleString(), 
      icon: FaShieldAlt, 
      color: 'from-green-400 to-green-600',
      change: '+8.3%'
    },
    { 
      label: 'On-Chain Transactions', 
      value: currentStats.onChainTransactions.toLocaleString(), 
      icon: FaChartLine, 
      color: 'from-purple-400 to-purple-600',
      change: '+15.2%'
    },
    { 
      label: 'Active Sensors', 
      value: currentStats.activeSensors.toString(), 
      icon: FaBolt, 
      color: 'from-orange-400 to-orange-600',
      change: '+3.1%'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Environmental Data Oracle</h2>
            <p className="text-gray-600 text-lg">Real-time environmental monitoring with blockchain verification</p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FaClock className="h-4 w-4" />
                <span>Last updated: {currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGlobe className="h-4 w-4" />
                <span>Global Network Active</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=400" 
              alt="Environmental monitoring" 
              className="w-32 h-32 rounded-xl object-cover shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Air Quality Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Air Quality Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={airQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="aqi" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="AQI"
              />
              <Line 
                type="monotone" 
                dataKey="pm25" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="PM2.5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Temperature & Humidity (7d)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#F97316" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#06B6D4" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="temp" 
                stroke="#F97316" 
                strokeWidth={3}
                dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                name="Temperature (°C)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="humidity" 
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Water Quality Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Water Quality Parameters (12h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="turbidity" fill="#8B5CF6" name="Turbidity (NTU)" />
              <Bar dataKey="dissolvedOxygen" fill="#06B6D4" name="DO (mg/L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sensor Distribution */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Sensor Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sensorDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sensorDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Data */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Environmental Data</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaGlobe className="h-4 w-4" />
            <span>Global Network</span>
          </div>
        </div>

        <div className="space-y-4">
          {recentData.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.id} className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.type}</p>
                      <p className="text-sm text-gray-600">{item.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.timestamp}</p>
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'verified' 
                        ? 'bg-green-100/50 text-green-700 border border-green-200/50' 
                        : 'bg-yellow-100/50 text-yellow-700 border border-yellow-200/50'
                    }`}>
                      <FaCheckCircle className="h-3 w-3" />
                      <span>{item.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
