// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EnvironmentalMarket
 * @dev A prediction market for environmental outcomes
 */
contract EnvironmentalMarket is Ownable, ReentrancyGuard {

    constructor() Ownable(msg.sender) {}

    struct Market {
        uint256 marketId;
        string question;
        string description;
        uint256 endTime;
        uint256 totalLiquidity;
        bool resolved;
        bool outcome;
        address creator;
        mapping(address => uint256) yesShares;
        mapping(address => uint256) noShares;
    }

    struct Position {
        uint256 yesShares;
        uint256 noShares;
    }

    uint256 private _marketIds;
    
    mapping(uint256 => Market) public markets;
    mapping(address => mapping(uint256 => Position)) public userPositions;
    
    uint256 public constant MINIMUM_LIQUIDITY = 0.1 ether;
    uint256 public constant FEE_PERCENTAGE = 3; // 3% fee
    
    event MarketCreated(uint256 indexed marketId, string question, address indexed creator, uint256 endTime);
    event SharesBought(uint256 indexed marketId, address indexed buyer, bool outcome, uint256 shares, uint256 cost);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event LiquidityAdded(uint256 indexed marketId, address indexed provider, uint256 amount);

    modifier marketExists(uint256 marketId) {
        require(marketId <= _marketIds, "Market does not exist");
        _;
    }

    modifier marketNotResolved(uint256 marketId) {
        require(!markets[marketId].resolved, "Market already resolved");
        _;
    }

    modifier marketEnded(uint256 marketId) {
        require(block.timestamp >= markets[marketId].endTime, "Market not ended");
        _;
    }

    /**
     * @dev Create a new environmental prediction market
     * @param question The prediction question
     * @param description Detailed description of the market
     * @param duration Duration in seconds from now until market ends
     */
    function createMarket(
        string memory question,
        string memory description,
        uint256 duration
    ) external payable {
        require(msg.value >= MINIMUM_LIQUIDITY, "Insufficient liquidity");
        require(bytes(question).length > 0, "Question cannot be empty");
        require(duration > 0, "Duration must be positive");

        _marketIds++;
        uint256 marketId = _marketIds;

        Market storage market = markets[marketId];
        market.marketId = marketId;
        market.question = question;
        market.description = description;
        market.endTime = block.timestamp + duration;
        market.totalLiquidity = msg.value;
        market.creator = msg.sender;

        // Initialize market with equal liquidity for yes/no
        uint256 initialLiquidity = msg.value / 2;
        market.yesShares[address(this)] = initialLiquidity;
        market.noShares[address(this)] = initialLiquidity;

        emit MarketCreated(marketId, question, msg.sender, market.endTime);
        emit LiquidityAdded(marketId, msg.sender, msg.value);
    }

    /**
     * @dev Buy shares for a specific outcome
     * @param marketId The market ID
     * @param outcome True for "yes", false for "no"
     * @param shares Amount of shares to buy
     */
    function buyShares(
        uint256 marketId,
        bool outcome,
        uint256 shares
    ) external payable marketExists(marketId) marketNotResolved(marketId) nonReentrant {
        require(shares > 0, "Shares must be positive");
        require(msg.value > 0, "Must send ETH to buy shares");

        Market storage market = markets[marketId];
        uint256 cost = calculateCost(marketId, outcome, shares);
        require(msg.value >= cost, "Insufficient payment");

        if (outcome) {
            market.yesShares[msg.sender] += shares;
            market.yesShares[address(this)] -= shares;
        } else {
            market.noShares[msg.sender] += shares;
            market.noShares[address(this)] -= shares;
        }

        userPositions[msg.sender][marketId].yesShares = market.yesShares[msg.sender];
        userPositions[msg.sender][marketId].noShares = market.noShares[msg.sender];

        // Refund excess payment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit SharesBought(marketId, msg.sender, outcome, shares, cost);
    }

    /**
     * @dev Resolve a market with the final outcome
     * @param marketId The market ID
     * @param outcome The final outcome (true for "yes", false for "no")
     */
    function resolveMarket(uint256 marketId, bool outcome) 
        external 
        marketExists(marketId) 
        marketNotResolved(marketId) 
        marketEnded(marketId) 
        onlyOwner 
    {
        Market storage market = markets[marketId];
        market.resolved = true;
        market.outcome = outcome;

        emit MarketResolved(marketId, outcome);
    }

    /**
     * @dev Claim winnings after market resolution
     * @param marketId The market ID
     */
    function claimWinnings(uint256 marketId) 
        external 
        marketExists(marketId) 
        nonReentrant 
    {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved");

        Position storage position = userPositions[msg.sender][marketId];
        uint256 winnings = 0;

        if (market.outcome) {
            // "Yes" won
            winnings = position.yesShares;
            position.yesShares = 0;
            market.yesShares[msg.sender] = 0;
        } else {
            // "No" won
            winnings = position.noShares;
            position.noShares = 0;
            market.noShares[msg.sender] = 0;
        }

        require(winnings > 0, "No winnings to claim");
        payable(msg.sender).transfer(winnings);
    }

    /**
     * @dev Calculate the cost to buy shares
     * @param marketId The market ID
     * @param outcome True for "yes", false for "no"
     * @param shares Amount of shares to buy
     * @return cost The cost in ETH
     */
    function calculateCost(uint256 marketId, bool outcome, uint256 shares) public view returns (uint256) {
        Market storage market = markets[marketId];
        uint256 totalShares = outcome ? 
            market.yesShares[address(this)] : 
            market.noShares[address(this)];
        
        if (totalShares == 0) return shares;
        
        // Simple constant product formula
        uint256 cost = (shares * market.totalLiquidity) / (2 * totalShares);
        uint256 fee = (cost * FEE_PERCENTAGE) / 100;
        return cost + fee;
    }

    /**
     * @dev Get market information
     * @param marketId The market ID
     * @return question Market question
     * @return description Market description
     * @return endTime Market end time
     * @return totalLiquidity Total liquidity in the market
     * @return resolved Whether market is resolved
     * @return outcome Final outcome (if resolved)
     * @return creator Market creator address
     */
    function getMarket(uint256 marketId) 
        external 
        view 
        marketExists(marketId) 
        returns (
            string memory question,
            string memory description,
            uint256 endTime,
            uint256 totalLiquidity,
            bool resolved,
            bool outcome,
            address creator
        ) 
    {
        Market storage market = markets[marketId];
        return (
            market.question,
            market.description,
            market.endTime,
            market.totalLiquidity,
            market.resolved,
            market.outcome,
            market.creator
        );
    }

    /**
     * @dev Get user position in a market
     * @param user User address
     * @param marketId Market ID
     * @return yesShares Number of "yes" shares
     * @return noShares Number of "no" shares
     */
    function getUserPosition(address user, uint256 marketId) 
        external 
        view 
        marketExists(marketId) 
        returns (uint256 yesShares, uint256 noShares) 
    {
        Position storage position = userPositions[user][marketId];
        return (position.yesShares, position.noShares);
    }

    /**
     * @dev Get total number of markets
     * @return Total market count
     */
    function getMarketCount() external view returns (uint256) {
        return _marketIds;
    }
} 