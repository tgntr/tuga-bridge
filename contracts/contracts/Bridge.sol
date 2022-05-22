//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bridge is Ownable, ReentrancyGuard {
    string public _nativeToken;
    uint256 public _fee;
    mapping(address => bool) public _tokens;
    mapping(uint256 => bool) public _chains;

    event ERC20Sent(
        address user,
        address destination,
        address token,
        uint256 amount,
        uint256 chainId
    );

    event ERC20Received(
        address user,
        address token,
        uint256 amount,
        uint256 chainId
    );

    constructor(
        string memory nativeToken,
        uint256 fee,
        address[] memory tokens,
        uint256[] memory chains
    ) payable {
        _nativeToken = nativeToken;
        _fee = fee;
        for (uint256 i = 0; i < tokens.length; i++) {
            _tokens[tokens[i]] = true;
        }
        for (uint256 i = 0; i < chains.length; i++) {
            _chains[chains[i]] = true;
        }
    }

    function sendERC20(
        address destination,
        address token,
        uint256 amount,
        uint256 chainId
    ) external payable onlyOwner nonReentrant {
        require(msg.value >= _fee, "Insufficient fee");
        require(destination != address(0), "Invalid receiver");
        require(_tokens[token] == true, "Unsupported token");
        require(amount > 0, "Invalid amount");
        require(_chains[chainId] == true, "Unsupported chain");
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount) ==
                true,
            "Transaction failed"
        );
        emit ERC20Sent(msg.sender, destination, token, amount, chainId);
    }
}
