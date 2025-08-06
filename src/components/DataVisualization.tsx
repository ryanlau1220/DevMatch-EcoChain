import React, { useState } from 'react'
import { BarChart3, TrendingUp, MapPin, Calendar, Filter, Download, RefreshCw } from 'lucide-react'

const DataVisualization: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('airQuality')
  const [timeRange, setTimeRange] = useState('24h')

  const metrics = [
    { id: 'airQuality', name: 'Air Quality Index', unit: 'AQI', color: 'from-blue-400 to-blue-600' },
    { id: 'temperature', name: 'Temperature', unit: '°C', color: 'from-red-400 to-red-600' },
    { id: 'humidity', name: 'Humidity', unit: '%', color: 'from-cyan-400 to-cyan-600' },
    { id: 'co2', name: 'CO2 Levels', unit: 'ppm', color: 'from-green-400 to-green-600' },
  ]

  const timeRanges = [
    { id: '1h', name: '1 Hour' },
    { id: '24h', name: '24 Hours' },
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
  ]

  // Mock data for visualization
  const generateMockData = (metric: string) => {
    const dataPoints = 24
    const data = []
    
    for (let i = 0; i < dataPoints; i++) {
      let value
      switch (metric) {
        case 'airQuality':
          value = Math.floor(Math.random() * 100) + 20
          break
        case 'temperature':
          value = Math.floor(Math.random() * 20) + 15
          break
        case 'humidity':
          value = Math.floor(Math.random() * 40) + 40
          break
        case 'co2':
          value = Math.floor(Math.random() * 100) + 350
          break
        default:
          value = Math.floor(Math.random() * 100)
      }
      
      data.push({
        time: `${23 - i}:00`,
        value,
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
      })
    }
    
    return data.reverse()
  }

  const currentData = generateMockData(selectedMetric)
  const currentMetric = metrics.find(m => m.id === selectedMetric)
  const maxValue = Math.max(...currentData.map(d => d.value))

  const locationData = [
    { city: 'New York', value: 45, status: 'moderate' },
    { city: 'Los Angeles', value: 78, status: 'unhealthy' },
    { city: 'Chicago', value: 32, status: 'good' },
    { city: 'Houston', value: 56, status: 'moderate' },
    { city: 'Phoenix', value: 89, status: 'unhealthy' },
    { city: 'Philadelphia', value: 41, status: 'good' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100/50 border-green-200/50'
      case 'moderate': return 'text-yellow-600 bg-yellow-100/50 border-yellow-200/50'
      case 'unhealthy': return 'text-red-600 bg-red-100/50 border-red-200/50'
      default: return 'text-gray-600 bg-gray-100/50 border-gray-200/50'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Data Visualization</h2>
            <p className="text-gray-600">Real-time analytics and trends of environmental monitoring data</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200">
              <Download className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg hover:from-blue-500 hover:to-purple-600 transition-all duration-200 shadow-lg">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Metric</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedMetric === metric.id
                    ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                    : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-gray-800'
                }`}
              >
                {metric.name}
              </button>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Time Range</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range.id
                    ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                    : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-gray-800'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{currentMetric?.name} Trends</h3>
            <p className="text-sm text-gray-600">Last {timeRanges.find(r => r.id === timeRange)?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">
                {currentData[currentData.length - 1]?.value} {currentMetric?.unit}
              </p>
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+2.3% from yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end space-x-1 overflow-x-auto">
          {currentData.map((point, index) => (
            <div key={index} className="flex-1 min-w-[20px] flex flex-col items-center">
              <div
                className={`w-full bg-gradient-to-t ${currentMetric?.color} rounded-t-sm transition-all duration-300 hover:opacity-80`}
                style={{ height: `${(point.value / maxValue) * 200}px` }}
                title={`${point.time}: ${point.value} ${currentMetric?.unit}`}
              ></div>
              <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                {point.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Location-based Data */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Regional Data Overview</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>6 monitoring stations</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationData.map((location, index) => (
            <div key={index} className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-800">{location.city}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(location.status)}`}>
                  {location.status}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {location.value} {currentMetric?.unit}
                </span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${currentMetric?.color} transition-all duration-300`}
                    style={{ width: `${(location.value / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Average</p>
              <p className="text-sm text-gray-600">24h period</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {Math.round(currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length)} {currentMetric?.unit}
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Peak</p>
              <p className="text-sm text-gray-600">Highest value</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {Math.max(...currentData.map(d => d.value))} {currentMetric?.unit}
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Minimum</p>
              <p className="text-sm text-gray-600">Lowest value</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {Math.min(...currentData.map(d => d.value))} {currentMetric?.unit}
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-400 to-red-500 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Variance</p>
              <p className="text-sm text-gray-600">Data spread</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {(Math.max(...currentData.map(d => d.value)) - Math.min(...currentData.map(d => d.value))).toFixed(1)} {currentMetric?.unit}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DataVisualization
