import React from 'react'
import { X, Shield, Zap, Info } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AUTH_PROVIDERS } from '../config/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading, error } = useAuth()

  if (!isOpen) return null

  const handleProviderLogin = async (providerId: typeof AUTH_PROVIDERS[0]['id']) => {
    try {
      await login(providerId)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Login</h2>
          <p className="text-gray-600">Connect with Sui zkLogin for secure, privacy-preserving authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100/50 border border-red-200/50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6 p-4 rounded-lg bg-blue-100/50 border border-blue-200/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Demo Mode</p>
              <p className="text-blue-700">This is a demonstration of Sui zkLogin. In production, you would configure real OAuth client IDs in your .env file.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {AUTH_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderLogin(provider.id)}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="text-2xl">{provider.icon}</span>
              <span className="font-medium text-gray-800">Continue with {provider.name}</span>
              {isLoading && <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
              <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">(Demo)</span>
            </button>
          ))}
        </div>

        <div className="backdrop-blur-sm bg-blue-50/30 rounded-lg p-4 border border-blue-200/30">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Powered by Sui zkLogin</p>
              <p className="text-blue-700">Zero-knowledge proofs ensure your privacy while providing secure authentication without exposing personal data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
