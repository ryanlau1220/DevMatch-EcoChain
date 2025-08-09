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

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   VITE_IQAIR_API_KEY=your_iqair_api_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_FACEBOOK_CLIENT_ID=your_facebook_client_id
   VITE_TWITCH_CLIENT_ID=your_twitch_client_id
   VITE_APPLE_CLIENT_ID=your_apple_client_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
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

## 📊 COMPLETED FEATURES

### Phase 0: Foundation & Research
- React + TypeScript setup with modern development practices
- Vite build system for fast development and production builds
- Tailwind CSS with glassmorphism UI design
- Responsive design for mobile and desktop compatibility

### Phase 1: Core Infrastructure (MVP)
- Sui zkLogin authentication with OAuth2 integration
- Frontend architecture with React Context and custom hooks
- Comprehensive UI components with navigation system
- Real-time simulated environmental data generation
- Interactive data visualization with Recharts library
- Error boundaries and loading states for robust user experience
- Icon library management (replaced lucide-react with React Icons)
- UI/UX improvements with background image fixes and chart color corrections

### Phase 2: Frontend & AI Integration
- Progressive Web App (PWA) structure with React.js and TypeScript
- Authentication system with Sui zkLogin integration and demo mode
- Real-time dashboard with data visualization (air quality, temperature, water quality)
- Enhanced UI components with glassmorphism styling and responsive layout
- Scaffold-ETH 2 integration for Ethereum development
- Environmental prediction market implementation
- Enhanced PWA Features
  - Virtual sensor management dashboard
  - Real-time data visualization
  - Interactive charts (Recharts/Chart.js)
  - Geographic mapping (Leaflet.js/Mapbox)
  - Data filtering and search
- Scaffold-ETH 2 Integration
  - Ethereum smart contract development
  - Environmental prediction market contracts
  - Oracle bridge between Sui and Ethereum
  - Market creation and management tools
  - Liquidity pool implementation
- Data Persistence & User Experience
  - localStorage integration for data persistence
  - User-created markets and trading positions saved across sessions
  - Environmental data submissions preserved
  - Oracle registrations maintained
  - Seamless tab switching and page reloads

### Phase 3: Sui Blockchain Integration
- Sui Smart Contracts for Virtual Sensor Management
  - Working SimpleSensor NFT contract (builds successfully)
  - Sensor registration and ownership transfer
  - Trust score management (0-100)
  - Status management (active/inactive/suspended)
  - Event emission for all operations
  - DEPLOYED TO SUI TESTNET - Package ID: `0x5bbfeb3847bbea0aad7383da8a6ed826c36a031586858ea8287159cfc85d9105`
  - FRONTEND INTEGRATION - Hybrid solution with blockchain service layer
  - REAL-TIME BLOCKCHAIN DATA - Live connection to Sui testnet
  - DEDICATED BLOCKCHAIN MANAGEMENT PAGE - Complete UI for sensor management
  - INTERACTIVE BLOCKCHAIN FEATURES - Register, transfer, and update trust scores

### Phase 4: Oasis ROFL Integration
- Oasis ROFL Environmental Oracle Deployment
  - EnvironmentalOracle.sol smart contract development
  - Sapphire testnet deployment (Contract: 0x2CA22FCA74ABD51cCD166845a13E2064390605aC)
  - ROFL application configuration and contract integration
  - Hardhat deployment setup with environment variables
  - Oracle authorization and contract management
  - Network configuration for Sapphire testnet (Chain ID: 23295)
  - Gas price optimization for Sapphire deployment
  - ROFL agent development (Rust)
  - Environmental data structures and validation
  - Statistical anomaly detection
  - Cross-sensor validation
  - Cryptographic proof generation
  - Smart contract for environmental data (EnvironmentalOracle.sol)
  - Application architecture with proper logging
  - Data encoding and blockchain preparation
  - Continuous operation with 30-second cycles
  - Self-contained implementation (no external SDK dependencies)
  - Comprehensive integration guide (INTEGRATION_GUIDE.md)
  - Real Environmental API Integration
    - OpenWeatherMap API integration for weather data
    - IQAir API integration for air quality data
    - API key management and environment variables
    - Data validation and error handling
    - Fallback to mock data when APIs unavailable
    - Real-time environmental data fetching
    - Data transformation for blockchain submission
  - ROFL application configuration (rofl.yaml)
  - TEE environment setup (TDX)
  - Build process configuration

