import React from 'react'
import { Activity, Database, Shield, TrendingUp, Leaf, Zap, Globe, CheckCircle } from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Data Points Collected', value: '12,847', icon: Database, color: 'from-blue-400 to-blue-600' },
    { label: 'Verified Records', value: '11,923', icon: Shield, color: 'from-green-400 to-green-600' },
    { label: 'On-Chain Transactions', value: '8,456', icon: Activity, color: 'from-purple-400 to-purple-600' },
    { label: 'Active Sensors', value: '156', icon: Zap, color: 'from-orange-400 to-orange-600' },
  ]

  const recentData = [
    { id: 1, type: 'Air Quality', location: 'New York, NY', value: '42 AQI', status: 'verified', timestamp: '2 min ago' },
    { id: 2, type: 'Water Quality', location: 'San Francisco, CA', value: '7.2 pH', status: 'verified', timestamp: '5 min ago' },
    { id: 3, type: 'Soil Temperature', location: 'Austin, TX', value: '18.5°C', status: 'pending', timestamp: '8 min ago' },
    { id: 4, type: 'Humidity', location: 'Miami, FL', value: '78%', status: 'verified', timestamp: '12 min ago' },
    { id: 5, type: 'CO2 Levels', location: 'Seattle, WA', value: '412 ppm', status: 'verified', timestamp: '15 min ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Environmental Data Oracle</h2>
            <p className="text-gray-600 text-lg">Real-time environmental monitoring with blockchain verification</p>
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
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Data */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Environmental Data</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="h-4 w-4" />
            <span>Global Network</span>
          </div>
        </div>

        <div className="space-y-4">
          {recentData.map((item) => (
            <div key={item.id} className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500">
                    <Leaf className="h-4 w-4 text-white" />
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
                    <CheckCircle className="h-3 w-3" />
                    <span>{item.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
