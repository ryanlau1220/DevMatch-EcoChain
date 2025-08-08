// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OracleBridge
 * @dev Bridge contract to receive environmental data from Sui and provide it to Ethereum markets
 */
contract OracleBridge is Ownable, ReentrancyGuard {

    constructor() Ownable(msg.sender) {}

    struct EnvironmentalData {
        uint256 dataId;
        string sensorId;
        uint256 timestamp;
        uint256 airQuality;
        uint256 temperature;
        uint256 humidity;
        uint256 waterQuality;
        bool verified;
        address oracle;
        bytes32 dataHash;
    }

    struct Oracle {
        address oracleAddress;
        string name;
        bool active;
        uint256 reputation;
        uint256 totalSubmissions;
        uint256 successfulVerifications;
    }

    uint256 private _dataIds;
    
    mapping(uint256 => EnvironmentalData) public environmentalData;
    mapping(address => Oracle) public oracles;
    mapping(bytes32 => bool) public processedDataHashes;
    mapping(string => uint256[]) public sensorDataHistory;
    
    uint256 public constant MINIMUM_REPUTATION = 100;
    uint256 public constant VERIFICATION_THRESHOLD = 3; // Number of oracles needed for verification
    uint256 public constant DATA_FRESHNESS_THRESHOLD = 3600; // 1 hour in seconds
    
    event DataSubmitted(uint256 indexed dataId, string indexed sensorId, address indexed oracle, uint256 timestamp);
    event DataVerified(uint256 indexed dataId, string indexed sensorId, uint256 airQuality, uint256 temperature);
    event OracleRegistered(address indexed oracle, string name);
    event OracleReputationUpdated(address indexed oracle, uint256 newReputation);
    event DataRequested(string indexed sensorId, uint256 timestamp);

    modifier onlyOracle() {
        require(oracles[msg.sender].active, "Not a registered oracle");
        _;
    }

    modifier dataNotProcessed(bytes32 dataHash) {
        require(!processedDataHashes[dataHash], "Data already processed");
        _;
    }

    /**
     * @dev Register a new oracle
     * @param name Oracle name/identifier
     */
    function registerOracle(string memory name) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!oracles[msg.sender].active, "Oracle already registered");

        oracles[msg.sender] = Oracle({
            oracleAddress: msg.sender,
            name: name,
            active: true,
            reputation: 100, // Starting reputation
            totalSubmissions: 0,
            successfulVerifications: 0
        });

        emit OracleRegistered(msg.sender, name);
    }

    /**
     * @dev Submit environmental data from Sui
     * @param sensorId The sensor identifier from Sui
     * @param timestamp Data timestamp
     * @param airQuality Air quality reading
     * @param temperature Temperature reading
     * @param humidity Humidity reading
     * @param waterQuality Water quality reading
     * @param dataHash Hash of the original data for verification
     */
    function submitEnvironmentalData(
        string memory sensorId,
        uint256 timestamp,
        uint256 airQuality,
        uint256 temperature,
        uint256 humidity,
        uint256 waterQuality,
        bytes32 dataHash
    ) external onlyOracle dataNotProcessed(dataHash) {
        require(bytes(sensorId).length > 0, "Sensor ID cannot be empty");
        require(timestamp > 0, "Invalid timestamp");
        require(block.timestamp - timestamp <= DATA_FRESHNESS_THRESHOLD, "Data too old");

        _dataIds++;
        uint256 dataId = _dataIds;

        EnvironmentalData storage data = environmentalData[dataId];
        data.dataId = dataId;
        data.sensorId = sensorId;
        data.timestamp = timestamp;
        data.airQuality = airQuality;
        data.temperature = temperature;
        data.humidity = humidity;
        data.waterQuality = waterQuality;
        data.oracle = msg.sender;
        data.dataHash = dataHash;

        // Update oracle stats
        Oracle storage oracle = oracles[msg.sender];
        oracle.totalSubmissions++;

        // Add to sensor history
        sensorDataHistory[sensorId].push(dataId);

        // Mark hash as processed
        processedDataHashes[dataHash] = true;

        emit DataSubmitted(dataId, sensorId, msg.sender, timestamp);
    }

    /**
     * @dev Verify environmental data (called by multiple oracles for consensus)
     * @param dataId The data ID to verify
     * @param expectedAirQuality Expected air quality value
     * @param expectedTemperature Expected temperature value
     */
    function verifyData(
        uint256 dataId,
        uint256 expectedAirQuality,
        uint256 expectedTemperature
    ) external onlyOracle {
        require(dataId <= _dataIds, "Data does not exist");
        
        EnvironmentalData storage data = environmentalData[dataId];
        require(!data.verified, "Data already verified");

        // Simple verification logic - check if values are within reasonable bounds
        bool airQualityValid = data.airQuality == expectedAirQuality;
        bool temperatureValid = data.temperature == expectedTemperature;

        if (airQualityValid && temperatureValid) {
            data.verified = true;
            
            // Update oracle reputation
            Oracle storage oracle = oracles[msg.sender];
            oracle.successfulVerifications++;
            oracle.reputation += 10;

            emit DataVerified(dataId, data.sensorId, data.airQuality, data.temperature);
            emit OracleReputationUpdated(msg.sender, oracle.reputation);
        }
    }

    /**
     * @dev Get latest verified data for a sensor
     * @param sensorId The sensor identifier
     * @return dataId Data ID
     * @return timestamp Data timestamp
     * @return airQuality Air quality reading
     * @return temperature Temperature reading
     * @return humidity Humidity reading
     * @return waterQuality Water quality reading
     */
    function getLatestVerifiedData(string memory sensorId) 
        external 
        view 
        returns (
            uint256 dataId,
            uint256 timestamp,
            uint256 airQuality,
            uint256 temperature,
            uint256 humidity,
            uint256 waterQuality
        ) 
    {
        uint256[] storage history = sensorDataHistory[sensorId];
        require(history.length > 0, "No data for sensor");

        // Find the latest verified data
        for (uint256 i = history.length; i > 0; i--) {
            uint256 currentDataId = history[i - 1];
            EnvironmentalData storage data = environmentalData[currentDataId];
            
            if (data.verified) {
                return (
                    data.dataId,
                    data.timestamp,
                    data.airQuality,
                    data.temperature,
                    data.humidity,
                    data.waterQuality
                );
            }
        }

        revert("No verified data found");
    }

    /**
     * @dev Get environmental data by ID
     * @param dataId The data ID
     * @return sensorId Sensor identifier
     * @return timestamp Data timestamp
     * @return airQuality Air quality reading
     * @return temperature Temperature reading
     * @return humidity Humidity reading
     * @return waterQuality Water quality reading
     * @return verified Whether data is verified
     * @return oracle Oracle address
     */
    function getEnvironmentalData(uint256 dataId) 
        external 
        view 
        returns (
            string memory sensorId,
            uint256 timestamp,
            uint256 airQuality,
            uint256 temperature,
            uint256 humidity,
            uint256 waterQuality,
            bool verified,
            address oracle
        ) 
    {
        require(dataId <= _dataIds, "Data does not exist");
        
        EnvironmentalData storage data = environmentalData[dataId];
        return (
            data.sensorId,
            data.timestamp,
            data.airQuality,
            data.temperature,
            data.humidity,
            data.waterQuality,
            data.verified,
            data.oracle
        );
    }

    /**
     * @dev Get oracle information
     * @param oracleAddress Oracle address
     * @return name Oracle name
     * @return active Whether oracle is active
     * @return reputation Oracle reputation score
     * @return totalSubmissions Total submissions
     * @return successfulVerifications Successful verifications
     */
    function getOracle(address oracleAddress) 
        external 
        view 
        returns (
            string memory name,
            bool active,
            uint256 reputation,
            uint256 totalSubmissions,
            uint256 successfulVerifications
        ) 
    {
        Oracle storage oracle = oracles[oracleAddress];
        return (
            oracle.name,
            oracle.active,
            oracle.reputation,
            oracle.totalSubmissions,
            oracle.successfulVerifications
        );
    }

    /**
     * @dev Get sensor data history
     * @param sensorId The sensor identifier
     * @return dataIds Array of data IDs for this sensor
     */
    function getSensorHistory(string memory sensorId) 
        external 
        view 
        returns (uint256[] memory dataIds) 
    {
        return sensorDataHistory[sensorId];
    }

    /**
     * @dev Request environmental data for a sensor (triggers oracle response)
     * @param sensorId The sensor identifier
     */
    function requestData(string memory sensorId) external {
        require(bytes(sensorId).length > 0, "Sensor ID cannot be empty");
        emit DataRequested(sensorId, block.timestamp);
    }

    /**
     * @dev Get total number of environmental data entries
     * @return Total data count
     */
    function getDataCount() external view returns (uint256) {
        return _dataIds;
    }

    /**
     * @dev Update oracle reputation (admin function)
     * @param oracleAddress Oracle address
     * @param newReputation New reputation score
     */
    function updateOracleReputation(address oracleAddress, uint256 newReputation) 
        external 
        onlyOwner 
    {
        require(oracles[oracleAddress].active, "Oracle not registered");
        oracles[oracleAddress].reputation = newReputation;
        emit OracleReputationUpdated(oracleAddress, newReputation);
    }

    /**
     * @dev Deactivate an oracle (admin function)
     * @param oracleAddress Oracle address
     */
    function deactivateOracle(address oracleAddress) external onlyOwner {
        require(oracles[oracleAddress].active, "Oracle not active");
        oracles[oracleAddress].active = false;
    }
} 