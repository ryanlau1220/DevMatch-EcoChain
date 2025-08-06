# EcoChain - Environmental Data Oracle

A verifiable environmental data oracle built with Sui zkLogin authentication and blockchain verification. This project demonstrates a complete DePIN (Decentralized Physical Infrastructure) network for environmental monitoring using simulated sensor data.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryanlau1220/DevMatch-EcoChain.git
   cd DevMatch-EcoChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## ⚠️ Important Notes

### Ad Blocker Issues
If you see a blank page or console errors about `fingerprint.js`, your ad blocker is blocking lucide-react icons. To fix this:

1. **Whitelist localhost** in your ad blocker for `localhost:5173`
2. **Use incognito/private mode** in your browser
3. **Use a different browser** without ad blockers

### Environment Variables
The app runs in demo mode by default. For production OAuth, create a `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_CLIENT_ID=your_facebook_client_id
VITE_TWITCH_CLIENT_ID=your_twitch_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
```

## 🎯 Current Features

### ✅ Implemented
- **Sui zkLogin Authentication**: Secure social login with Google, Facebook, Twitch, and Apple
- **Environmental Data Generation**: Simulated sensor data with cryptographic signatures
- **Blockchain Verification**: On-chain data verification and storage
- **Data Visualization**: Interactive charts and analytics
- **Glassmorphism UI**: Modern, beautiful interface design
- **Responsive Design**: Works on desktop and mobile devices
- **Navigation System**: Tab-based navigation between different sections
- **Demo Mode**: Fully functional without real OAuth credentials

### 🔄 In Progress
- **Dashboard**: Environmental data statistics and recent data points
- **Data Generation**: Sensor data generation interface
- **Verification**: Cryptographic verification system
- **On-Chain Records**: Blockchain records and transaction history
- **Visualization**: Data visualization charts and graphs

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful, customizable icons

### Authentication
- **Sui zkLogin**: Zero-knowledge proof-based authentication
- **OAuth2 Providers**: Google, Facebook, Twitch, Apple
- **Context API**: React state management for auth
- **Local Storage**: Secure session persistence

### State Management
- **React Context**: Global state management
- **useReducer**: Complex state logic
- **useCallback**: Performance optimization
- **useEffect**: Side effects and lifecycle management

## 🐛 Troubleshooting

### Common Issues

1. **Blank Page**
   - Check browser console for errors
   - Disable ad blockers for localhost
   - Try incognito mode

2. **"process is not defined" Error**
   - Fixed: Using `import.meta.env` instead of `process.env`
   - No action needed

3. **"Cannot access 'handleAuthCallback' before initialization"**
   - Fixed: Reordered function definitions
   - No action needed

4. **"Duplicate declaration 'AuthProvider'"**
   - Fixed: Renamed imported type to `AuthProviderType`
   - No action needed

5. **Port Already in Use**
   - Vite will automatically try the next available port
   - Check terminal output for the correct URL

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔧 Configuration

### OAuth Setup (Production)

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

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── DataGeneration.tsx
│   ├── DataVisualization.tsx
│   ├── Header.tsx
│   ├── LoginModal.tsx
│   ├── OnChainRecords.tsx
│   ├── UserProfile.tsx
│   └── Verification.tsx
├── config/             # Configuration files
│   └── auth.ts
├── hooks/              # Custom React hooks
│   └── useAuth.tsx
├── types/              # TypeScript type definitions
│   └── auth.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🙏 Acknowledgments

- **Sui Foundation** for zkLogin technology
- **Oasis Protocol** for confidential computation
- **The Graph** for decentralized indexing
- **ChatAndBuild** for AI integration
- **Blockchain for Good Alliance** for mission alignment

---

**Note**: This is a demonstration project using simulated environmental data. The architecture is designed to be production-ready for real sensor integration in the future.