### Phase 5: AI Agent Integration (Web3 Focus - Non-Fungible Agents)
- AI Agent NFT Smart Contract (Sui)
  - Unique AI agents as NFTs with different specializations
  - Agent trading and ownership transfer functionality
  - Performance tracking and reward distribution
  - Agent staking mechanism for environmental data analysis
- AI Agent Chat Interface (React)
  - Natural language processing for environmental queries
  - Real-time chat interface with AI agents
  - Agent marketplace for buying/selling/trading agents
  - Agent performance dashboard and analytics
  - Google Gemini API integration with fallback to mock responses
  - Markdown rendering for formatted AI responses
  - Chat history persistence with localStorage
  - Clear chat history functionality
  - Provider identification (Gemini AI vs Mock Mode)
  - Quick actions panel for common environmental queries
  - Context-aware suggestions and follow-up questions
- Environmental Data AI Agents
  - Specialized agents for air quality, temperature, water quality analysis
  - On-chain trading AI agents for prediction markets
  - Cross-chain data integration (Sui ↔ Ethereum)
  - Intelligent anomaly detection and alerting
- AI Agent Intelligence Layer
  - Natural language query processing (Mock → Real API integration)
  - Environmental data analysis and insights generation
  - Prediction market recommendations and trading signals
  - Real-time environmental monitoring and reporting
- Web3 Integration Features
  - NFT-based agent ownership and trading
  - DeFi integration with prediction markets
  - Token rewards for accurate predictions and analysis
  - Decentralized agent governance and upgrades

### Phase 6: Real-Time Environmental Data Integration
- OpenWeather API Integration
  - Temperature, humidity, and pressure data fetching
  - Real-time weather data from global locations
  - API key management and environment variables
  - Error handling and fallback mechanisms
- IQAir API Integration
  - Air quality index (AQI) data
  - PM2.5 and PM10 particulate matter data
  - Global air quality monitoring
  - Real-time air quality updates
- Environmental Data Service
  - Hybrid real-time and simulated data system
  - Automatic fallback to simulated data when APIs unavailable
  - Data validation and transformation
  - Hourly data updates to prevent chart jumping
  - Stable time ranges for consistent visualization
- Dashboard Optimization
  - Fixed x-axis jumping issue in charts
  - Hourly data updates instead of continuous updates
  - Stable time ranges for air quality (24h), temperature (7d), water quality (12h)
  - Performance optimizations with useMemo for data arrays
  - Real-time vs simulated data status indicators

### Phase 7: The Graph Subgraph Integration
- Subgraph Development & Deployment
  - GraphQL schema definition for environmental data entities
  - AssemblyScript mapping functions for Ethereum events
  - EnvironmentalOracle.sol contract integration
  - Subgraph deployment to The Graph Studio
  - Live endpoint: `https://api.studio.thegraph.com/query/118239/ecochain-environmental-data/v0.0.4`
- Smart Contract Integration
  - EnvironmentalOracle.sol deployment to Sepolia testnet
  - Contract address: `0x2CA22FCA74ABD51cCD166845a13E2064390605aC`
  - Environmental data submission testing and validation
  - Event emission and subgraph indexing verification
- Frontend Integration
  - BlockchainDataHub.tsx component with real-time data display
  - Interactive charts using Recharts (temperature, humidity, AQI)
  - Auto-refresh system with 30-second intervals
  - Status monitoring and data point tracking
  - Responsive glassmorphism UI design
  - Navigation integration in Header.tsx
- Data Flow
  - Smart contract events → Subgraph indexing → GraphQL API → React frontend
  - Real-time environmental data visualization
  - Live blockchain data without API keys or rate limits

### Phase 8: Blockchain Data Hub
- Real-time Subgraph Integration
  - Live connection to The Graph subgraph
  - Interactive Data Visualization
  - Temperature, humidity, and AQI charts using Recharts
  - Live Blockchain Data
  - Real-time environmental data from smart contract events
  - Auto-refresh System
  - Automatic data updates every 30 seconds
  - Status Monitoring
  - Live sync status, data point counts, and sensor tracking
  - Responsive Design
  - Glassmorphism UI with mobile-optimized layout
  - Data Table
  - Comprehensive view of all environmental records with verification status

