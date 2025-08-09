# EcoChain TODO - Development Roadmap

## 🎯 Project Overview

EcoChain is a decentralized physical infrastructure (DePIN) network for verifiable environmental data, using simulated sensor data for the initial implementation. The project integrates multiple blockchain technologies to create a comprehensive environmental monitoring solution.

### Tracks Integrated
- **Sui (Core Platform)**: Object-centric model for managing virtual sensors as NFTs
- **Oasis Protocol (Trust Layer)**: Confidential smart contract execution and ROFL for off-chain computation
- **Blockchain for Good Alliance**: Addresses UN SDGs 11 and 13
- **The Graph**: Track 1 - Data accessibility through Subgraph indexing
- **Ethereum Foundation**: Track 2 - Best App Built Using Scaffold-ETH 2 for rapid Ethereum dapp development
- **Ethereum Foundation**: Track 3 - Best Tooling for Prediction Markets Built on Ethereum for environmental prediction markets
- **ChatAndBuild**: AI Agent for natural language querying

## COMPLETED FEATURES

### Phase 0: Foundation & Research
- React + TypeScript setup with modern development practices
- Vite build system for fast development and production builds
- Tailwind CSS with glassmorphism UI design
- Responsive design for mobile and desktop compatibility

### Phase 1: Core Infrastructure (MVP)
- Sui zkLogin authentication with OAuth2 integration (Google, Facebook, Twitch, Apple)
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
  - User-created markets and positions saved across sessions
  - Environmental data submissions preserved
  - Oracle registrations maintained
  - Seamless tab switching and page reloads

### Phase 1: Core Infrastructure (MVP) - COMPLETED
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

### Phase 1: Core Infrastructure (MVP) - Oasis Integration
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

### Phase 2: AI Agent Integration (Web3 Focus - Non-Fungible Agents)
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

### Phase 3: Real-Time Environmental Data Integration
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

## IN PROGRESS

### Phase 1: Core Infrastructure (MVP)
- Oasis ROFL Confidential Verification Module
  - Deployment to Oasis testnet TEE environment
    - ROFL application creation on testnet
    - Account balance verification (150 TEST tokens available)
    - Transaction fee calculation and gas optimization
    - TEE environment validation and testing
    - Production environment deployment
    - Network connectivity and synchronization
    - Account state verification and troubleshooting

- Simulated Data Ingestion Pipeline
  - Backend service (Node.js/Python)
  - Realistic environmental data generation
  - Cryptographic signing of data points

- The Graph Subgraph for Core Data Indexing
  - GraphQL schema definition
  - AssemblyScript mapping functions
  - VirtualSensor entity indexing
  - VerifiedReading entity indexing
  - Deploy to The Graph hosted service

## PENDING FEATURES

### Phase 3: Advanced Features & Tokenomics
- Enhanced Simulated Data Signing
  - Robust cryptographic signing (ECDSA)
  - Unique private key management
  - Public key registration on Sui
  - Digital signature verification in ROFL

- Reputation System for Virtual Sensors
  - Dynamic trust score management
  - Anomaly detection integration
  - Slashing logic for malicious sensors
  - $ECOCHAIN staking mechanism

- Dual-Tokenomics Implementation
  - $ECOCHAIN governance/staking token
  - Data Credit stable token
  - Staking contracts
  - Buyback and burn mechanism
  - Liquidity pool management

- Environmental Prediction Markets
  - Market creation and management tools
  - Trading interface with liquidity pools
  - Oracle integration with environmental data
  - Market resolution and dispute handling
  - Advanced market analytics and insights

- Refined ROFL Verification Logic
  - Advanced statistical models
  - Time-series forecasting
  - Machine learning integration
  - Spatial correlation analysis

- Location Selection System
  - Country and region dropdown selector
  - City search within selected countries
  - GPS coordinate input
  - Favorite locations management
  - Location history tracking

### Phase 4: Pilot Program & Iteration
- Partner Onboarding
  - Local council collaboration
  - University partnership
  - PWA onboarding process
  - Simulated data integration

- Performance Monitoring
  - Data transmission metrics
  - ROFL processing performance
  - Sui transaction monitoring
  - Subgraph indexing efficiency

- Feedback Collection & Iteration
  - User feedback system
  - UX improvements
  - Data utility optimization
  - Verification proof clarity

### Phase 5: Public Launch & Scaling
- Public Network Launch
  - Sui Mainnet deployment
  - Oasis Sapphire Mainnet deployment
  - Public announcement
  - Documentation updates

- Open Participation
  - Virtual sensor certification
  - Decentralized sensor registration
  - Reward distribution system
  - Community governance

- Data Market Launch
  - Data credit marketplace
  - NGO and researcher access
  - Government body integration
  - Monetization model activation

- Community Governance
  - On-chain governance framework
  - $ECOCHAIN holder voting
  - Treasury management
  - Continuous improvement process


### Key Milestones
- MVP Frontend: Complete
- Smart Contracts: In Progress
- Backend Services: Not Started
- AI Integration: Complete
- Real-Time Data Integration: Complete
- Tokenomics: Not Started
- Public Launch: Not Started


## SUCCESS METRICS

### Technical Metrics
- Smart contract deployment success rate
- Data processing latency
- System uptime and reliability
- User authentication success rate
- API response times

### User Metrics
- User registration and retention
- Feature adoption rates
- User satisfaction scores
- Support ticket volume
- Community engagement

### Business Metrics
- Virtual sensor registration
- Data transaction volume
- Token circulation and utility
- Partnership agreements
- Revenue generation
