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
  FaExclamationTriangle
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
import { LoadingSpinner, SkeletonCard, SkeletonChart } from './LoadingSpinner'
import { useEnvironmentalData } from '../hooks/useEnvironmentalData'

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [airQualityData, setAirQualityData] = useState<any[]>([])
  const [temperatureData, setTemperatureData] = useState<any[]>([])
  const [waterQualityData, setWaterQualityData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastDataUpdate, setLastDataUpdate] = useState<Date>(new Date())
  const [nextUpdateTime, setNextUpdateTime] = useState<Date>(new Date())
  
  const {
    realTimeData,
    lastUpdate
  } = useEnvironmentalData()

  // Generate stable simulated data with fixed time ranges
  // This prevents x-axis jumping by using consistent time intervals
  // Data is generated once and only the latest values are updated
  const generateStableSimulatedData = () => {
    const now = new Date()
    // Round down to the nearest hour for stable time ranges
    const baseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0)
    
    // Generate air quality data (last 24 hours, fixed hourly intervals)
    const airQuality = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(baseTime.getTime() - (23 - i) * 60 * 60 * 1000)
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        aqi: Math.floor(Math.random() * 50) + 20, // 20-70 AQI
        pm25: Math.floor(Math.random() * 15) + 5, // 5-20 μg/m³
        no2: Math.floor(Math.random() * 30) + 10, // 10-40 ppb
        timestamp: time.getTime()
      }
    })

    // Generate temperature data (last 7 days, fixed daily intervals)
    const temperature = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseTime.getFullYear(), baseTime.getMonth(), baseTime.getDate() - (6 - i), 0, 0, 0, 0)
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temp: Math.floor(Math.random() * 20) + 10, // 10-30°C
        humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
        timestamp: date.getTime()
      }
    })

    // Generate water quality data (last 12 hours, fixed 2-hour intervals)
    const waterQuality = Array.from({ length: 12 }, (_, i) => {
      const time = new Date(baseTime.getTime() - (11 - i) * 2 * 60 * 60 * 1000)
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
    setLastDataUpdate(now)
  }

  // Update only the most recent data point (simulates real-time updates)
  const updateLatestDataPoint = () => {
    if (airQualityData.length > 0 && temperatureData.length > 0 && waterQualityData.length > 0) {
      // Update only the latest air quality data point
      const updatedAirQuality = [...airQualityData]
      const latestIndex = updatedAirQuality.length - 1
      updatedAirQuality[latestIndex] = {
        ...updatedAirQuality[latestIndex],
        aqi: Math.floor(Math.random() * 50) + 20,
        pm25: Math.floor(Math.random() * 15) + 5,
        no2: Math.floor(Math.random() * 30) + 10
      }
      setAirQualityData(updatedAirQuality)

      // Update only the latest temperature data point
      const updatedTemperature = [...temperatureData]
      const latestTempIndex = updatedTemperature.length - 1
      updatedTemperature[latestTempIndex] = {
        ...updatedTemperature[latestTempIndex],
        temp: Math.floor(Math.random() * 20) + 10,
        humidity: Math.floor(Math.random() * 40) + 30
      }
      setTemperatureData(updatedTemperature)

      // Update only the latest water quality data point
      const updatedWaterQuality = [...waterQualityData]
      const latestWaterIndex = updatedWaterQuality.length - 1
      updatedWaterQuality[latestWaterIndex] = {
        ...updatedWaterQuality[latestWaterIndex],
        ph: (Math.random() * 2 + 6.5).toFixed(1),
        turbidity: Math.floor(Math.random() * 10) + 2,
        dissolvedOxygen: (Math.random() * 3 + 6).toFixed(1)
      }
      setWaterQualityData(updatedWaterQuality)
    }
  }

  // Update data every hour instead of every 30 seconds to prevent x-axis jumping
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      try {
        // Always try to get real data first
        if (realTimeData) {
          // Real data is available, use it
          setIsLoading(false)
        } else {
          // No real data available, fall back to simulated data
          await new Promise(resolve => setTimeout(resolve, 1000))
          generateStableSimulatedData()
          setIsLoading(false)
        }
      } catch (error) {
        console.warn('Falling back to simulated data:', error)
        generateStableSimulatedData()
        setIsLoading(false)
      }
    }

    loadData()
    
    // Set up hourly updates for simulated data
    const scheduleHourlyUpdate = () => {
      const now = new Date()
      const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0)
      const timeUntilNextHour = nextHour.getTime() - now.getTime()
      
      // Set the next update time for display
      setNextUpdateTime(nextHour)
      
      // Schedule the next update
      const hourlyTimer = setTimeout(() => {
        if (!realTimeData) {
          // Update simulated data every hour
          updateLatestDataPoint()
          setLastDataUpdate(new Date())
          console.log('📊 Chart data updated hourly')
        }
        // Schedule the next update
        scheduleHourlyUpdate()
      }, timeUntilNextHour)
      
      return hourlyTimer
    }
    
    const hourlyTimer = scheduleHourlyUpdate()
    
    return () => clearTimeout(hourlyTimer)
  }, [realTimeData])

  // Update current time only when needed (not every second)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      // Only update if the minute has changed (less frequent updates)
      if (now.getMinutes() !== currentTime.getMinutes()) {
        setCurrentTime(now)
      }
    }, 60000) // Check every minute instead of every second

    return () => clearInterval(timer)
  }, [currentTime])

  // Generate initial simulated data if no real data available
  useEffect(() => {
    if (!realTimeData) {
      generateStableSimulatedData()
    }
  }, [realTimeData])

  // Calculate current statistics
  const currentStats = {
    dataPoints: airQualityData.length + temperatureData.length + waterQualityData.length,
    verifiedRecords: Math.floor((airQualityData.length + temperatureData.length + waterQualityData.length) * 0.95),
    onChainTransactions: Math.floor((airQualityData.length + temperatureData.length + waterQualityData.length) * 0.7),
    activeSensors: 156
  }

  // Recent data points - optimized with useMemo to prevent unnecessary re-renders
  const recentData = useMemo(() => {
    const data = [
      {
        id: 1,
        type: 'Air Quality',
        location: realTimeData ? `${realTimeData.location.city}, ${realTimeData.location.country}` : 'New York, NY',
        value: realTimeData ? `${realTimeData.airQuality.aqi} AQI` : `${airQualityData[airQualityData.length - 1]?.aqi || 42} AQI`,
        status: 'verified',
        timestamp: '2 min ago',
        icon: FaThermometerHalf,
        color: 'from-blue-400 to-blue-600'
      },
      {
        id: 2,
        type: 'Water Quality',
        location: realTimeData ? `${realTimeData.location.city}, ${realTimeData.location.country}` : 'Los Angeles, CA',
        value: `${waterQualityData[waterQualityData.length - 1]?.ph || 7.2} pH`,
        status: 'verified',
        timestamp: '5 min ago',
        icon: FaTint,
        color: 'from-cyan-400 to-cyan-600'
      },
      {
        id: 3,
        type: 'Temperature',
        location: realTimeData ? `${realTimeData.location.city}, ${realTimeData.location.country}` : 'Austin, TX',
        value: realTimeData ? `${realTimeData.temperature.toFixed(1)}°C` : `${temperatureData[airQualityData.length - 1]?.temp || 18.5}°C`,
        status: 'verified',
        timestamp: '2 min ago',
        icon: FaThermometerHalf,
        color: 'from-orange-400 to-orange-600'
      },
      {
        id: 4,
        type: 'Humidity',
        location: realTimeData ? `${realTimeData.location.city}, ${realTimeData.location.country}` : 'Miami, FL',
        value: realTimeData ? `${realTimeData.humidity.toFixed(1)}%` : `${Math.floor(Math.random() * 20) + 5}%`,
        status: 'verified',
        timestamp: '2 min ago',
        icon: FaTint,
        color: 'from-green-400 to-green-600'
      }
    ]
    return data
  }, [realTimeData, airQualityData, temperatureData, waterQualityData])

  // Sensor distribution data for pie chart
  const sensorDistribution = useMemo(() => [
    { name: 'Air Quality', value: 45, color: '#3B82F6' },
    { name: 'Water Quality', value: 30, color: '#06B6D4' },
    { name: 'Temperature', value: 15, color: '#F59E0B' },
    { name: 'Wind Speed', value: 10, color: '#10B981' }
  ], [])

  const stats = useMemo(() => [
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
  ], [currentStats.dataPoints, currentStats.verifiedRecords, currentStats.onChainTransactions, currentStats.activeSensors])

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
              {realTimeData ? (
                <div className="flex items-center space-x-2">
                  <FaCloudSun className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Live data from OpenWeather + IQAir</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaDatabase className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-600">Using simulated data</span>
                </div>
              )}
              {!realTimeData && (
                <div className="flex items-center space-x-2">
                  <FaClock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Data updates hourly</span>
                </div>
              )}
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

      {/* Real-time Environmental Data Display */}
      {realTimeData && (
        <div className="backdrop-blur-md bg-green-500/10 rounded-2xl p-6 border border-green-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <FaCloudSun className="text-green-500 text-xl" />
            <h3 className="text-xl font-semibold text-green-800">Live Environmental Data</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{realTimeData.temperature.toFixed(1)}°C</div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{realTimeData.humidity.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Humidity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{realTimeData.airQuality.aqi}</div>
              <div className="text-sm text-gray-600">Air Quality Index</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{realTimeData.airQuality.pm25.toFixed(1)}</div>
              <div className="text-sm text-gray-600">PM2.5 (μg/m³)</div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            📍 Location: {realTimeData.location.city}, {realTimeData.location.country} | 
            🔍 Sensor ID: {realTimeData.sensorId} | 
            ⏰ Last Update: {new Date(realTimeData.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Simulated Data Status Display */}
      {!realTimeData && (
        <div className="backdrop-blur-md bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <FaDatabase className="text-blue-500 text-xl" />
            <h3 className="text-xl font-semibold text-blue-800">Simulated Environmental Data</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{temperatureData[0]?.temp || 22}°C</div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">{temperatureData[0]?.humidity || 65}%</div>
              <div className="text-sm text-gray-600">Humidity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{airQualityData[0]?.aqi || 45}</div>
              <div className="text-sm text-gray-600">Air Quality Index</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{airQualityData[0]?.pm25 || 12.5}</div>
              <div className="text-sm text-gray-600">PM2.5 (μg/m³)</div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            🔄 Data updates hourly | 
            ⏰ Last Update: {lastDataUpdate.toLocaleTimeString()} | 
            ⏳ Next Update: {nextUpdateTime.toLocaleTimeString()} | 
            📊 Using simulated data for demonstration
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Show skeleton cards while loading
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          // Show actual stats when loaded
          stats.map((stat, index) => {
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
          })
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Air Quality Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Air Quality Trends (24h)</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Loading air quality data..." />
            </div>
          ) : (
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
          )}
        </div>

        {/* Temperature Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Temperature & Humidity (7d)</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Loading temperature data..." />
            </div>
          ) : (
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
          )}
        </div>

        {/* Water Quality Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Water Quality Parameters (12h)</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Loading water quality data..." />
            </div>
          ) : (
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
          )}
        </div>

        {/* Sensor Distribution */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Sensor Distribution</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Loading sensor data..." />
            </div>
          ) : (
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
          )}
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

        {isLoading ? (
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-300 rounded"></div>
                      <div className="w-32 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right space-y-1">
                      <div className="w-16 h-4 bg-gray-300 rounded"></div>
                      <div className="w-20 h-3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default Dashboard
