import React, { useState } from 'react'
import { Thermometer, Droplets, Wind, Leaf, MapPin, Calendar, Zap, RefreshCw } from 'lucide-react'

const DataGeneration: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedData, setGeneratedData] = useState<any[]>([])

  const sensorTypes = [
    { id: 'temperature', name: 'Temperature', icon: Thermometer, unit: '°C', range: [15, 35] },
    { id: 'humidity', name: 'Humidity', icon: Droplets, unit: '%', range: [30, 90] },
    { id: 'airQuality', name: 'Air Quality', icon: Wind, unit: 'AQI', range: [20, 150] },
    { id: 'co2', name: 'CO2 Levels', icon: Leaf, unit: 'ppm', range: [350, 450] },
  ]

  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'
  ]

  const generateRandomData = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const newData = sensorTypes.map(sensor => {
        const [min, max] = sensor.range
        const value = (Math.random() * (max - min) + min).toFixed(1)
        const location = locations[Math.floor(Math.random() * locations.length)]
        
        return {
          id: Date.now() + Math.random(),
          type: sensor.name,
          value: `${value} ${sensor.unit}`,
          location,
          timestamp: new Date().toLocaleString(),
          icon: sensor.icon,
          quality: Math.random() > 0.2 ? 'high' : 'medium'
        }
      })
      
      setGeneratedData(prev => [...newData, ...prev].slice(0, 20))
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Data Generation</h2>
            <p className="text-gray-600">Simulate real-time environmental sensor data collection</p>
          </div>
          <button
            onClick={generateRandomData}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate Data'}</span>
          </button>
        </div>
      </div>

      {/* Sensor Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sensorTypes.map((sensor) => {
          const Icon = sensor.icon
          return (
            <div key={sensor.id} className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{sensor.name}</h3>
                  <p className="text-sm text-gray-600">Range: {sensor.range[0]}-{sensor.range[1]} {sensor.unit}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="text-blue-600 font-medium">±0.1 {sensor.unit}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Generated Data */}
      {generatedData.length > 0 && (
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Generated Environmental Data</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Zap className="h-4 w-4" />
              <span>{generatedData.length} data points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedData.map((data) => {
              const Icon = data.icon
              return (
                <div key={data.id} className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{data.type}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {data.location}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      data.quality === 'high' 
                        ? 'bg-green-100/50 text-green-700 border border-green-200/50'
                        : 'bg-yellow-100/50 text-yellow-700 border border-yellow-200/50'
                    }`}>
                      {data.quality} quality
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-800">{data.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {data.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Generation Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Sensor Simulation</h4>
            <p className="text-sm text-gray-600">Realistic environmental data generation based on sensor specifications</p>
          </div>
          <div className="text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Location Mapping</h4>
            <p className="text-sm text-gray-600">Geographic distribution across multiple monitoring stations</p>
          </div>
          <div className="text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Timestamping</h4>
            <p className="text-sm text-gray-600">Precise temporal data for chronological analysis and verification</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataGeneration
