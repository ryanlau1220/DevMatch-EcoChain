# EcoChain - Environmental Data Oracle

A verifiable environmental data oracle built with Sui zkLogin authentication and blockchain verification.

## Features

- **Sui zkLogin Authentication**: Secure social login with Google, Facebook, Twitch, and Apple
- **Environmental Data Generation**: Simulated sensor data with cryptographic signatures
- **Blockchain Verification**: On-chain data verification and storage
- **Data Visualization**: Interactive charts and analytics
- **Glassmorphism UI**: Modern, beautiful interface design

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure OAuth credentials (optional for demo)
4. Start development server: `npm run dev`

## OAuth Configuration (Production)

To use real OAuth authentication instead of demo mode:

1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Set `VITE_GOOGLE_CLIENT_ID` in `.env`

2. **Facebook OAuth**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Facebook Login product
   - Configure OAuth redirect URIs
   - Set `VITE_FACEBOOK_CLIENT_ID` in `.env`

3. **Twitch OAuth**:
   - Go to [Twitch Developers](https://dev.twitch.tv/)
   - Register your application
   - Set OAuth redirect URI
   - Set `VITE_TWITCH_CLIENT_ID` in `.env`

4. **Apple OAuth**:
   - Go to [Apple Developer](https://developer.apple.com/)
   - Configure Sign in with Apple
   - Set up service ID and domains
   - Set `VITE_APPLE_CLIENT_ID` in `.env`

## Demo Mode

The application runs in demo mode by default, simulating the zkLogin authentication flow without requiring real OAuth credentials. This allows you to test the complete user experience immediately.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Authentication**: Sui zkLogin with OAuth2 providers
- **State Management**: React Context + useReducer
- **Styling**: Glassmorphism design system
- **Build Tool**: Vite

## Sui zkLogin Integration

The application demonstrates a complete Sui zkLogin implementation:

1. **OAuth Flow**: Redirects to social providers for authentication
2. **JWT Processing**: Handles OAuth callbacks and JWT tokens
3. **zkLogin Proof**: Generates zero-knowledge proofs (simulated in demo)
4. **Sui Address**: Creates blockchain addresses from proofs
5. **Session Management**: Secure token storage and validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
