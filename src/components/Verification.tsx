import React, { useState } from 'react'
import { FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaClock, FaKey, FaHashtag, FaFileAlt, FaBolt } from 'react-icons/fa'

const Verification: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'complete'>('idle')
  
  const verificationSteps = [
    { id: 1, name: 'Data Integrity Check', status: 'complete', icon: FaFileAlt },
    { id: 2, name: 'Digital Signature Verification', status: 'complete', icon: FaKey },
    { id: 3, name: 'Hash Validation', status: 'verifying', icon: FaHashtag },
    { id: 4, name: 'Consensus Verification', status: 'pending', icon: FaShieldAlt },
  ]

  const recentVerifications = [
    {
      id: 1,
      dataType: 'Air Quality Reading',
      location: 'New York, NY',
      value: '42 AQI',
      hash: '0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
      status: 'verified',
      timestamp: '2 minutes ago',
      confidence: 98.5
    },
    {
      id: 2,
      dataType: 'Water pH Level',
      location: 'San Francisco, CA',
      value: '7.2 pH',
      hash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'verified',
      timestamp: '5 minutes ago',
      confidence: 99.2
    },
    {
      id: 3,
      dataType: 'Temperature Reading',
      location: 'Austin, TX',
      value: '18.5°C',
      hash: '0x60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752',
      status: 'pending',
      timestamp: '8 minutes ago',
      confidence: 95.8
    }
  ]

  const startVerification = () => {
    setVerificationStatus('verifying')
    setTimeout(() => {
      setVerificationStatus('complete')
    }, 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Verification System</h2>
            <p className="text-gray-600">Cryptographic verification and consensus validation of environmental data</p>
          </div>
          <button
            onClick={startVerification}
            disabled={verificationStatus === 'verifying'}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-lg hover:from-purple-500 hover:to-blue-600 transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            <FaShieldAlt className={`h-5 w-5 ${verificationStatus === 'verifying' ? 'animate-pulse' : ''}`} />
            <span>{verificationStatus === 'verifying' ? 'Verifying...' : 'Start Verification'}</span>
          </button>
        </div>
      </div>

      {/* Verification Process */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Verification Process</h3>
        
        <div className="space-y-4">
          {verificationSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = verificationStatus === 'verifying' && step.status === 'verifying'
            
            return (
              <div key={step.id} className="flex items-center space-x-4 p-4 backdrop-blur-sm bg-white/5 rounded-lg border border-white/10">
                <div className={`p-3 rounded-lg ${
                  step.status === 'complete' 
                    ? 'bg-green-500 shadow-lg' 
                    : step.status === 'verifying'
                    ? 'bg-blue-500 shadow-lg animate-pulse'
                    : 'bg-gray-400 shadow-lg'
                }`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{step.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {step.status === 'complete' && (
                      <>
                        <FaCheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Completed</span>
                      </>
                    )}
                    {step.status === 'verifying' && (
                      <>
                        <FaClock className="h-4 w-4 text-blue-500 animate-spin" />
                        <span className="text-sm text-blue-600">In Progress</span>
                      </>
                    )}
                    {step.status === 'pending' && (
                      <>
                        <FaClock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Pending</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-sm text-gray-600">Step {step.id}/4</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Verifications</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaBolt className="h-4 w-4" />
            <span>{recentVerifications.length} recent verifications</span>
          </div>
        </div>

        <div className="space-y-4">
          {recentVerifications.map((verification) => (
            <div key={verification.id} className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    verification.status === 'verified' 
                      ? 'bg-green-500 shadow-lg' 
                      : 'bg-yellow-500 shadow-lg'
                  }`}>
                    {verification.status === 'verified' ? (
                      <FaCheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <FaClock className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{verification.dataType}</p>
                    <p className="text-sm text-gray-600">{verification.location}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{verification.value}</p>
                  <p className="text-xs text-gray-500">{verification.timestamp}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Data Hash:</span>
                  <code className="text-xs bg-gray-100/50 px-2 py-1 rounded font-mono">
                    {verification.hash.substring(0, 20)}...
                  </code>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Confidence Score:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                        style={{ width: `${verification.confidence}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-gray-800">{verification.confidence}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    verification.status === 'verified'
                      ? 'bg-green-100/50 text-green-700 border border-green-200/50'
                      : 'bg-yellow-100/50 text-yellow-700 border border-yellow-200/50'
                  }`}>
                    {verification.status === 'verified' ? (
                      <FaCheckCircle className="h-3 w-3" />
                    ) : (
                      <FaExclamationTriangle className="h-3 w-3" />
                    )}
                    <span>{verification.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Methods */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <FaKey className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Digital Signatures</h4>
            <p className="text-sm text-gray-600">Cryptographic signatures ensure data authenticity and non-repudiation</p>
          </div>
          <div className="text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <FaHashtag className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Hash Validation</h4>
            <p className="text-sm text-gray-600">SHA-256 hashing provides tamper-evident data integrity verification</p>
          </div>
          <div className="text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <FaShieldAlt className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Consensus Mechanism</h4>
            <p className="text-sm text-gray-600">Multi-node consensus ensures distributed verification reliability</p>
          </div>
          <div className="text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <FaFileAlt className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Data Integrity</h4>
            <p className="text-sm text-gray-600">Comprehensive validation of data format, range, and consistency</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Verification
