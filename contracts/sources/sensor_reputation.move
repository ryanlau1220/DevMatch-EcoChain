address devmatch {
module sensor_reputation {
    use std::vector;
    
    /// Custom errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_STAKE: u64 = 2;
    const E_SENSOR_NOT_FOUND: u64 = 3;
    const E_INVALID_SCORE: u64 = 4;

    /// Constants for reputation system
    const MINIMUM_STAKE: u64 = 100; // Minimum stake required in tokens
    const MAX_TRUST_SCORE: u64 = 100;
    const MIN_TRUST_SCORE: u64 = 0;
    const SLASH_PERCENTAGE: u64 = 50; // 50% slash for malicious behavior
    const ANOMALY_THRESHOLD: u64 = 3; // Number of anomalies before slashing

    struct SensorData has store {
        trust_score: u64,
        stake_amount: u64,
        anomaly_count: u64,
        last_update: u64,
        total_validations: u64,
        successful_validations: u64
    }

    struct SensorRegistry has key {
        sensors: vector<SensorData>
    }

    public fun initialize_registry(account: &signer) {
        let registry = SensorRegistry {
            sensors: vector::empty<SensorData>()
        };
        move_to(account, registry);
    }

    /// Initialize a new sensor with reputation tracking
    public fun register_sensor(
        registry: &mut SensorRegistry,
        initial_stake: u64
    ): u64 {
        assert!(initial_stake >= MINIMUM_STAKE, E_INSUFFICIENT_STAKE);
        
        let sensor_data = SensorData {
            trust_score: 50, // Start with neutral trust score
            stake_amount: initial_stake,
            anomaly_count: 0,
            last_update: 0, // Will be updated on first validation
            total_validations: 0,
            successful_validations: 0
        };

        vector::push_back(&mut registry.sensors, sensor_data);
        vector::length(&registry.sensors) - 1 // Return sensor ID
    }

    /// Update trust score based on sensor performance
    public fun update_trust_score(
        registry: &mut SensorRegistry,
        sensor_id: u64,
        validation_success: bool,
        data_quality_score: u64
    ) {
        assert!(data_quality_score <= 100, E_INVALID_SCORE);
        assert!(sensor_id < vector::length(&registry.sensors), E_SENSOR_NOT_FOUND);
        
        let sensor = vector::borrow_mut(&mut registry.sensors, sensor_id);
        sensor.total_validations = sensor.total_validations + 1;
        
        if (validation_success) {
            sensor.successful_validations = sensor.successful_validations + 1;
            // Increase trust score based on data quality
            let score_increase = data_quality_score / 10;
            sensor.trust_score = min(
                sensor.trust_score + score_increase,
                MAX_TRUST_SCORE
            );
        } else {
            // Decrease trust score for failed validations
            sensor.trust_score = if (sensor.trust_score >= 10) {
                sensor.trust_score - 10
            } else {
                MIN_TRUST_SCORE
            };
        }
    }

    /// Record and handle anomalies
    public fun record_anomaly(
        registry: &mut SensorRegistry,
        sensor_id: u64
    ): bool {
        assert!(sensor_id < vector::length(&registry.sensors), E_SENSOR_NOT_FOUND);
        
        let sensor = vector::borrow_mut(&mut registry.sensors, sensor_id);
        sensor.anomaly_count = sensor.anomaly_count + 1;

        if (sensor.anomaly_count >= ANOMALY_THRESHOLD) {
            // Slash stake and reduce trust score
            slash_stake(sensor);
            sensor.anomaly_count = 0;
            return true // Slashing occurred
        };
        
        false // No slashing needed
    }

    /// Slash the staked tokens of a malicious sensor
    fun slash_stake(sensor: &mut SensorData) {
        let slash_amount = (sensor.stake_amount * SLASH_PERCENTAGE) / 100;
        sensor.stake_amount = sensor.stake_amount - slash_amount;
        sensor.trust_score = MIN_TRUST_SCORE;
    }

    /// Add more stake to increase trust potential
    public fun add_stake(
        registry: &mut SensorRegistry,
        sensor_id: u64,
        additional_stake: u64
    ) {
        assert!(sensor_id < vector::length(&registry.sensors), E_SENSOR_NOT_FOUND);
        
        let sensor = vector::borrow_mut(&mut registry.sensors, sensor_id);
        sensor.stake_amount = sensor.stake_amount + additional_stake;
    }

    /// Get current reputation status
    public fun get_reputation(
        registry: &SensorRegistry,
        sensor_id: u64
    ): (u64, u64, u64) {
        assert!(sensor_id < vector::length(&registry.sensors), E_SENSOR_NOT_FOUND);
        
        let sensor = vector::borrow(&registry.sensors, sensor_id);
        (
            sensor.trust_score,
            sensor.stake_amount,
            sensor.anomaly_count
        )
    }

    /// Calculate reputation score with stake weight
    public fun calculate_weighted_score(
        registry: &SensorRegistry,
        sensor_id: u64
    ): u64 {
        assert!(sensor_id < vector::length(&registry.sensors), E_SENSOR_NOT_FOUND);
        
        let sensor = vector::borrow(&registry.sensors, sensor_id);
        let base_score = sensor.trust_score;
        let stake_weight = sensor.stake_amount / MINIMUM_STAKE;
        
        min(
            base_score + (stake_weight * 10), // Bonus points for higher stake
            MAX_TRUST_SCORE
        )
    }

    /// Helper function for minimum value
    fun min(a: u64, b: u64): u64 {
        if (a < b) { a } else { b }
    }

    #[test]
    fun test_sensor_reputation() {
        // Initialize registry
        let registry = SensorRegistry {
            sensors: vector::empty()
        };

        // Register a new sensor
        let sensor_id = register_sensor(&mut registry, MINIMUM_STAKE);
        assert!(sensor_id == 0, 0);

        // Update trust score
        update_trust_score(&mut registry, sensor_id, true, 80);
        let (trust_score, stake_amount, anomaly_count) = get_reputation(&registry, sensor_id);
        assert!(trust_score > 50, 1); // Score should increase
        assert!(stake_amount == MINIMUM_STAKE, 2);
        assert!(anomaly_count == 0, 3);

        // Test anomaly detection
        let slashed = record_anomaly(&mut registry, sensor_id);
        assert!(!slashed, 4); // First anomaly shouldn't trigger slashing

        // Test stake addition
        add_stake(&mut registry, sensor_id, MINIMUM_STAKE);
        let (_, new_stake, _) = get_reputation(&registry, sensor_id);
        assert!(new_stake == MINIMUM_STAKE * 2, 5);
    }
}
}
