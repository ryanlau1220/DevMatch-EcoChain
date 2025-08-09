// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EnvironmentalOracle
 * @dev Smart contract for storing and managing environmental data from ROFL oracles
 */
contract EnvironmentalOracle is Ownable, ReentrancyGuard {
    
    struct EnvironmentalData {
        uint256 timestamp;
        uint256 temperature; // in Celsius * 100 (e.g., 2250 = 22.50°C)
        uint256 humidity; // percentage * 100 (e.g., 6500 = 65.00%)
        uint256 pressure; // in hPa * 100
        uint256 pm25; // PM2.5 in μg/m³ * 100
        uint256 pm10; // PM10 in μg/m³ * 100
        uint256 co2; // CO2 in ppm * 100
        uint256 tvoc; // TVOC in ppb * 100
        uint256 aqi; // Air Quality Index
        string location; // JSON string with lat/lng/city/country
        string sensorId;
        address oracle;
    }
    
    struct OracleInfo {
        bool isAuthorized;
        uint256 lastSubmission;
        uint256 totalSubmissions;
        string name;
    }
    
    // Mapping from data hash to EnvironmentalData
    mapping(bytes32 => EnvironmentalData) public environmentalData;
    
    // Mapping from oracle address to OracleInfo
    mapping(address => OracleInfo) public oracles;
    
    // Events
    event EnvironmentalDataSubmitted(
        bytes32 indexed dataHash,
        uint256 timestamp,
        uint256 temperature,
        uint256 humidity,
        uint256 aqi,
        string location,
        address indexed oracle
    );
    
    event OracleAuthorized(address indexed oracle, string name);
    event OracleRevoked(address indexed oracle);
    
    // Modifiers
    modifier onlyAuthorizedOracle() {
        require(oracles[msg.sender].isAuthorized, "Oracle not authorized");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Submit environmental data from ROFL oracle
     * @param timestamp Unix timestamp
     * @param temperature Temperature in Celsius * 100
     * @param humidity Humidity percentage * 100
     * @param pressure Pressure in hPa * 100
     * @param pm25 PM2.5 in μg/m³ * 100
     * @param pm10 PM10 in μg/m³ * 100
     * @param co2 CO2 in ppm * 100
     * @param tvoc TVOC in ppb * 100
     * @param aqi Air Quality Index
     * @param location JSON string with location data
     * @param sensorId Unique sensor identifier
     */
    function submitEnvironmentalData(
        uint256 timestamp,
        uint256 temperature,
        uint256 humidity,
        uint256 pressure,
        uint256 pm25,
        uint256 pm10,
        uint256 co2,
        uint256 tvoc,
        uint256 aqi,
        string calldata location,
        string calldata sensorId
    ) external onlyAuthorizedOracle nonReentrant {
        // Validate data ranges
        require(temperature >= 0 && temperature <= 10000, "Invalid temperature"); // -50°C to 50°C
        require(humidity >= 0 && humidity <= 10000, "Invalid humidity"); // 0% to 100%
        require(pressure >= 80000 && pressure <= 120000, "Invalid pressure"); // 800-1200 hPa
        require(pm25 >= 0 && pm25 <= 10000, "Invalid PM2.5"); // 0-100 μg/m³
        require(pm10 >= 0 && pm10 <= 10000, "Invalid PM10"); // 0-100 μg/m³
        require(co2 >= 30000 && co2 <= 100000, "Invalid CO2"); // 300-1000 ppm
        require(tvoc >= 0 && tvoc <= 100000, "Invalid TVOC"); // 0-1000 ppb
        require(aqi >= 0 && aqi <= 500, "Invalid AQI"); // 0-500
        
        // Create data hash
        bytes32 dataHash = keccak256(abi.encodePacked(
            timestamp,
            temperature,
            humidity,
            pressure,
            pm25,
            pm10,
            co2,
            tvoc,
            aqi,
            location,
            sensorId,
            msg.sender
        ));
        
        // Store environmental data
        environmentalData[dataHash] = EnvironmentalData({
            timestamp: timestamp,
            temperature: temperature,
            humidity: humidity,
            pressure: pressure,
            pm25: pm25,
            pm10: pm10,
            co2: co2,
            tvoc: tvoc,
            aqi: aqi,
            location: location,
            sensorId: sensorId,
            oracle: msg.sender
        });
        
        // Update oracle stats
        oracles[msg.sender].lastSubmission = block.timestamp;
        oracles[msg.sender].totalSubmissions++;
        
        emit EnvironmentalDataSubmitted(
            dataHash,
            timestamp,
            temperature,
            humidity,
            aqi,
            location,
            msg.sender
        );
    }
    
    /**
     * @dev Authorize a new oracle
     * @param oracle Address of the oracle
     * @param name Name of the oracle
     */
    function authorizeOracle(address oracle, string calldata name) external onlyOwner {
        oracles[oracle] = OracleInfo({
            isAuthorized: true,
            lastSubmission: 0,
            totalSubmissions: 0,
            name: name
        });
        
        emit OracleAuthorized(oracle, name);
    }
    
    /**
     * @dev Revoke oracle authorization
     * @param oracle Address of the oracle to revoke
     */
    function revokeOracle(address oracle) external onlyOwner {
        require(oracles[oracle].isAuthorized, "Oracle not authorized");
        oracles[oracle].isAuthorized = false;
        
        emit OracleRevoked(oracle);
    }
    
    /**
     * @dev Get environmental data by hash
     * @param dataHash Hash of the environmental data
     * @return Environmental data struct
     */
    function getEnvironmentalData(bytes32 dataHash) external view returns (EnvironmentalData memory) {
        return environmentalData[dataHash];
    }
    
    /**
     * @dev Get oracle information
     * @param oracle Address of the oracle
     * @return Oracle information struct
     */
    function getOracleInfo(address oracle) external view returns (OracleInfo memory) {
        return oracles[oracle];
    }
    
    /**
     * @dev Check if oracle is authorized
     * @param oracle Address of the oracle
     * @return True if authorized
     */
    function isOracleAuthorized(address oracle) external view returns (bool) {
        return oracles[oracle].isAuthorized;
    }
}
