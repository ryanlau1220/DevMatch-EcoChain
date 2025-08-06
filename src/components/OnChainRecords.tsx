import React, { useState } from 'react'
import { FaDatabase, FaLink, FaClock, FaHashtag, FaCheckCircle, FaExternalLinkAlt, FaCopy, FaSearch } from 'react-icons/fa'

const OnChainRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const blockchainRecords = [
    {
      id: 1,
      blockNumber: 18456789,
      transactionHash: '0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
      dataType: 'Air Quality Index',
      location: 'New York, NY',
      value: '42 AQI',
      timestamp: '2024-01-15 14:30:25 UTC',
      gasUsed: '21,000',
      confirmations: 1247,
      status: 'confirmed'
    },
    {
      id: 2,
      blockNumber: 18456788,
      transactionHash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      dataType: 'Water pH Level',
      location: 'San Francisco, CA',
      value: '7.2 pH',
      timestamp: '2024-01-15 14:28:15 UTC',
      gasUsed: '21,000',
      confirmations: 1248,
      status: 'confirmed'
    },
    {
      id: 3,
      blockNumber: 18456787,
      transactionHash: '0x60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752',
      dataType: 'Temperature Reading',
      location: 'Austin, TX',
      value: '18.5°C',
      timestamp: '2024-01-15 14:25:45 UTC',
      gasUsed: '21,000',
      confirmations: 1249,
      status: 'confirmed'
    },
    {
      id: 4,
      blockNumber: 18456786,
      transactionHash: '0x356a192b7913b04c54574d18c28d46e6395428ab60d23cf9c42e2c71e5c53f57',
      dataType: 'CO2 Concentration',
      location: 'Seattle, WA',
      value: '412 ppm',
      timestamp: '2024-01-15 14:22:30 UTC',
      gasUsed: '21,000',
      confirmations: 1250,
      status: 'confirmed'
    },
    {
      id: 5,
      blockNumber: 18456785,
      transactionHash: '0xda4b9237bacccdf19c0760cab7aec4a8359010b0',
      dataType: 'Humidity Level',
      location: 'Miami, FL',
      value: '78%',
      timestamp: '2024-01-15 14:20:10 UTC',
      gasUsed: '21,000',
      confirmations: 1251,
      status: 'confirmed'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredRecords = blockchainRecords.filter(record =>
    record.dataType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">On-Chain Environmental Records</h2>
            <p className="text-gray-600">Immutable blockchain records of verified environmental data</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-100/50 backdrop-blur-sm border border-green-200/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by data type, location, or transaction hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 shadow-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{blockchainRecords.length}</p>
            <p className="text-sm text-gray-600">Total Records</p>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Blockchain Transactions</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaDatabase className="h-4 w-4" />
            <span>Ethereum Mainnet</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div 
                key={record.id} 
                className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Data Type</p>
                    <p className="font-medium text-gray-800">{record.dataType}</p>
                    <p className="text-sm text-gray-600">{record.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Value</p>
                    <p className="font-semibold text-gray-800">{record.value}</p>
                    <p className="text-xs text-gray-500">{record.timestamp}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Block</p>
                    <p className="font-mono text-sm text-gray-800">#{record.blockNumber}</p>
                    <p className="text-xs text-gray-500">{record.confirmations} confirmations</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100/50 text-green-700 border border-green-200/50">
                        <FaCheckCircle className="h-3 w-3" />
                        <span>{record.status}</span>
                      </div>
                    </div>
                    <FaExternalLinkAlt className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Transaction Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Environmental Data</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium text-gray-800">{selectedRecord.dataType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">{selectedRecord.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Value</p>
                      <p className="font-semibold text-gray-800 text-lg">{selectedRecord.value}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Blockchain Info</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Block Number</p>
                      <p className="font-mono text-gray-800">#{selectedRecord.blockNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confirmations</p>
                      <p className="font-medium text-gray-800">{selectedRecord.confirmations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gas Used</p>
                      <p className="font-medium text-gray-800">{selectedRecord.gasUsed}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Transaction Hash</h4>
                <div className="flex items-center space-x-2 p-3 bg-gray-100/50 backdrop-blur-sm rounded-lg border border-white/20">
                  <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                    {selectedRecord.transactionHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(selectedRecord.transactionHash)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <FaCopy className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Timestamp</h4>
                <div className="flex items-center space-x-2">
                  <FaClock className="h-4 w-4 text-gray-600" />
                  <p className="text-gray-800">{selectedRecord.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-700">Verified & Confirmed</span>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <FaExternalLinkAlt className="h-4 w-4" />
                  <span>View on Etherscan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
              <FaLink className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Network</p>
              <p className="text-sm text-gray-600">Ethereum Mainnet</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">99.9%</p>
          <p className="text-sm text-gray-600">Uptime</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 shadow-lg">
              <FaHashtag className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Average Gas</p>
              <p className="text-sm text-gray-600">Per Transaction</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">21,000</p>
          <p className="text-sm text-gray-600">Gas Units</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg">
              <FaClock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Block Time</p>
              <p className="text-sm text-gray-600">Average</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">12s</p>
          <p className="text-sm text-gray-600">Confirmation</p>
        </div>
      </div>
    </div>
  )
}

export default OnChainRecords
