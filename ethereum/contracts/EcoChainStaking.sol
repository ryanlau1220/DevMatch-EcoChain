// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoChainStaking is ReentrancyGuard, Ownable {
    IERC20 public immutable ecoChainToken;
    
    // Staking settings
    uint256 public constant MINIMUM_STAKING_PERIOD = 7 days;
    uint256 public constant BASE_APR = 500; // 5% APR (scaled by 100)
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 lastRewardsClaim;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor(address _ecoChainToken, address initialOwner) Ownable(initialOwner) {
        ecoChainToken = IERC20(_ecoChainToken);
    }
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        // Transfer tokens to this contract
        require(ecoChainToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update staking info
        if (stakes[msg.sender].amount > 0) {
            // If already staking, claim pending rewards first
            _claimRewards(msg.sender);
        }
        
        stakes[msg.sender].amount += amount;
        if (stakes[msg.sender].timestamp == 0) {
            stakes[msg.sender].timestamp = block.timestamp;
        }
        stakes[msg.sender].lastRewardsClaim = block.timestamp;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked amount");
        require(block.timestamp >= userStake.timestamp + MINIMUM_STAKING_PERIOD, "Minimum staking period not met");
        
        // Claim any pending rewards first
        _claimRewards(msg.sender);
        
        userStake.amount -= amount;
        totalStaked -= amount;
        
        // Transfer tokens back to user
        require(ecoChainToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }
    
    function _claimRewards(address user) internal {
        Stake storage userStake = stakes[user];
        require(userStake.amount > 0, "No stakes found");
        
        uint256 timeElapsed = block.timestamp - userStake.lastRewardsClaim;
        uint256 rewards = (userStake.amount * BASE_APR * timeElapsed) / (365 days * 100);
        
        if (rewards > 0) {
            userStake.lastRewardsClaim = block.timestamp;
            require(ecoChainToken.transfer(user, rewards), "Rewards transfer failed");
            emit RewardsClaimed(user, rewards);
        }
    }
    
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 stakingTime,
        uint256 pendingRewards
    ) {
        Stake storage userStake = stakes[user];
        amount = userStake.amount;
        stakingTime = userStake.timestamp;
        
        if (userStake.amount > 0) {
            uint256 timeElapsed = block.timestamp - userStake.lastRewardsClaim;
            pendingRewards = (userStake.amount * BASE_APR * timeElapsed) / (365 days * 100);
        }
    }
}
