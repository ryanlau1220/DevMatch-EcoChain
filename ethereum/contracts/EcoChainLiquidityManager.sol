// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract EcoChainLiquidityManager is Ownable, ReentrancyGuard {
    IERC20 public immutable ecoChainToken;
    IERC20 public immutable dataCredit;
    IUniswapV2Router02 public immutable uniswapRouter;
    
    uint256 public constant BUYBACK_THRESHOLD = 1000 * 10**18; // 1000 tokens
    uint256 public constant BURN_PERCENTAGE = 50; // 50% of buyback tokens are burned
    
    event TokensBoughtBack(uint256 dataCreditAmount, uint256 ecoChainAmount);
    event TokensBurned(uint256 amount);
    event LiquidityAdded(uint256 tokenAmount, uint256 dataCreditAmount);
    
    constructor(
        address _ecoChainToken,
        address _dataCredit,
        address _uniswapRouter,
        address initialOwner
    ) Ownable(initialOwner) {
        ecoChainToken = IERC20(_ecoChainToken);
        dataCredit = IERC20(_dataCredit);
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }
    
    function executeBuybackAndBurn() external nonReentrant {
        uint256 dataCreditBalance = dataCredit.balanceOf(address(this));
        require(dataCreditBalance >= BUYBACK_THRESHOLD, "Insufficient balance for buyback");
        
        // Approve router to spend Data Credits
        dataCredit.approve(address(uniswapRouter), dataCreditBalance);
        
        // Prepare the swap
        address[] memory path = new address[](2);
        path[0] = address(dataCredit);
        path[1] = address(ecoChainToken);
        
        // Execute the buyback
        uint256[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            dataCreditBalance,
            0, // Accept any amount of EcoChain tokens
            path,
            address(this),
            block.timestamp
        );
        
        uint256 boughtAmount = amounts[1];
        uint256 burnAmount = (boughtAmount * BURN_PERCENTAGE) / 100;
        
        // Burn tokens
        require(ecoChainToken.transfer(address(0xdead), burnAmount), "Burn failed");
        
        emit TokensBoughtBack(dataCreditBalance, boughtAmount);
        emit TokensBurned(burnAmount);
    }
    
    function addLiquidity(uint256 tokenAmount, uint256 dataCreditAmount) external nonReentrant onlyOwner {
        require(tokenAmount > 0 && dataCreditAmount > 0, "Invalid amounts");
        
        // Approve both tokens
        ecoChainToken.approve(address(uniswapRouter), tokenAmount);
        dataCredit.approve(address(uniswapRouter), dataCreditAmount);
        
        // Add liquidity
        uniswapRouter.addLiquidity(
            address(ecoChainToken),
            address(dataCredit),
            tokenAmount,
            dataCreditAmount,
            0, // Accept any amount of tokens
            0, // Accept any amount of DC
            owner(), // Send LP tokens to owner
            block.timestamp
        );
        
        emit LiquidityAdded(tokenAmount, dataCreditAmount);
    }
    
    // Emergency withdraw function
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
