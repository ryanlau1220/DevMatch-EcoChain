export interface User {
  id: string
  email: string
  name: string
  picture?: string
  provider: 'google' | 'facebook' | 'twitch' | 'apple'
  suiAddress?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface ZkLoginProof {
  proofPoints: {
    a: string[]
    b: string[][]
    c: string[]
  }
  issBase64Details: {
    value: string
    indexMod4: number
  }
  headerBase64: string
}

export interface AuthProvider {
  id: 'google' | 'facebook' | 'twitch' | 'apple'
  name: string
  icon: string
  clientId: string
  redirectUri: string
  scope: string
}
