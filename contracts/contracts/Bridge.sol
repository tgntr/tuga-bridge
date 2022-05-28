//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Bridge is Ownable, ReentrancyGuard {
    uint256 public _chainId;
    string public _nativeToken;
    uint256 public _fee;
    mapping(address => bool) public _tokens;
    mapping(uint256 => bool) public _chains;

    event TransferERC20(
        address indexed user,
        address recipient,
        address token,
        uint256 amount,
        uint256 destinationChainId
    );

    constructor(
        uint256 chainId,
        string memory nativeToken,
        uint256 fee,
        address[] memory tokens,
        uint256[] memory chains
    ) payable {
        _chainId = chainId;
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
        address recipient,
        address token,
        uint256 amount,
        uint256 destinationChainId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable onlyOwner nonReentrant {
        require(msg.value >= _fee, "Insufficient fee");
        require(recipient != address(0), "Invalid receiver");
        require(_tokens[token] == true, "Unsupported token");
        require(amount > 0, "Invalid amount");
        require(
            destinationChainId != _chainId &&
                _chains[destinationChainId] == true,
            "Unsupported chain"
        );
        ERC20Permit tokenContract = ERC20Permit(token);
        tokenContract.permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        require(
            tokenContract.transferFrom(msg.sender, address(this), amount) ==
                true,
            "Transaction failed"
        );
        emit TransferERC20(
            msg.sender,
            recipient,
            token,
            amount,
            destinationChainId
        );
    }
}
