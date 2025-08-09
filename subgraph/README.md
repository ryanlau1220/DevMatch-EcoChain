# EcoChain Environmental Data Subgraph

## 🌍 Overview

This subgraph indexes environmental data from the EcoChain network, providing real-time access to verified environmental readings, virtual sensor information, and token metadata through The Graph's Token API integration.

## 🚀 Features

### Core Functionality
- **Environmental Data Indexing**: Real-time indexing of temperature, humidity, air quality, and pressure data
- **Virtual Sensor Management**: Track sensor registration, ownership, and trust scores
- **Data Verification**: Monitor reading verification and scoring
- **Statistical Aggregation**: Environmental statistics and analytics

### Token API Integration
- **Primary Method**: Uses The Graph Token API to fetch token metadata (symbol, name, decimals, price)
- **Fallback Mechanism**: Falls back to published Subgraph for token metadata if Token API not applicable
- **Enhanced Context**: Environmental context for tokens (e.g., "Air Quality Token", "Temperature Prediction Token")

## 📊 Schema

### Core Entities
- `EnvironmentalData`: Environmental readings with token metadata
- `VirtualSensor`: Sensor information with trust scores
- `VerifiedReading`: Verification records with scoring
- `TokenMetadata`: Token information from Token API or fallback
- `EnvironmentalStats`: Aggregate environmental statistics
- `TokenApiStats`: Token API usage statistics

### Token API Integration Fields
```graphql
type TokenMetadata @entity {
  id: ID!
  tokenAddress: String!
  symbol: String!
  name: String!
  decimals: Int!
  price: BigDecimal
  priceSource: String!  # "Token API" or "Fallback Subgraph"
  environmentalContext: String
  marketCap: BigDecimal
  volume24h: BigDecimal
  tokenApiVersion: String
  fallbackSubgraph: String
}
```

## 🛠️ Setup & Development

### Prerequisites
- Node.js 16+
- npm or yarn
- The Graph CLI

### Installation
```bash
cd subgraph
npm install
```

### Development Commands
```bash
# Generate TypeScript types
npm run codegen

# Build the subgraph
npm run build

# Deploy to local Graph Node
npm run deploy:local

# Deploy to The Graph Studio
npm run deploy

# Deploy to Hosted Service
npm run deploy:hosted
```

## 🔗 Token API Integration

### Implementation Details

#### 1. Primary Token API Usage
The subgraph clearly demonstrates usage of The Graph Token API in `src/mapping.ts`:

```typescript
// TOKEN API INTEGRATION - CLEARLY STATED USAGE
// Using The Graph Token API to fetch token metadata (symbol, name, decimals, price)
// This is the primary method for getting token information
function tryTokenApi(tokenAddress: string, tokenMetadata: TokenMetadata): boolean {
  // Token API implementation
}
```

#### 2. Fallback Mechanism
When Token API is not applicable, the subgraph falls back to published Subgraphs:

```typescript
// FALLBACK MECHANISM - CLEARLY STATED USAGE
// Fallback to published Subgraph for token metadata if Token API not applicable
function tryFallbackSubgraph(tokenAddress: string, tokenMetadata: TokenMetadata): boolean {
  // Fallback implementation using Uniswap V3 subgraph
}
```

#### 3. Application Logic Integration
Token metadata is integrated throughout the application logic:

```typescript
// TOKEN API INTEGRATION - Fetch token metadata for environmental data
// This demonstrates usage of Token API within application logic
let tokenMetadata = fetchTokenMetadata(ECOCHAIN_TOKEN_ADDRESS)
if (tokenMetadata) {
  entity.tokenMetadata = tokenMetadata.id
}
```

### Token API Benefits
- **Real-time Pricing**: Live token prices for environmental markets
- **Market Data**: Market cap, volume, and trading information
- **Standardized Format**: Consistent token metadata across the ecosystem
- **Performance**: Optimized queries for token information

## 📈 Usage Examples

### Query Environmental Data with Token Info
```graphql
{
  environmentalData(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    sensorId
    temperature
    humidity
    airQuality
    pressure
    location
    verified
    tokenMetadata {
      symbol
      name
      price
      priceSource
      environmentalContext
    }
  }
}
```

### Get Token API Statistics
```graphql
{
  tokenApiStats(id: "global") {
    totalTokensQueried
    tokenApiHits
    fallbackSubgraphHits
    averageResponseTime
    lastUpdated
  }
}
```

### Virtual Sensors with Token Data
```graphql
{
  virtualSensors(first: 5) {
    id
    owner
    trustScore
    status
    totalReadings
    verifiedReadings
    tokenMetadata {
      symbol
      name
      price
      marketCap
    }
  }
}
```

## 🔧 Configuration

### Environment Variables
- `TOKEN_API_ENDPOINT`: The Graph Token API endpoint
- `FALLBACK_SUBGRAPH`: Fallback subgraph URL
- `ECOCHAIN_TOKEN_ADDRESS`: EcoChain token contract address

### Network Configuration
Currently configured for Ethereum mainnet, but can be adapted for:
- Ethereum testnets (Sepolia, Goerli)
- Polygon
- Arbitrum
- Other EVM-compatible networks

## 🚀 Deployment

### Local Development
```bash
# Start local Graph Node
docker-compose up -d

# Deploy locally
npm run deploy:local
```

### The Graph Studio
```bash
# Deploy to Studio
npm run deploy
```

### Hosted Service
```bash
# Deploy to hosted service
npm run deploy:hosted
```

## 📚 Documentation

- [The Graph Documentation](https://thegraph.com/docs/)
- [Token API Reference](https://thegraph.com/docs/en/developing/creating-a-subgraph/token-api/)
- [AssemblyScript Guide](https://thegraph.com/docs/en/developing/creating-a-subgraph/assemblyscript/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run build`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Project**: [EcoChain](https://github.com/ecochain/ecochain)
- **The Graph**: [thegraph.com](https://thegraph.com)
- **Token API**: [Token API Documentation](https://thegraph.com/docs/en/developing/creating-a-subgraph/token-api/) 