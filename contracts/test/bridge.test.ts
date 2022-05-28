import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { PayableOverrides, utils } from "ethers";
import { ethers } from "hardhat";
import {
  Bridge,
  // eslint-disable-next-line camelcase
  Bridge__factory,
  IERC20,
  // eslint-disable-next-line camelcase
  IERC20__factory,
  // eslint-disable-next-line node/no-missing-import
} from "../typechain-types";

const DAI_ROPSTEN = "0xc2118d4d90b274016cB7a54c03EF52E6c537D957";
const FTM_ROPSTEN = "0xE768A083b64B4a060A21dd0C8a0D21483Bc9D88e";
const TG_COIN_LOCAL = "0xbf7749950381C684d9197aF8f2D6743923BfAcd8";
const ROPSTEN = 3;
const RINKEBY = 4;
const FANTOM = 4002;
describe("Bridge", () => {
  let _bridge: Bridge;
  let _alice: SignerWithAddress;
  let _bob: SignerWithAddress;
  let _token: IERC20;

  beforeEach(async () => {
    [_alice, _bob] = await ethers.getSigners();
    const bridgeFactory = new Bridge__factory(_alice);
    _bridge = await bridgeFactory.deploy(
      ROPSTEN,
      "ETH",
      utils.parseEther("0.0001"),
      [TG_COIN_LOCAL, FTM_ROPSTEN],
      [ROPSTEN, RINKEBY, FANTOM],
    );
    _token = IERC20__factory.connect(TG_COIN_LOCAL, _alice);
  });

  describe("sendERC20", async () => {
    it("send tokens and emit event", async () => {
      await _token.approve(_bridge.address, utils.parseEther("0.0001"));
      const balanceBefore = await _token.balanceOf(_bridge.address);
      await expect(
        await _bridge.sendERC20(
          _alice.address,
          TG_COIN_LOCAL,
          utils.parseEther("0.0001"),
          RINKEBY,
          { value: utils.parseEther("0.0001") }
        )
      )
        .to.emit(_bridge, "TransferERC20")
        .withArgs(
          _alice.address,
          _alice.address,
          TG_COIN_LOCAL,
          utils.parseEther("0.0001"),
          RINKEBY
        );

      expect(await _token.balanceOf(_bridge.address)).to.be.above(
        balanceBefore.add(utils.parseEther("0.00001"))
      );
    });
  });
});