### Phase 9: Core Application Features
- Blockchain Management
  - Dedicated blockchain management page with tabbed interface
  - Real-time Sui testnet connection and status monitoring
  - Sensor registry statistics and recent activity tracking
  - Interactive sensor registration with form validation
  - Sensor ownership transfer functionality
  - Trust score management with visual feedback
  - Smart contract information display with copy-to-clipboard

- Environmental Prediction Markets
  - Complete prediction market creation and management interface
  - Market trading with YES/NO outcomes and liquidity pools
  - Real-time probability calculations and market statistics
  - Interactive trading interface with position tracking
  - Market details with price history charts and analytics
  - User position management and portfolio tracking

- Oracle Bridge
  - Environmental data submission from Sui sensors to Ethereum
  - Oracle registration and reputation management
  - Data verification and validation workflow
  - Real-time bridge status monitoring between networks
  - Environmental data visualization and trend analysis
  - Cross-chain data integrity and trust mechanisms

- Smart Contract Integration
  - Deployed SimpleSensor NFT contract on Sui testnet
  - Package ID: `0x5bbfeb3847bbea0aad7383da8a6ed826c36a031586858ea8287159cfc85d9105`
  - Registry ID: `0xa69b46162707233562a70c0565f74513a7a1bf73f54f745d007d6bd0d108a15e`
  - Functions: register_sensor, transfer_sensor, update_trust_score
  - Event emission for all blockchain operations

- Ethereum Smart Contracts
  - EnvironmentalMarket contract for prediction markets
  - OracleBridge contract for cross-chain data integration
  - OpenZeppelin v5 integration with modern security patterns
  - Hardhat development environment with TypeScript
  - Deployable to Ethereum testnets and mainnet

- Data Visualization
  - Real-time environmental data charts (air quality, temperature, water quality)
  - Interactive dashboard with statistics and metrics
  - Sensor distribution visualization
  - Responsive chart components with loading states
  - Stable time ranges: Air quality (24h), Temperature (7d), Water quality (12h)
  - Hourly data updates to prevent chart jumping

## 🎮 How to Use

### Dashboard
- View real-time environmental data statistics
- Explore interactive charts and visualizations
- Monitor system status and performance metrics
- See live vs simulated data status
- Track hourly data updates

### Blockchain Management
1. **Overview Tab**: Check network status, registry stats, and recent activity
2. **My Sensors Tab**: View all owned sensors with detailed information
3. **Register Tab**: Add new sensors to the blockchain (demo mode)
4. **Transfer Tab**: Transfer sensor ownership to other addresses (demo mode)
5. **Trust Scores Tab**: Update sensor trust scores with visual feedback

### Prediction Markets
1. **Create Markets**: Set up new environmental prediction markets
2. **Trade Shares**: Buy and sell YES/NO shares with real-time pricing
3. **View Analytics**: Monitor market statistics and price history
4. **Manage Positions**: Track your trading positions across all markets

### Oracle Bridge
1. **Submit Data**: Add environmental data from Sui sensors
2. **Register Oracles**: Join the oracle network for data verification
3. **Verify Data**: Validate and approve submitted environmental data
4. **Monitor Bridge**: Track cross-chain data flow and network status

### AI Agent Chat
1. **Ask Questions**: Use natural language to query environmental data
2. **Quick Actions**: Use pre-built queries for common environmental topics
3. **View Responses**: Get beautifully formatted AI responses with markdown
4. **Follow Suggestions**: Click on AI-generated follow-up questions
5. **Clear History**: Reset conversations when needed
6. **Check Provider**: See whether you're using Gemini AI or Mock Mode

### Blockchain Data Hub
1. **View Live Data**: See real-time environmental data from blockchain
2. **Interactive Charts**: Explore temperature, humidity, and AQI trends
3. **Data Table**: Browse all environmental records with timestamps
4. **Auto-refresh**: Toggle automatic data updates on/off
5. **Status Monitoring**: Track sync status and data point counts
6. **Mobile Optimized**: Responsive design works on all devices

