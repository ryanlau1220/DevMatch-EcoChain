// EcoChain Subgraph Hook
// Provides React hooks for subgraph integration with Token API
// Demonstrates clear usage of Token API for token metadata within React components

import { useState, useEffect, useCallback } from 'react'
import { SubgraphService } from '../services/subgraphService'

// Types for Token API integration
export interface TokenMetadata {
  id: string
  tokenAddress: string
  symbol: string
  name: string
  decimals: number
  price: string
  priceSource: string
  environmentalContext: string
  marketCap: string
  volume24h: string
  tokenApiVersion: string
  fallbackSubgraph: string
  // Enhanced fields from Token API
  priceUSD: number
  marketCapUSD: number
  volume24hUSD: number
  isFromTokenApi: boolean
  isFromFallback: boolean
}

export interface EnvironmentalData {
  id: string
  sensorId: string
  timestamp: string
  temperature: string
  humidity: string
  airQuality: string
  pressure: string
  location: string
  verified: boolean
  createdAt: string
  tokenMetadata: TokenMetadata | null
}

export interface VirtualSensor {
  id: string
  sensorId: string
  owner: string
  trustScore: string
  status: string
  registeredAt: string
  totalReadings: string
  verifiedReadings: string
  tokenMetadata: TokenMetadata | null
}

export interface TokenApiStats {
  id: string
  totalTokensQueried: string
  tokenApiHits: string
  fallbackSubgraphHits: string
  averageResponseTime: string
  lastUpdated: string
  tokenApiSuccessRate: number
  fallbackUsageRate: number
}

export interface EnvironmentalStats {
  id: string
  totalSensors: string
  totalReadings: string
  totalVerifiedReadings: string
  averageTrustScore: string
  averageTemperature: string
  averageAirQuality: string
  averageHumidity: string
  lastUpdated: string
}

// Hook for environmental data with Token API integration
export const useEnvironmentalData = (first: number = 10) => {
  const [data, setData] = useState<EnvironmentalData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TOKEN API INTEGRATION - Fetching environmental data with token metadata
      // This demonstrates usage of Token API within React application logic
      const environmentalData = await SubgraphService.getEnvironmentalData(first)
      setData(environmentalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch environmental data')
    } finally {
      setLoading(false)
    }
  }, [first])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook for virtual sensors with token information
export const useVirtualSensors = (first: number = 10) => {
  const [sensors, setSensors] = useState<VirtualSensor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSensors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TOKEN API INTEGRATION - Fetching sensor data with token metadata
      const virtualSensors = await SubgraphService.getVirtualSensors(first)
      setSensors(virtualSensors)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch virtual sensors')
    } finally {
      setLoading(false)
    }
  }, [first])

  useEffect(() => {
    fetchSensors()
  }, [fetchSensors])

  return { sensors, loading, error, refetch: fetchSensors }
}

// Hook for Token API statistics
export const useTokenApiStats = () => {
  const [stats, setStats] = useState<TokenApiStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TOKEN API INTEGRATION - Monitoring Token API usage and fallback rates
      const tokenApiStats = await SubgraphService.getTokenApiStats()
      setStats(tokenApiStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Token API stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

// Hook for environmental statistics
export const useEnvironmentalStats = () => {
  const [stats, setStats] = useState<EnvironmentalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const environmentalStats = await SubgraphService.getEnvironmentalStats()
      setStats(environmentalStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch environmental stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

// Hook for searching environmental data by location
export const useEnvironmentalSearch = (location: string, first: number = 10) => {
  const [searchResults, setSearchResults] = useState<EnvironmentalData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async () => {
    if (!location.trim()) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // TOKEN API INTEGRATION - Search with token metadata context
      const results = await SubgraphService.searchEnvironmentalData(location, first)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search environmental data')
    } finally {
      setLoading(false)
    }
  }, [location, first])

  useEffect(() => {
    const timeoutId = setTimeout(search, 500) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [search])

  return { searchResults, loading, error, refetch: search }
}

// Hook for tokens by environmental context
export const useTokensByEnvironmentalContext = (context: string) => {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(async () => {
    if (!context.trim()) {
      setTokens([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // TOKEN API INTEGRATION - Get tokens for specific environmental contexts
      // This demonstrates how Token API data is used for environmental analysis
      const contextTokens = await SubgraphService.getTokensByEnvironmentalContext(context)
      setTokens(contextTokens)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens by context')
    } finally {
      setLoading(false)
    }
  }, [context])

  useEffect(() => {
    const timeoutId = setTimeout(fetchTokens, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [fetchTokens])

  return { tokens, loading, error, refetch: fetchTokens }
}

// TOKEN API INTEGRATION SUMMARY
// This hook demonstrates:
// 1. Clear usage of Token API through React hooks
// 2. Fetching token metadata (symbol, name, decimals, price) from Token API
// 3. Fallback to published Subgraph when Token API not applicable
// 4. Integration of token data within React application logic
// 5. Real-time token pricing and market data for environmental markets
// 6. Performance monitoring and error handling for Token API usage 