// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// GUI Token Contract
contract GUIToken is ERC20, Ownable {
    using Counters for Counters.Counter;

    mapping(address => bool) public hasClaimed;
    mapping(address => uint256) public lastClaimTime;

    uint256 public constant FAUCET_AMOUNT = 50 * 10**18; // 50 GUI
    uint256 public constant FAUCET_COOLDOWN = 24 hours;

    event TokensClaimed(address indexed user, uint256 amount);

    constructor() ERC20("CryptoTruth GUI", "GUI") {
        _mint(msg.sender, 10000000 * 10**decimals()); // 10M initial supply
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function faucet() public {
        require(
            !hasClaimed[msg.sender] ||
            block.timestamp >= lastClaimTime[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown active"
        );
        require(balanceOf(msg.sender) < 200 * 10**decimals(), "Balance too high for faucet");

        _mint(msg.sender, FAUCET_AMOUNT);
        hasClaimed[msg.sender] = true;
        lastClaimTime[msg.sender] = block.timestamp;

        emit TokensClaimed(msg.sender, FAUCET_AMOUNT);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}