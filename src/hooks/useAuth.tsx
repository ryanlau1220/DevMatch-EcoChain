import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react'
import { AuthState, User, AuthProvider as AuthProviderType } from '../types/auth'
import { AUTH_PROVIDERS, SUI_CONFIG } from '../config/auth'

interface AuthContextType extends AuthState {
  login: (provider: AuthProviderType['id']) => Promise<void>
  logout: () => void
  handleAuthCallback: (code: string, state: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      }
    case 'LOGIN_ERROR':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: action.payload 
      }
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })

  const generateSuiAddress = (): string => {
    // Generate a realistic-looking Sui address
    const chars = '0123456789abcdef'
    let address = '0x'
    for (let i = 0; i < 64; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
  }

  const generateNonce = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const simulateZkLoginFlow = async (providerId: AuthProviderType['id']): Promise<User> => {
    // Simulate the zkLogin process with realistic timing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const providerData = {
      google: {
        email: 'user@gmail.com',
        name: 'John Doe',
        picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      },
      facebook: {
        email: 'user@facebook.com',
        name: 'Jane Smith',
        picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      },
      twitch: {
        email: 'gamer@twitch.tv',
        name: 'StreamMaster',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      },
      apple: {
        email: 'user@icloud.com',
        name: 'Alex Johnson',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    }

    const userData = providerData[providerId]
    
    return {
      id: `${providerId}_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      provider: providerId,
      suiAddress: generateSuiAddress()
    }
  }

  const handleAuthCallback = useCallback(async (code: string, state: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const stateData = JSON.parse(state)
      const provider = AUTH_PROVIDERS.find(p => p.id === stateData.provider)
      
      if (!provider) {
        throw new Error('Invalid provider')
      }

      // In a real implementation, you would:
      // 1. Exchange code for JWT token with the provider
      // 2. Verify the JWT and extract user info
      // 3. Generate zkLogin proof using Sui's prover service
      // 4. Create Sui address from the proof
      
      const user = await simulateZkLoginFlow(stateData.provider)
      localStorage.setItem('ecochain_user', JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error instanceof Error ? error.message : 'Authentication failed' })
    }
  }, [])

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ecochain_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      } catch (error) {
        localStorage.removeItem('ecochain_user')
      }
    }

    // Handle auth callback if present
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state_param = urlParams.get('state')
    
    if (code && state_param) {
      handleAuthCallback(code, state_param)
    }
  }, [handleAuthCallback])

  const login = async (providerId: AuthProviderType['id']) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const provider = AUTH_PROVIDERS.find(p => p.id === providerId)
      if (!provider) {
        throw new Error('Provider not found')
      }

      // Check if we have real OAuth credentials
      const hasRealCredentials = provider.clientId !== `demo-${providerId}-client-id`
      
      if (hasRealCredentials) {
        // Use real OAuth flow
        const nonce = generateNonce()
        const state = JSON.stringify({ provider: providerId, nonce })
        
        sessionStorage.setItem('zklogin_nonce', nonce)
        sessionStorage.setItem('zklogin_provider', providerId)

        let authUrl = ''
        
        switch (providerId) {
          case 'google':
            authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
              `client_id=${provider.clientId}&` +
              `redirect_uri=${encodeURIComponent(provider.redirectUri)}&` +
              `response_type=code&` +
              `scope=${encodeURIComponent(provider.scope)}&` +
              `nonce=${nonce}&` +
              `state=${encodeURIComponent(state)}`
            break
          
          case 'facebook':
            authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
              `client_id=${provider.clientId}&` +
              `redirect_uri=${encodeURIComponent(provider.redirectUri)}&` +
              `response_type=code&` +
              `scope=${encodeURIComponent(provider.scope)}&` +
              `nonce=${nonce}&` +
              `state=${encodeURIComponent(state)}`
            break
          
          case 'twitch':
            authUrl = `https://id.twitch.tv/oauth2/authorize?` +
              `client_id=${provider.clientId}&` +
              `redirect_uri=${encodeURIComponent(provider.redirectUri)}&` +
              `response_type=code&` +
              `scope=${encodeURIComponent(provider.scope)}&` +
              `nonce=${nonce}&` +
              `state=${encodeURIComponent(state)}`
            break
          
          case 'apple':
            authUrl = `https://appleid.apple.com/auth/authorize?` +
              `client_id=${provider.clientId}&` +
              `redirect_uri=${encodeURIComponent(provider.redirectUri)}&` +
              `response_type=code&` +
              `scope=${encodeURIComponent(provider.scope)}&` +
              `response_mode=form_post&` +
              `nonce=${nonce}&` +
              `state=${encodeURIComponent(state)}`
            break
        }

        window.location.href = authUrl
      } else {
        // Use simulated zkLogin flow for demo
        const user = await simulateZkLoginFlow(providerId)
        localStorage.setItem('ecochain_user', JSON.stringify(user))
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error instanceof Error ? error.message : 'Login failed' })
    }
  }



  const logout = () => {
    localStorage.removeItem('ecochain_user')
    sessionStorage.removeItem('zklogin_nonce')
    sessionStorage.removeItem('zklogin_provider')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      handleAuthCallback
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
