import { AuthProvider } from '../types/auth'

export const AUTH_PROVIDERS: AuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: '🔍',
    clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'demo-google-client-id',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    clientId: process.env.VITE_FACEBOOK_CLIENT_ID || 'demo-facebook-client-id',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'email public_profile'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: '🎮',
    clientId: process.env.VITE_TWITCH_CLIENT_ID || 'demo-twitch-client-id',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid user:read:email'
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: '🍎',
    clientId: process.env.VITE_APPLE_CLIENT_ID || 'demo-apple-client-id',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'name email'
  }
]

export const SUI_CONFIG = {
  rpcUrl: 'https://fullnode.devnet.sui.io:443',
  zkLoginUrl: 'https://zklogin-dev-api.mystenlabs.com',
  saltService: 'https://salt.api.mystenlabs.com/get_salt',
  proverService: 'https://prover-dev.mystenlabs.com/v1'
}