### Navigation
- Use the header navigation to switch between different sections
- Each section has a focused purpose and clean interface
- Mobile-responsive design works on all devices

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for production OAuth and API integration:

```env
# Environmental Data APIs
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_IQAIR_API_KEY=your_iqair_api_key

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_CLIENT_ID=your_facebook_client_id
VITE_TWITCH_CLIENT_ID=your_twitch_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id

# AI Integration
VITE_GEMINI_API_KEY=your_gemini_api_key

# Sui Blockchain Configuration
VITE_SUI_PACKAGE_ID=0x5bbfeb3847bbea0aad7383da8a6ed826c36a031586858ea8287159cfc85d9105
VITE_SUI_REGISTRY_ID=0xa69b46162707233562a70c0565f74513a7a1bf73f54f745d007d6bd0d108a15e
VITE_SUI_NETWORK=testnet
```

### API Setup
1. **OpenWeather API**: Get API key from [OpenWeatherMap](https://openweathermap.org/api)
2. **IQAir API**: Get API key from [IQAir](https://www.iqair.com/air-pollution-data-api)
3. **Gemini API**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

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
│   ├── PredictionMarket.tsx # Environmental prediction markets
│   ├── OracleBridge.tsx     # Cross-chain oracle bridge
│   ├── AIAgentChat.tsx      # AI-powered environmental intelligence chat
│   ├── BlockchainDataHub.tsx # Real-time blockchain data from subgraph
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
│   ├── blockchain.ts        # Sui blockchain integration
│   ├── aiService.ts         # Google Gemini AI integration
│   └── environmentalDataService.ts # Real-time environmental data
├── hooks/                   # Custom React hooks
│   ├── useAuth.tsx         # Authentication hook
│   └── useEnvironmentalData.ts # Environmental data management
├── config/                  # Configuration files
│   └── auth.ts             # Authentication configuration
├── types/                   # TypeScript type definitions
│   └── auth.ts             # Authentication types
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles

subgraph/                     # The Graph subgraph
├── schema.graphql           # GraphQL schema definition
├── subgraph.yaml            # Subgraph manifest
├── src/
│   └── mapping.ts           # AssemblyScript event handlers
├── abis/
│   └── EnvironmentalOracle.json  # Contract ABI
└── package.json             # Subgraph dependencies

contracts/                   # Sui smart contracts
├── Move.toml               # Package configuration
├── sources/
│   └── simple_sensor.move  # Sensor NFT contract
└── README.md               # Contract documentation

ethereum/                    # Ethereum smart contracts
├── contracts/
│   ├── EnvironmentalOracle.sol  # Environmental data contract
│   ├── EnvironmentalMarket.sol  # Prediction market contract
│   └── OracleBridge.sol         # Oracle bridge contract
├── scripts/
│   ├── deploy-oracle.ts     # Oracle deployment script
│   └── test-environmental-data.ts # Data submission testing
├── hardhat.config.ts        # Hardhat configuration
└── package.json             # Ethereum dependencies

oasis-rofl/                  # Oasis ROFL Environmental Oracle
├── src/
│   └── main.rs             # Environmental oracle application
├── contracts/
│   └── EnvironmentalOracle.sol  # Environmental data smart contract
├── Cargo.toml              # Rust dependencies
├── rofl.yaml               # ROFL configuration
├── README.md               # ROFL documentation
└── INTEGRATION_GUIDE.md    # Oasis SDK integration guide
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Subgraph Development (in subgraph/ directory)
npm run codegen      # Generate TypeScript types
npm run build        # Build subgraph
npm run deploy       # Deploy to The Graph Studio
```

## 🙏 Acknowledgments

- **Sui Foundation** for zkLogin technology and blockchain platform
- **Oasis Protocol** for confidential computation capabilities
- **The Graph** for decentralized indexing infrastructure
- **ChatAndBuild** for AI integration framework
- **Blockchain for Good Alliance** for mission alignment with UN SDGs
- **OpenWeather** for global weather data APIs
- **IQAir** for air quality monitoring data

---

**Note**: This is a demonstration project using simulated environmental data with real blockchain integration and real-time environmental API data. The architecture is designed to be production-ready for real sensor integration and can be extended with additional blockchain features.
