// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract EcoChainToken is ERC20, ERC20Burnable, Ownable, ERC20Permit, ERC20Votes {
    constructor(address initialOwner)
        ERC20("EcoChain", "ECOCHAIN")
        Ownable(initialOwner)
        ERC20Permit("EcoChain")
    {
        _mint(initialOwner, 100000000 * 10 ** decimals()); // Initial supply of 100 million tokens
    }

    // Override required by Solidity to track voting power
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
