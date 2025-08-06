import React from 'react'
import { FaSpinner, FaLeaf } from 'react-icons/fa'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'spinner' | 'dots' | 'pulse'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'spinner' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse`}></div>
        )
      default:
        return (
          <FaSpinner className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
        )
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {renderSpinner()}
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
}

// Skeleton components for loading states
export const SkeletonCard: React.FC = () => (
  <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
      <div className="w-16 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="w-24 h-8 bg-gray-300 rounded mb-2"></div>
    <div className="w-32 h-4 bg-gray-300 rounded"></div>
  </div>
)

export const SkeletonChart: React.FC = () => (
  <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
    <div className="w-48 h-6 bg-gray-300 rounded mb-6"></div>
    <div className="w-full h-64 bg-gray-300 rounded"></div>
  </div>
)

export const SkeletonTable: React.FC = () => (
  <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
    <div className="w-48 h-6 bg-gray-300 rounded mb-6"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-24 h-3 bg-gray-300 rounded"></div>
          </div>
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  </div>
)

// Full page loading component
export const FullPageLoader: React.FC<{ message?: string }> = ({ message = 'Loading EcoChain...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 shadow-lg animate-pulse">
          <FaLeaf className="h-12 w-12 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{message}</h2>
      <LoadingSpinner size="lg" text="Initializing..." />
    </div>
  </div>
)

// Chart loading component
export const ChartLoader: React.FC = () => (
  <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" text="Loading chart data..." />
    </div>
  </div>
)

// Data loading component
export const DataLoader: React.FC = () => (
  <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
    <div className="flex items-center justify-center h-32">
      <LoadingSpinner text="Fetching data..." />
    </div>
  </div>
)

export default LoadingSpinner 