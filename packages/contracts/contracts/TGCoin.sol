//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TgCoin is ERC20Permit, Ownable {
    constructor() ERC20("TgCoin", "TUG") ERC20Permit("TgCoin") {
        _mint(msg.sender, 10000000 * 10**18);
    }
}
