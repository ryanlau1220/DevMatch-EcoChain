/// Simple Sensor NFT - Basic working version
/// This contract demonstrates a working Sui Move smart contract
module sensor_registry::simple_sensor {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String};

    // ===== STRUCTS =====

    /// Simple Sensor NFT - represents an environmental sensor
    public struct SimpleSensor has key, store {
        id: UID,
        /// Unique sensor identifier
        sensor_id: String,
        /// Sensor type (air_quality, water_quality, temperature, etc.)
        sensor_type: String,
        /// Sensor owner address
        owner: address,
        /// Registration timestamp
        registered_at: u64,
        /// Current trust score (0-100)
        trust_score: u8,
        /// Sensor status (0: Active, 1: Inactive, 2: Suspended)
        status: u8,
        /// Total number of verifications
        verification_count: u64,
        /// Number of successful verifications
        successful_verifications: u64,
        /// Reputation multiplier (1-5)
        reputation_multiplier: u8,
        /// Last verification timestamp
        last_verification: u64,
    }

    /// Sensor Registry - manages all registered sensors
    public struct SensorRegistry has key {
        id: UID,
        /// Total number of registered sensors
        total_sensors: u64,
    }

    // ===== CONSTANTS =====

    const SENSOR_STATUS_ACTIVE: u8 = 0;
    const SENSOR_STATUS_INACTIVE: u8 = 1;
    const SENSOR_STATUS_SUSPENDED: u8 = 2;

    const MAX_TRUST_SCORE: u8 = 100;
    const MIN_TRUST_SCORE: u8 = 0;
    
    const MAX_REPUTATION_MULTIPLIER: u8 = 5;
    const MIN_REPUTATION_MULTIPLIER: u8 = 1;
    
    const VERIFICATION_REWARD: u8 = 2;
    const VERIFICATION_PENALTY: u8 = 1;

    // ===== EVENTS =====

    /// Event emitted when a new sensor is registered
    public struct SensorRegistered has copy, drop {
        sensor_id: String,
        owner: address,
        sensor_type: String,
        timestamp: u64,
    }

    /// Event emitted when sensor ownership is transferred
    public struct SensorTransferred has copy, drop {
        sensor_id: String,
        from: address,
        to: address,
        timestamp: u64,
    }

    // ===== FUNCTIONS =====

    /// Initialize the sensor registry
    fun init(ctx: &mut TxContext) {
        let registry = SensorRegistry {
            id: object::new(ctx),
            total_sensors: 0,
        };
        transfer::share_object(registry);
    }

    /// Register a new simple sensor
    public fun register_sensor(
        registry: &mut SensorRegistry,
        sensor_id: vector<u8>,
        sensor_type: vector<u8>,
        ctx: &mut TxContext
    ): SimpleSensor {
        let sensor_id_str = string::utf8(sensor_id);
        let sensor_type_str = string::utf8(sensor_type);
        
        // Create new sensor
        let sensor = SimpleSensor {
            id: object::new(ctx),
            sensor_id: sensor_id_str,
            sensor_type: sensor_type_str,
            owner: tx_context::sender(ctx),
            registered_at: tx_context::epoch(ctx),
            trust_score: 50, // Default trust score
            status: SENSOR_STATUS_ACTIVE,
            verification_count: 0,
            successful_verifications: 0,
            reputation_multiplier: 1,
            last_verification: 0,
        };

        // Update registry
        registry.total_sensors = registry.total_sensors + 1;

        // Emit event
        event::emit(SensorRegistered {
            sensor_id: sensor_id_str,
            owner: tx_context::sender(ctx),
            sensor_type: sensor_type_str,
            timestamp: tx_context::epoch(ctx),
        });

        sensor
    }

    /// Transfer sensor ownership
    public fun transfer_sensor(
        mut sensor: SimpleSensor,
        new_owner: address,
        ctx: &mut TxContext
    ): SimpleSensor {
        let old_owner = sensor.owner;
        let sensor_id = sensor.sensor_id;
        
        // Update owner
        sensor.owner = new_owner;

        // Emit event
        event::emit(SensorTransferred {
            sensor_id,
            from: old_owner,
            to: new_owner,
            timestamp: tx_context::epoch(ctx),
        });

        sensor
    }

    /// Update sensor status (only owner can call)
    public fun update_sensor_status(
        sensor: &mut SimpleSensor,
        new_status: u8,
        ctx: &mut TxContext
    ) {
        assert!(sensor.owner == tx_context::sender(ctx), 0);
        assert!(new_status <= SENSOR_STATUS_SUSPENDED, 0);
        
        sensor.status = new_status;
    }

    /// Update trust score (can be called by oracle or admin)
    public fun update_trust_score(
        sensor: &mut SimpleSensor,
        new_score: u8,
        _ctx: &mut TxContext
    ) {
        assert!(new_score <= MAX_TRUST_SCORE, 0);
        assert!(new_score >= MIN_TRUST_SCORE, 0);
        
        sensor.trust_score = new_score;
    }

    /// Get sensor information
    public fun get_sensor_info(sensor: &SimpleSensor): (String, String, address, u64, u8, u8) {
        (
            sensor.sensor_id,
            sensor.sensor_type,
            sensor.owner,
            sensor.registered_at,
            sensor.trust_score,
            sensor.status,
        )
    }

    /// Check if sensor is active
    public fun is_active(sensor: &SimpleSensor): bool {
        sensor.status == SENSOR_STATUS_ACTIVE
    }

    /// Get sensor owner
    public fun get_owner(sensor: &SimpleSensor): address {
        sensor.owner
    }

    /// Get sensor trust score
    public fun get_trust_score(sensor: &SimpleSensor): u8 {
        sensor.trust_score
    }

    /// Get registry statistics
    public fun get_registry_stats(registry: &SensorRegistry): u64 {
        registry.total_sensors
    }

    /// Handle verification result and update reputation
    public fun handle_verification_result(
        sensor: &mut SimpleSensor,
        success: bool,
        ctx: &mut TxContext
    ) {
        // Update verification counts
        sensor.verification_count = sensor.verification_count + 1;
        if (success) {
            sensor.successful_verifications = sensor.successful_verifications + 1;
        };

        // Calculate success rate
        let success_rate = if (sensor.verification_count == 0) {
            0
        } else {
            (sensor.successful_verifications * 100) / sensor.verification_count
        };

        // Update reputation multiplier based on success rate
        if (success_rate >= 90) {
            if (sensor.reputation_multiplier < MAX_REPUTATION_MULTIPLIER) {
                sensor.reputation_multiplier = sensor.reputation_multiplier + 1;
            }
        } else if (success_rate < 70 && sensor.reputation_multiplier > MIN_REPUTATION_MULTIPLIER) {
            sensor.reputation_multiplier = sensor.reputation_multiplier - 1;
        };

        // Update trust score
        if (success) {
            let reward = VERIFICATION_REWARD * sensor.reputation_multiplier;
            if (sensor.trust_score <= (MAX_TRUST_SCORE - (reward as u8))) {
                sensor.trust_score = sensor.trust_score + (reward as u8);
            } else {
                sensor.trust_score = MAX_TRUST_SCORE;
            }
        } else {
            let penalty = VERIFICATION_PENALTY * sensor.reputation_multiplier;
            if (sensor.trust_score >= (MIN_TRUST_SCORE + (penalty as u8))) {
                sensor.trust_score = sensor.trust_score - (penalty as u8);
            } else {
                sensor.trust_score = MIN_TRUST_SCORE;
            }
        };

        // Update last verification timestamp
        sensor.last_verification = tx_context::epoch(ctx);
    }

    /// Get sensor reputation details
    public fun get_sensor_reputation(sensor: &SimpleSensor): (u64, u64, u8, u64) {
        (
            sensor.verification_count,
            sensor.successful_verifications,
            sensor.reputation_multiplier,
            sensor.last_verification,
        )
    }
} 