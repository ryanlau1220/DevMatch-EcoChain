# EcoChain - Environmental Data Oracle

A comprehensive environmental data oracle and prediction market platform built with hybrid blockchain architecture (Sui + Ethereum). EcoChain provides verifiable environmental monitoring through DePIN (Decentralized Physical Infrastructure) networks, featuring real-time sensor data visualization, blockchain-based sensor management, environmental prediction markets, and AI-powered data analysis. The system integrates multiple blockchain technologies to create a complete solution for climate monitoring, data verification, and market-driven environmental insights.

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

## 🎯 Project Overview

EcoChain is a decentralized physical infrastructure (DePIN) network for verifiable environmental data, integrating multiple blockchain technologies to create a comprehensive environmental monitoring solution.

### Tracks Integrated
- **Sui (Core Platform)**: Object-centric model for managing virtual sensors as NFTs
- **Oasis Protocol (Trust Layer)**: Confidential smart contract execution and ROFL for off-chain computation
- **Blockchain for Good Alliance**: Addresses UN SDGs 11 and 13
- **The Graph**: Track 1 - Data accessibility through Subgraph indexing
- **Ethereum Foundation**: Track 2 - Best App Built Using Scaffold-ETH 2 for rapid Ethereum dapp development
- **Ethereum Foundation**: Track 3 - Best Tooling for Prediction Markets Built on Ethereum for environmental prediction markets
- **ChatAndBuild**: AI Agent for natural language querying

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework with glassmorphism design
- **Vite**: Fast build tool and development server
- **React Icons**: FontAwesome icon library (ad-blocker friendly)

### Blockchain Integration
- **Sui SDK**: JavaScript library for Sui blockchain interaction
- **Sui Testnet**: Live blockchain connection for sensor management
- **Smart Contracts**: Deployed Move contracts for sensor NFTs
- **Real-time Data**: Live blockchain status and transaction monitoring
- **Scaffold-ETH 2**: Modern Ethereum development stack for rapid dapp development
- **Ethereum Integration**: Hybrid Sui + Ethereum architecture for prediction markets

### Authentication & State Management
- **Sui zkLogin**: Zero-knowledge proof-based authentication
- **OAuth2 Providers**: Google, Facebook, Twitch, Apple
- **React Context**: Global state management
- **Custom Hooks**: useAuth for authentication logic

## 📊 Current Features

### Foundation & Research
- React + TypeScript setup with modern development practices
- Vite build system for fast development and production builds
- Tailwind CSS with glassmorphism UI design
- Responsive design for mobile and desktop compatibility

### Core Infrastructure
- Sui zkLogin authentication with OAuth2 integration
- Frontend architecture with React Context and custom hooks
- Comprehensive UI components with navigation system
- Real-time simulated environmental data generation
- Interactive data visualization with Recharts library
- Error boundaries and loading states for robust user experience

### Blockchain Management
- Dedicated blockchain management page with tabbed interface
- Real-time Sui testnet connection and status monitoring
- Sensor registry statistics and recent activity tracking
- Interactive sensor registration with form validation
- Sensor ownership transfer functionality
- Trust score management with visual feedback
- Smart contract information display with copy-to-clipboard
- Environmental prediction market creation and management
- Market trading interface with liquidity pools
- Oracle bridge between Sui environmental data and Ethereum markets

### Smart Contract Integration
- Deployed SimpleSensor NFT contract on Sui testnet
- Package ID: `0x5bbfeb3847bbea0aad7383da8a6ed826c36a031586858ea8287159cfc85d9105`
- Registry ID: `0xa69b46162707233562a70c0565f74513a7a1bf73f54f745d007d6bd0d108a15e`
- Functions: register_sensor, transfer_sensor, update_trust_score
- Event emission for all blockchain operations
- Environmental prediction market contracts (Ethereum)
- Oracle integration between Sui and Ethereum networks

### Data Visualization
- Real-time environmental data charts (air quality, temperature, water quality)
- Interactive dashboard with statistics and metrics
- Sensor distribution visualization
- Responsive chart components with loading states

## 🎮 How to Use

### Dashboard
- View real-time environmental data statistics
- Explore interactive charts and visualizations
- Monitor system status and performance metrics

### Blockchain Management
1. **Overview Tab**: Check network status, registry stats, and recent activity
2. **My Sensors Tab**: View all owned sensors with detailed information
3. **Register Tab**: Add new sensors to the blockchain (demo mode)
4. **Transfer Tab**: Transfer sensor ownership to other addresses (demo mode)
5. **Trust Scores Tab**: Update sensor trust scores with visual feedback
6. **Prediction Markets Tab**: Create and manage environmental prediction markets
7. **Market Trading Tab**: Trade prediction market shares with liquidity pools

### Navigation
- Use the header navigation to switch between different sections
- Each section has a focused purpose and clean interface
- Mobile-responsive design works on all devices

## 🔧 Configuration

### Environment Variables
The app runs in demo mode by default. For production OAuth, create a `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_CLIENT_ID=your_facebook_client_id
VITE_TWITCH_CLIENT_ID=your_twitch_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
```

### OAuth Setup (Production)
1. **Google OAuth**: Configure in Google Cloud Console
2. **Facebook OAuth**: Set up in Facebook Developers
3. **Twitch OAuth**: Register in Twitch Developers
4. **Apple OAuth**: Configure in Apple Developer

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── Dashboard.tsx        # Main dashboard with data visualization
│   ├── BlockchainManagement.tsx  # Blockchain management interface
│   ├── DataGeneration.tsx   # Data generation interface
│   ├── DataVisualization.tsx # Additional data visualization
│   ├── Header.tsx           # Navigation header
│   ├── LoginModal.tsx       # Authentication modal
│   ├── OnChainRecords.tsx   # Blockchain records display
│   ├── UserProfile.tsx      # User profile component
│   ├── Verification.tsx     # Data verification interface
│   ├── ErrorBoundary.tsx    # Error handling component
│   └── LoadingSpinner.tsx   # Loading states and skeletons
├── services/                # Service layer
│   └── blockchain.ts        # Sui blockchain integration
├── config/                  # Configuration files
│   └── auth.ts             # Authentication configuration
├── hooks/                   # Custom React hooks
│   └── useAuth.tsx         # Authentication hook
├── types/                   # TypeScript type definitions
│   └── auth.ts             # Authentication types
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles

contracts/                   # Sui smart contracts
├── Move.toml               # Package configuration
├── sources/
│   └── simple_sensor.move  # Sensor NFT contract
└── README.md               # Contract documentation
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🙏 Acknowledgments

- **Sui Foundation** for zkLogin technology and blockchain platform
- **Oasis Protocol** for confidential computation capabilities
- **The Graph** for decentralized indexing infrastructure
- **ChatAndBuild** for AI integration framework
- **Blockchain for Good Alliance** for mission alignment with UN SDGs

---

**Note**: This is a demonstration project using simulated environmental data with real blockchain integration. The architecture is designed to be production-ready for real sensor integration and can be extended with additional blockchain features.
