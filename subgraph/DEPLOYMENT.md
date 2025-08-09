# EcoChain Subgraph Deployment Guide

## 🚀 Quick Start

### 1. Build the Subgraph
```bash
cd subgraph
npm run codegen
npm run build
```

### 2. Deploy to The Graph Studio
```bash
npm run deploy
```

### 3. Deploy to Hosted Service
```bash
npm run deploy:hosted
```

## 🔧 Configuration

### Update Contract Address
Edit `subgraph.yaml` and replace the placeholder address:
```yaml
source:
  address: "YOUR_DEPLOYED_CONTRACT_ADDRESS"
  startBlock: BLOCK_NUMBER_WHERE_CONTRACT_WAS_DEPLOYED
```

### Update Network
Change `network: mainnet` to your target network:
- `mainnet` - Ethereum mainnet
- `sepolia` - Ethereum Sepolia testnet
- `polygon` - Polygon mainnet
- `arbitrum-one` - Arbitrum One

## 📊 Token API Integration

### Requirements Met
✅ **Clear Usage Statement**: Token API usage is clearly documented in `src/mapping.ts`
✅ **Token Metadata Fetching**: Implements `fetchTokenMetadata()` function
✅ **Fallback Mechanism**: Falls back to published Subgraphs when Token API unavailable

### Implementation Details
- **Primary Method**: The Graph Token API for real-time token data
- **Fallback**: Uniswap V3 subgraph for token metadata
- **Integration**: Token metadata linked to all environmental entities

## 🌐 Deployment Options

### The Graph Studio (Recommended)
- Free tier available
- Easy deployment and management
- Built-in GraphQL playground
- Real-time indexing

### Hosted Service
- Production-ready
- High availability
- Advanced monitoring
- Custom domains

### Local Development
- Full control
- Offline development
- Custom configurations
- Testing environment

## 📈 Post-Deployment

### 1. Verify Indexing
Check the GraphQL playground for data:
```graphql
{
  environmentalData(first: 5) {
    id
    sensorId
    temperature
    tokenMetadata {
      symbol
      price
    }
  }
}
```

### 2. Monitor Performance
- Indexing speed
- Query response times
- Token API hit rates
- Fallback usage

### 3. Update Frontend
Integrate subgraph queries in your React app:
```typescript
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_ENVIRONMENTAL_DATA = gql`
  query GetEnvironmentalData {
    environmentalData(first: 10) {
      id
      temperature
      humidity
      tokenMetadata {
        symbol
        price
      }
    }
  }
`
```

## 🔍 Troubleshooting

### Common Issues
1. **Build Errors**: Check TypeScript compilation
2. **Deployment Failures**: Verify contract address and network
3. **Indexing Issues**: Check event signatures and ABI
4. **Token API Errors**: Verify fallback mechanism

### Debug Commands
```bash
# Check subgraph status
graph status

# View logs
graph logs

# Remove and redeploy
npm run remove:local
npm run deploy:local
```

## 📚 Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [Token API Guide](https://thegraph.com/docs/en/developing/creating-a-subgraph/token-api/)
- [Deployment Best Practices](https://thegraph.com/docs/en/deploying/deployment-best-practices/)
- [GraphQL Schema Design](https://thegraph.com/docs/en/developing/creating-a-subgraph/schema/) 