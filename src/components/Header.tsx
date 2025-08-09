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
  FaLink,
  FaRobot,
  FaGlobe
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
    // Main Navigation Items (6 buttons max)
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar, type: 'single' },
    { id: 'blockchain', label: 'Sui Chain', icon: FaLink, type: 'single' },
    { id: 'data-platform', label: 'Data Platform', icon: FaBolt, type: 'dropdown', items: [
      { id: 'generation', label: 'Data Generation', icon: FaBolt },
      { id: 'verification', label: 'Oasis Verification', icon: FaShieldAlt },
      { id: 'records', label: 'On-Chain Records', icon: FaDatabase },
      { id: 'visualization', label: 'Analytics', icon: FaFileAlt },
    ]},
    { id: 'markets', label: 'Markets', icon: FaChartBar, type: 'dropdown', items: [
      { id: 'prediction-markets', label: 'Prediction Markets', icon: FaChartBar },
      { id: 'oracle-bridge', label: 'Oracle Bridge', icon: FaGlobe },
    ]},
    { id: 'ai-agent-chat', label: 'AI Agent Chat', icon: FaRobot, type: 'single' }
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
            <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center max-w-4xl mx-4">
              {navItems.map((item) => {
                const Icon = item.icon
                
                if (item.type === 'single') {
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        activeTab === item.id
                          ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                          : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                    </button>
                  )
                }
                
                if (item.type === 'dropdown') {
                  return (
                    <div key={item.id} className="relative group">
                      <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        activeTab === item.id || item.items?.some(subItem => activeTab === subItem.id)
                          ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                          : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                      }`}>
                        <Icon className="h-4 w-4" />
                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                        <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-md border border-white/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {item.items?.map((subItem) => {
                            const SubIcon = subItem.icon
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => setActiveTab(subItem.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-all duration-200 ${
                                  activeTab === subItem.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <span className="font-medium">{subItem.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }
                
                return null
              })}
            </nav>

            {/* Tablet Navigation - Compact version with dropdowns */}
            <nav className="hidden md:flex lg:hidden items-center space-x-1 flex-1 justify-center max-w-3xl mx-4">
              {navItems.map((item) => {
                const Icon = item.icon
                
                if (item.type === 'single') {
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-xs ${
                        activeTab === item.id
                          ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                          : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                    </button>
                  )
                }
                
                if (item.type === 'dropdown') {
                  return (
                    <div key={item.id} className="relative group">
                      <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-xs ${
                        activeTab === item.id || item.items?.some(subItem => activeTab === subItem.id)
                          ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                          : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                      }`}>
                        <Icon className="h-3 w-3" />
                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                        <svg className="w-2 h-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-40 bg-white/95 backdrop-blur-md border border-white/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {item.items?.map((subItem) => {
                            const SubIcon = subItem.icon
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => setActiveTab(subItem.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all duration-200 ${
                                  activeTab === subItem.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <SubIcon className="h-3 w-3" />
                                <span className="font-medium">{subItem.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }
                
                return null
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
                className="md:hidden p-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200"
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
            <div className="md:hidden border-t border-white/20 py-4">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  
                  if (item.type === 'single') {
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
                  }
                  
                  if (item.type === 'dropdown') {
                    return (
                      <div key={item.id}>
                        <div className="px-4 py-2">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</h3>
                        </div>
                        <div className="space-y-1">
                          {item.items?.map((subItem) => {
                            const SubIcon = subItem.icon
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => handleNavClick(subItem.id)}
                                className={`w-full flex items-center space-x-3 px-8 py-3 rounded-lg transition-all duration-200 ${
                                  activeTab === subItem.id
                                    ? 'bg-white/20 text-gray-800 shadow-lg backdrop-blur-sm border border-white/30'
                                    : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                                }`}
                              >
                                <SubIcon className="h-5 w-5" />
                                <span className="font-medium">{subItem.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }
                  
                  return null
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
