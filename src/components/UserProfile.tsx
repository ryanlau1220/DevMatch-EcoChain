import React, { useState, useRef, useEffect } from 'react'
import { FaSignOutAlt, FaUser, FaCopy, FaExternalLinkAlt, FaChevronDown } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const copyAddress = async () => {
    if (user?.suiAddress) {
      await navigator.clipboard.writeText(user.suiAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200"
      >
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800 truncate max-w-24">{user.name}</p>
          <p className="text-xs text-gray-600">{user.provider}</p>
        </div>
        <FaChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50">
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user.picture}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100/50 text-blue-700 border border-blue-200/50">
                    {user.provider}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100/50 text-green-700 border border-green-200/50">
                    zkLogin
                  </span>
                </div>
              </div>
            </div>

            {/* Sui Address */}
            <div className="mb-4 p-3 rounded-lg bg-gray-100/30 border border-gray-200/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Sui Address</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={copyAddress}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                    title="Copy address"
                  >
                    <FaCopy className="h-3 w-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => window.open(`https://suiexplorer.com/address/${user.suiAddress}`, '_blank')}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                    title="View on Sui Explorer"
                  >
                    <FaExternalLinkAlt className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-mono text-gray-800 break-all">
                {user.suiAddress}
              </p>
              {copied && (
                <p className="text-xs text-green-600 mt-1">Address copied!</p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Add profile management logic here
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <FaUser className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Manage Profile</span>
              </button>
              
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-100/20 transition-colors text-left text-red-600"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
