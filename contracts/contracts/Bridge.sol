//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Bridge is Ownable, ReentrancyGuard {
    uint256 public _fee;
    bytes32 public _nativeToken;
    mapping(address => bool) public _tokens;
    mapping(uint32 => bool) public _chains;
    mapping(bytes32 => uint256) public _signatures;
    mapping(address => uint256[]) public _transfers;

    event Transfer(
        address indexed sender,
        address receiver,
        address token,
        uint256 amount,
        uint32 destinationChainId
    );

    constructor(
        bytes32 nativeToken,
        uint256 fee,
        address[] memory tokens,
        uint32[] memory chains
    ) payable {
        _nativeToken = nativeToken;
        _fee = fee;
        for (uint8 i = 0; i < tokens.length; i++) {
            _tokens[tokens[i]] = true;
        }
        for (uint8 i = 0; i < chains.length; i++) {
            _chains[chains[i]] = true;
        }
    }

    function sendERC20(
        address receiver,
        address token,
        uint256 amount,
        uint32 destinationChainId,
        bytes calldata signature,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable nonReentrant {
        require(
            _signatures[keccak256(signature)] == 0,
            "Signature already used!"
        );
        require(msg.value >= _fee, "Insufficient fee");
        require(_tokens[token] == true, "Unsupported token");
        require(
            destinationChainId != block.chainid &&
                _chains[destinationChainId] == true,
            "Unsupported chain"
        );
        ERC20Permit tokenContract = ERC20Permit(token);
        bytes32 msgHash = keccak256(
            abi.encodePacked(
                msg.sender,
                receiver,
                token,
                amount,
                uint32(block.chainid),
                destinationChainId,
                v,
                r,
                s
            )
        );
        require(
            ECDSA.recover(ECDSA.toEthSignedMessageHash(msgHash), signature) == owner(),
            "Invalid signature"
        );
        _signatures[keccak256(signature)] = block.number + 50;
        _transfers[msg.sender].push(block.number);
        tokenContract.permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        tokenContract.transferFrom(msg.sender, address(this), amount);
        emit Transfer(
            msg.sender,
            receiver,
            token,
            amount,
            destinationChainId
        );
    }

    function receiveERC20(
        address sender,
        address token,
        uint256 amount,
        uint32 originChainId,
        bytes32 txHash,
        bytes calldata signature
    ) external nonReentrant {
        require(
            _signatures[keccak256(signature)] == 0,
            "Signature already used!"
        );
        require(_tokens[token] == true, "Unsupported token");
        require(
            originChainId != block.chainid && _chains[originChainId] == true,
            "Unsupported chain"
        );
        ERC20Permit tokenContract = ERC20Permit(token);
        address receiver = msg.sender;
        bytes32 msgHash = keccak256(
            abi.encodePacked(
                sender,
                receiver,
                token,
                amount,
                originChainId,
                uint32(block.chainid),
                txHash
            )
        );
        require(
            ECDSA.recover(msgHash, signature) == owner(),
            "Invalid signature"
        );
        _signatures[keccak256(signature)] = block.number;
        _transfers[receiver].push(block.number);
        tokenContract.transfer(receiver, amount);
        emit Transfer(
            sender,
            receiver,
            token,
            amount,
            uint32(block.chainid)
        );
    }

    function refundERC20(
        address receiver,
        address token,
        uint256 amount,
        uint32 destinationChainId,
        bytes calldata signature,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        require(
            block.number > _signatures[keccak256(signature)],
            "Timelock has not expired!"
        );
        bytes32 msgHash = keccak256(
            abi.encodePacked(
                msg.sender,
                receiver,
                token,
                amount,
                uint32(block.chainid),
                destinationChainId,
                v,
                r,
                s
            )
        );
        require(
            ECDSA.recover(msgHash, signature) == owner(),
            "Invalid signature"
        );
        _signatures[keccak256(signature)] = 1;
        _transfers[msg.sender].push(block.number);
        ERC20Permit tokenContract = ERC20Permit(token);
        tokenContract.transfer(msg.sender, amount);
        payable(msg.sender).transfer(_fee);
        emit Transfer(
            address(this),
            msg.sender,
            token,
            amount,
            0
        );
    }
}
