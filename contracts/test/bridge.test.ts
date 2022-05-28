import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { signERC2612Permit } from "eth-permit";
import {
  Bridge,
  // eslint-disable-next-line camelcase
  Bridge__factory,
  ERC20Permit,
  // eslint-disable-next-line camelcase
  TgCoin__factory,
  // eslint-disable-next-line node/no-missing-import
} from "../typechain-types";
// import { signPermit } from "./_utils";

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
  let _token: ERC20Permit;

  before(async () => {
    [_alice, _bob] = await ethers.getSigners();
    const coinFactory = new TgCoin__factory(_alice);
    _token = await coinFactory.deploy();
    const bridgeFactory = new Bridge__factory(_alice);
    _bridge = await bridgeFactory.deploy(
      ROPSTEN,
      "ETH",
      utils.parseEther("0.000001"),
      [_token.address, FTM_ROPSTEN],
      [ROPSTEN, RINKEBY, FANTOM]
    );
  });

  describe("sendERC20", async () => {
    it("send tokens and emit event", async () => {
      // await _token.approve(_bridge.address, utils.parseEther("0.0001"));
      const balanceBefore = await _token.balanceOf(_bridge.address);
      const amount = utils.parseEther("0.000001");
      const signature = await signERC2612Permit(
        _alice.provider,
        _token.address,
        _alice.address,
        _bridge.address,
        amount.toString()
      );

      await expect(
        await _bridge.sendERC20(
          _alice.address,
          _token.address,
          amount,
          RINKEBY,
          signature.deadline,
          signature.v,
          signature.r,
          signature.s,
          {
            value: amount,
            gasLimit: 400000,
            gasPrice: 693006881,
          }
        )
      )
        .to.emit(_bridge, "TransferERC20")
        .withArgs(
          _alice.address,
          _alice.address,
          _token.address,
          amount,
          RINKEBY
        );

      expect(await _token.balanceOf(_bridge.address)).to.be.above(
        balanceBefore.add(utils.parseEther("0.0000001"))
      );
    });
  });
});
