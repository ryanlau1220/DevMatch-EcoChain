module sensor_registry::sensor_auth {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::hash::keccak256;
    use sui::ed25519;
    use std::vector;
    use std::string::{Self, String};

    // ===== STRUCTS =====

    /// Represents a registered public key for a sensor
    public struct SensorKeyRegistry has key {
        id: UID,
        /// Maps sensor_id to public key
        sensor_keys: vector<SensorKeyEntry>,
    }

    /// Entry in the key registry
    public struct SensorKeyEntry has store {
        sensor_id: String,
        public_key: vector<u8>,
        registration_time: u64,
        last_verification: u64,
        verification_count: u64,
    }

    // ===== EVENTS =====

    /// Emitted when a new public key is registered
    public struct KeyRegistered has copy, drop {
        sensor_id: String,
        public_key: vector<u8>,
        timestamp: u64,
    }

    /// Emitted when a signature is verified
    public struct SignatureVerified has copy, drop {
        sensor_id: String,
        data_hash: vector<u8>,
        timestamp: u64,
    }

    // ===== ERRORS =====
    const ERROR_KEY_NOT_FOUND: u64 = 0;
    const ERROR_INVALID_SIGNATURE: u64 = 1;
    const ERROR_DUPLICATE_KEY: u64 = 2;

    // ===== FUNCTIONS =====

    /// Initialize the key registry
    fun init(ctx: &mut TxContext) {
        let registry = SensorKeyRegistry {
            id: object::new(ctx),
            sensor_keys: vector::empty(),
        };
        transfer::share_object(registry);
    }

    /// Register a new public key for a sensor
    public fun register_key(
        registry: &mut SensorKeyRegistry,
        sensor_id: vector<u8>,
        public_key: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sensor_id_str = string::utf8(sensor_id);
        
        // Check for existing key
        let i = 0;
        let len = vector::length(&registry.sensor_keys);
        while (i < len) {
            let entry = vector::borrow(&registry.sensor_keys, i);
            assert!(entry.sensor_id != sensor_id_str, ERROR_DUPLICATE_KEY);
            i = i + 1;
        };

        // Create new key entry
        let entry = SensorKeyEntry {
            sensor_id: sensor_id_str,
            public_key,
            registration_time: tx_context::epoch(ctx),
            last_verification: 0,
            verification_count: 0,
        };

        vector::push_back(&mut registry.sensor_keys, entry);

        // Emit event
        event::emit(KeyRegistered {
            sensor_id: sensor_id_str,
            public_key,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Verify a signature
    public fun verify_signature(
        registry: &mut SensorKeyRegistry,
        sensor_id: vector<u8>,
        message: vector<u8>,
        signature: vector<u8>,
        ctx: &mut TxContext
    ): bool {
        let sensor_id_str = string::utf8(sensor_id);
        
        // Find sensor's public key
        let i = 0;
        let len = vector::length(&registry.sensor_keys);
        let entry_ref = 0;
        let found = false;

        while (i < len) {
            let entry = vector::borrow(&registry.sensor_keys, i);
            if (entry.sensor_id == sensor_id_str) {
                entry_ref = i;
                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, ERROR_KEY_NOT_FOUND);

        // Get the entry
        let entry = vector::borrow_mut(&mut registry.sensor_keys, entry_ref);
        
        // Verify signature using ed25519
        let is_valid = ed25519::verify(&signature, &entry.public_key, &message);
        assert!(is_valid, ERROR_INVALID_SIGNATURE);

        // Update verification stats
        entry.last_verification = tx_context::epoch(ctx);
        entry.verification_count = entry.verification_count + 1;

        // Calculate hash for event
        let data_hash = keccak256(&message);

        // Emit verification event
        event::emit(SignatureVerified {
            sensor_id: sensor_id_str,
            data_hash,
            timestamp: tx_context::epoch(ctx),
        });

        true
    }

    /// Get key registration info
    public fun get_key_info(
        registry: &SensorKeyRegistry,
        sensor_id: vector<u8>
    ): (vector<u8>, u64, u64, u64) {
        let sensor_id_str = string::utf8(sensor_id);
        
        let i = 0;
        let len = vector::length(&registry.sensor_keys);
        while (i < len) {
            let entry = vector::borrow(&registry.sensor_keys, i);
            if (entry.sensor_id == sensor_id_str) {
                return (
                    entry.public_key,
                    entry.registration_time,
                    entry.last_verification,
                    entry.verification_count,
                )
            };
            i = i + 1;
        };
        abort ERROR_KEY_NOT_FOUND
    }
}
