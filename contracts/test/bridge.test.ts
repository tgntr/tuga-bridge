import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { PayableOverrides, utils } from "ethers";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import {
  Bridge,
  Bridge__factory,
  IERC20,
  IERC20__factory,
} from "../typechain-types";

const DAI_ROPSTEN = "0xc2118d4d90b274016cB7a54c03EF52E6c537D957";
const FTM_ROPSTEN = "0xE768A083b64B4a060A21dd0C8a0D21483Bc9D88e";
const ROPSTEN = 3;
const RINKEBY = 4;
const FANTOM = 4002;
const FEES: PayableOverrides = {
  value: utils.parseEther("0.0001"),
  gasLimit: 4200000,
  gasPrice: 80000000000,
};
describe("Bridge", () => {
  let _bridge: Bridge;
  let _alice: SignerWithAddress;
  let _bob: SignerWithAddress;
  let _daiRopsten: IERC20;

  beforeEach(async () => {
    [_alice, _bob] = await ethers.getSigners();

    // connect to deployed contract
    //
    // _bridge = Bridge__factory.connect(
    //   "0x786C9699ab26a9fD8F6FD79532EF75c51852c661",
    //   _alice
    // );
    _daiRopsten = IERC20__factory.connect(DAI_ROPSTEN, _alice);
    const options: PayableOverrides = {
      value: utils.parseEther("0.0001"),
      gasLimit: 4200000,
      gasPrice: 80000000000,
    };
    const bridgeFactory = new Bridge__factory(_alice);
    _bridge = await bridgeFactory.deploy(
      "ETH",
      utils.parseEther("0.0001"),
      [DAI_ROPSTEN, FTM_ROPSTEN],
      [ROPSTEN, RINKEBY, FANTOM],
      options
    );
  });

  describe("sendERC20", async () => {
    it("send tokens and emit event", async () => {
      const amount = 5;
      await _daiRopsten.approve(_bridge.address, amount * 10, {
        gasLimit: 4200000,
        gasPrice: 80000000000,
      });

      await expect(
        await _bridge.sendERC20(
          _alice.address,
          DAI_ROPSTEN,
          amount,
          RINKEBY,
          FEES
        )
      )
        .to.emit(_bridge, "ERC20Sent")
        .withArgs(_alice.address, _alice.address, DAI_ROPSTEN, amount, RINKEBY);
      // .and.to.changeTokenBalances(
      //   _daiRopsten,
      //   [_alice, _daiRopsten],
      //   [-5, 5]
      // );
    });
  });
});
