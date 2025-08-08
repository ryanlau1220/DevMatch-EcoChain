module ecochain::ai_agent {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    // ===== STRUCTS =====

    /// AI Agent NFT - Represents a specialized AI agent for environmental analysis
    public struct AIAgent has key, store {
        id: UID,
        name: String,
        specialization: String,
        knowledge_areas: vector<String>,
        performance_score: u64,
        total_analyses: u64,
        successful_predictions: u64,
        owner: address,
        is_staked: bool,
        staking_rewards: u64,
        created_at: u64,
        last_active: u64,
        personality_traits: vector<String>,
        trading_strategy: String,
        upgrade_level: u8,
        experience_points: u64
    }

    /// AI Agent Registry - Manages all AI agents in the system
    public struct AIAgentRegistry has key {
        id: UID,
        total_agents: u64,
        agents_by_specialization: vector<String>,
        total_staked_agents: u64,
        total_rewards_distributed: u64
    }

    // ===== EVENTS =====

    /// Event emitted when a new AI agent is created
    public struct AIAgentCreated has copy, drop {
        agent_id: ID,
        name: String,
        specialization: String,
        owner: address,
        created_at: u64
    }

    /// Event emitted when an AI agent performs analysis
    public struct AnalysisPerformed has copy, drop {
        agent_id: ID,
        analysis_type: String,
        accuracy_score: u64,
        timestamp: u64
    }

    /// Event emitted when an AI agent is staked
    public struct AgentStaked has copy, drop {
        agent_id: ID,
        owner: address,
        staking_amount: u64,
        timestamp: u64
    }

    /// Event emitted when rewards are distributed
    public struct RewardsDistributed has copy, drop {
        agent_id: ID,
        amount: u64,
        reason: String,
        timestamp: u64
    }

    /// Event emitted when an AI agent is upgraded
    public struct AgentUpgraded has copy, drop {
        agent_id: ID,
        new_level: u8,
        experience_gained: u64,
        timestamp: u64
    }

    // ===== CONSTANTS =====

    const MAX_KNOWLEDGE_AREAS: u64 = 5;
    const MAX_PERSONALITY_TRAITS: u64 = 3;
    const BASE_PERFORMANCE_SCORE: u64 = 50;
    const UPGRADE_EXPERIENCE_THRESHOLD: u64 = 100;
    const MAX_UPGRADE_LEVEL: u8 = 10;

    // ===== FUNCTIONS =====

    /// Initialize the AI Agent Registry
    fun init(ctx: &mut TxContext) {
        let registry = AIAgentRegistry {
            id: object::new(ctx),
            total_agents: 0,
            agents_by_specialization: vector::empty(),
            total_staked_agents: 0,
            total_rewards_distributed: 0
        };
        transfer::share_object(registry);
    }

    /// Create a new AI Agent NFT
    public fun create_ai_agent(
        name: vector<u8>,
        specialization: vector<u8>,
        knowledge_areas: vector<vector<u8>>,
        personality_traits: vector<vector<u8>>,
        trading_strategy: vector<u8>,
        ctx: &mut TxContext
    ): AIAgent {
        let mut agent = AIAgent {
            id: object::new(ctx),
            name: string::utf8(name),
            specialization: string::utf8(specialization),
            knowledge_areas: vector::empty(),
            performance_score: BASE_PERFORMANCE_SCORE,
            total_analyses: 0,
            successful_predictions: 0,
            owner: tx_context::sender(ctx),
            is_staked: false,
            staking_rewards: 0,
            created_at: tx_context::epoch(ctx),
            last_active: tx_context::epoch(ctx),
            personality_traits: vector::empty(),
            trading_strategy: string::utf8(trading_strategy),
            upgrade_level: 1,
            experience_points: 0
        };

        // Add knowledge areas
        let mut i = 0;
        while (i < vector::length(&knowledge_areas)) {
            if (vector::length(&agent.knowledge_areas) < MAX_KNOWLEDGE_AREAS) {
                vector::push_back(&mut agent.knowledge_areas, string::utf8(*vector::borrow(&knowledge_areas, i)));
            };
            i = i + 1;
        };

        // Add personality traits
        let mut i = 0;
        while (i < vector::length(&personality_traits)) {
            if (vector::length(&agent.personality_traits) < MAX_PERSONALITY_TRAITS) {
                vector::push_back(&mut agent.personality_traits, string::utf8(*vector::borrow(&personality_traits, i)));
            };
            i = i + 1;
        };

        // Emit creation event
        event::emit(AIAgentCreated {
            agent_id: object::uid_to_inner(&agent.id),
            name: agent.name,
            specialization: agent.specialization,
            owner: agent.owner,
            created_at: agent.created_at
        });

        agent
    }

    /// Transfer AI Agent ownership
    public fun transfer_agent(agent: AIAgent, new_owner: address, _ctx: &mut TxContext): AIAgent {
        let AIAgent { id, name, specialization, knowledge_areas, performance_score, total_analyses, successful_predictions, owner: _, is_staked, staking_rewards, created_at, last_active, personality_traits, trading_strategy, upgrade_level, experience_points } = agent;
        
        // Create new agent with new UID
        let new_agent = AIAgent {
            id: object::new(_ctx),
            name,
            specialization,
            knowledge_areas,
            performance_score,
            total_analyses,
            successful_predictions,
            owner: new_owner,
            is_staked,
            staking_rewards,
            created_at,
            last_active,
            personality_traits,
            trading_strategy,
            upgrade_level,
            experience_points
        };
        
        // Destroy the old UID
        object::delete(id);
        
        new_agent
    }

    /// Perform analysis with the AI agent
    public fun perform_analysis(
        agent: &mut AIAgent,
        analysis_type: vector<u8>,
        accuracy_score: u64,
        ctx: &mut TxContext
    ) {
        agent.total_analyses = agent.total_analyses + 1;
        agent.last_active = tx_context::epoch(ctx);

        // Update performance score based on accuracy
        if (accuracy_score > 80) {
            agent.performance_score = agent.performance_score + 2;
            agent.successful_predictions = agent.successful_predictions + 1;
        } else if (accuracy_score < 50) {
            agent.performance_score = agent.performance_score - 1;
        };

        // Add experience points
        agent.experience_points = agent.experience_points + accuracy_score / 10;

        // Check for upgrade
        if (agent.experience_points >= UPGRADE_EXPERIENCE_THRESHOLD * (agent.upgrade_level as u64) && agent.upgrade_level < MAX_UPGRADE_LEVEL) {
            agent.upgrade_level = agent.upgrade_level + 1;
            agent.experience_points = 0;
            
            event::emit(AgentUpgraded {
                agent_id: object::uid_to_inner(&agent.id),
                new_level: agent.upgrade_level,
                experience_gained: accuracy_score / 10,
                timestamp: tx_context::epoch(ctx)
            });
        };

        event::emit(AnalysisPerformed {
            agent_id: object::uid_to_inner(&agent.id),
            analysis_type: string::utf8(analysis_type),
            accuracy_score,
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Stake an AI agent for rewards
    public fun stake_agent(agent: &mut AIAgent, staking_amount: u64, ctx: &mut TxContext) {
        assert!(!agent.is_staked, 0);
        agent.is_staked = true;
        agent.staking_rewards = agent.staking_rewards + staking_amount;

        event::emit(AgentStaked {
            agent_id: object::uid_to_inner(&agent.id),
            owner: agent.owner,
            staking_amount,
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Unstake an AI agent
    public fun unstake_agent(agent: &mut AIAgent, _ctx: &mut TxContext) {
        assert!(agent.is_staked, 0);
        agent.is_staked = false;
    }

    /// Distribute rewards to an AI agent
    public fun distribute_rewards(
        agent: &mut AIAgent,
        amount: u64,
        reason: vector<u8>,
        ctx: &mut TxContext
    ) {
        agent.staking_rewards = agent.staking_rewards + amount;

        event::emit(RewardsDistributed {
            agent_id: object::uid_to_inner(&agent.id),
            amount,
            reason: string::utf8(reason),
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Get AI agent information
    public fun get_agent_info(agent: &AIAgent): (String, String, u64, u64, u64, bool, u64, u8) {
        (
            agent.name,
            agent.specialization,
            agent.performance_score,
            agent.total_analyses,
            agent.successful_predictions,
            agent.is_staked,
            agent.staking_rewards,
            agent.upgrade_level
        )
    }

    /// Get agent's knowledge areas
    public fun get_knowledge_areas(agent: &AIAgent): vector<String> {
        agent.knowledge_areas
    }

    /// Get agent's personality traits
    public fun get_personality_traits(agent: &AIAgent): vector<String> {
        agent.personality_traits
    }

    /// Check if agent has specific knowledge area
    public fun has_knowledge_area(agent: &AIAgent, knowledge_area: vector<u8>): bool {
        let mut i = 0;
        while (i < vector::length(&agent.knowledge_areas)) {
            if (string::as_bytes(vector::borrow(&agent.knowledge_areas, i)) == knowledge_area) {
                return true
            };
            i = i + 1;
        };
        false
    }

    /// Get agent's trading strategy
    public fun get_trading_strategy(agent: &AIAgent): String {
        agent.trading_strategy
    }

    /// Update agent's trading strategy
    public fun update_trading_strategy(agent: &mut AIAgent, new_strategy: vector<u8>) {
        agent.trading_strategy = string::utf8(new_strategy);
    }
} 