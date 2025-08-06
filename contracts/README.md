# EcoChain Smart Contracts

This directory contains the Move smart contracts for the EcoChain DePIN network, built on Sui blockchain.

## 📁 Project Structure

```
contracts/
├── Move.toml                 # Project configuration
├── sources/
│   └── simple_sensor.move    # Working Virtual Sensor NFT management
└── README.md                 # This file
```

## 🏗️ Smart Contracts Overview

### 1. Simple Sensor NFT (`simple_sensor.move`) ✅ **WORKING**
- **Purpose**: Manages environmental sensors as NFTs
- **Key Features**:
  - Sensor registration and ownership
  - Sensor status management (active/inactive/suspended)
  - Trust score management (0-100)
  - Transfer capabilities
  - Event emission for all operations

## 🚀 Quick Start

### Prerequisites
- Sui CLI installed (`sui --version`)
- Git for dependency management

### Build the Contracts
```bash
# Build the project
sui move build --dev

# Expected output: Success with warnings (no errors)
```

### Deploy to Testnet
```bash
# Deploy to Sui Testnet
sui client publish --gas-budget 10000000

# Or deploy to Devnet
sui client publish --gas-budget 10000000 --network devnet
```

## 📋 Smart Contract Functions

### Simple Sensor Management

#### `init(ctx: &mut TxContext)`
- **Purpose**: Initialize the sensor registry
- **Access**: Public
- **Returns**: Creates and shares a `SensorRegistry` object

#### `register_sensor(registry: &mut SensorRegistry, sensor_id: vector<u8>, sensor_type: vector<u8>, ctx: &mut TxContext): SimpleSensor`
- **Purpose**: Register a new environmental sensor
- **Parameters**:
  - `registry`: The sensor registry
  - `sensor_id`: Unique sensor identifier (bytes)
  - `sensor_type`: Type of sensor (e.g., "air_quality", "temperature")
  - `ctx`: Transaction context
- **Returns**: `SimpleSensor` NFT object
- **Events**: `SensorRegistered`

#### `transfer_sensor(sensor: SimpleSensor, new_owner: address, ctx: &mut TxContext): SimpleSensor`
- **Purpose**: Transfer sensor ownership
- **Parameters**:
  - `sensor`: The sensor to transfer
  - `new_owner`: New owner address
  - `ctx`: Transaction context
- **Returns**: Updated `SimpleSensor` object
- **Events**: `SensorTransferred`

#### `update_sensor_status(sensor: &mut SimpleSensor, new_status: u8, ctx: &mut TxContext)`
- **Purpose**: Update sensor status (owner only)
- **Parameters**:
  - `sensor`: The sensor to update
  - `new_status`: New status (0: Active, 1: Inactive, 2: Suspended)
  - `ctx`: Transaction context
- **Access Control**: Only sensor owner

#### `update_trust_score(sensor: &mut SimpleSensor, new_score: u8, _ctx: &mut TxContext)`
- **Purpose**: Update sensor trust score
- **Parameters**:
  - `sensor`: The sensor to update
  - `new_score`: New trust score (0-100)
  - `_ctx`: Transaction context (unused)
- **Access Control**: Public (can be called by oracle or admin)

#### `get_sensor_info(sensor: &SimpleSensor): (String, String, address, u64, u8, u8)`
- **Purpose**: Get sensor information
- **Returns**: Tuple of (sensor_id, sensor_type, owner, registered_at, trust_score, status)

#### `is_active(sensor: &SimpleSensor): bool`
- **Purpose**: Check if sensor is active
- **Returns**: `true` if status is 0 (Active)

#### `get_owner(sensor: &SimpleSensor): address`
- **Purpose**: Get sensor owner address
- **Returns**: Owner address

#### `get_trust_score(sensor: &SimpleSensor): u8`
- **Purpose**: Get sensor trust score
- **Returns**: Trust score (0-100)

#### `get_registry_stats(registry: &SensorRegistry): u64`
- **Purpose**: Get registry statistics
- **Returns**: Total number of registered sensors

## 🏛️ Data Structures

### SimpleSensor
```move
public struct SimpleSensor has key, store {
    id: UID,
    sensor_id: String,        // Unique sensor identifier
    sensor_type: String,      // Sensor type
    owner: address,           // Current owner
    registered_at: u64,       // Registration timestamp
    trust_score: u8,          // Trust score (0-100)
    status: u8,               // Status (0: Active, 1: Inactive, 2: Suspended)
}
```

### SensorRegistry
```move
public struct SensorRegistry has key {
    id: UID,
    total_sensors: u64,       // Total registered sensors
}
```

## 📊 Events

### SensorRegistered
```move
public struct SensorRegistered has copy, drop {
    sensor_id: String,
    owner: address,
    sensor_type: String,
    timestamp: u64,
}
```

### SensorTransferred
```move
public struct SensorTransferred has copy, drop {
    sensor_id: String,
    from: address,
    to: address,
    timestamp: u64,
}
```

## 🔧 Configuration

### Move.toml
```toml
[package]
name = "ecochain"
version = "1.0.0"
edition = "2024.beta"
authors = ["EcoChain Team"]

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
ecochain = "0x0"
sensor_registry = "0x1"
data_oracle = "0x2"
trust_system = "0x3"
tokenomics = "0x4"
test_ecochain = "0x5"
```

## 🧪 Testing

### Build Verification
```bash
# Verify the contract builds successfully
sui move build --dev

# Expected: Success with warnings (no errors)
```

### Manual Testing
1. Deploy the contract to testnet
2. Initialize the sensor registry
3. Register a sensor
4. Test ownership transfer
5. Update sensor status and trust score

## 🚨 Known Issues & Limitations

### Current Limitations
- **Simplified Implementation**: This is a working but simplified version
- **No Complex Features**: Advanced features like data oracle, trust system, and tokenomics are not implemented
- **Basic Testing**: Comprehensive test suite not included due to Sui framework compatibility issues

### Warnings (Non-Critical)
- Duplicate alias warnings for Sui framework imports (can be suppressed)
- Unused constant `SENSOR_STATUS_INACTIVE` (can be removed)

## 🔮 Future Enhancements

### Planned Features
1. **Data Oracle Integration**: Environmental data verification
2. **Trust System**: Advanced reputation management
3. **Tokenomics**: $ECOCHAIN token and staking
4. **Geographic Data**: Latitude/longitude support
5. **Advanced Testing**: Comprehensive test suite

### Integration Points
- **Frontend Integration**: Connect with React PWA
- **Oasis ROFL**: Confidential verification
- **The Graph**: Data indexing
- **Gemini API**: AI agent integration

## 📚 Resources

- [Sui Move Documentation](https://docs.sui.io/build/move)
- [Sui Framework](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework)
- [Move Language Reference](https://move-language.github.io/move/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `sui move build --dev`
5. Submit a pull request

## 📄 License

This project is part of the EcoChain DePIN network. See the main project license for details. 