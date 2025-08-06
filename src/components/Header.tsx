import React, { useState } from 'react'
import { 
  FaLeaf, 
  FaDatabase, 
  FaShieldAlt, 
  FaChartBar, 
  FaFileAlt, 
  FaBolt, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaLink
} from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import LoginModal from './LoginModal'
import UserProfile from './UserProfile'

interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'generation', label: 'Data Generation', icon: FaBolt },
    { id: 'verification', label: 'Verification', icon: FaShieldAlt },
    { id: 'records', label: 'On-Chain Records', icon: FaDatabase },
    { id: 'visualization', label: 'Visualization', icon: FaFileAlt },
    { id: 'blockchain', label: 'Blockchain', icon: FaLink },
  ]

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="p-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 shadow-lg">
                <FaLeaf className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">EcoChain</h1>
                <p className="text-xs text-gray-600">Environmental Data Oracle</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-800">EcoChain</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-2xl mx-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      activeTab === item.id
                        ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                        : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Live Status */}
              <div className="hidden sm:block px-3 py-1 rounded-full bg-green-100/50 backdrop-blur-sm border border-green-200/50">
                <span className="text-xs font-medium text-green-700">Live</span>
              </div>
              
              {/* Auth Section */}
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <FaUser className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">Login</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-5 w-5 text-gray-700" />
                ) : (
                  <FaBars className="h-5 w-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/20 py-4">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                          : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </nav>
              
              {/* Mobile Live Status */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-center">
                  <div className="px-3 py-1 rounded-full bg-green-100/50 backdrop-blur-sm border border-green-200/50">
                    <span className="text-xs font-medium text-green-700">System Live</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

export default Header
