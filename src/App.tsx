import React, { useState } from 'react'
import { AuthProvider } from './hooks/useAuth'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import DataGeneration from './components/DataGeneration'
import Verification from './components/Verification'
import OnChainRecords from './components/OnChainRecords'
import DataVisualization from './components/DataVisualization'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'generation':
        return <DataGeneration />
      case 'verification':
        return <Verification />
      case 'records':
        return <OnChainRecords />
      case 'visualization':
        return <DataVisualization />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 font-inter">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative z-10">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="container mx-auto px-4 py-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App
