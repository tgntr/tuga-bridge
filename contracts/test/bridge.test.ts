import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
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

const CHAINS = [1, 4];
const FEE = ethers.utils.parseEther("0.000001");

describe("Bridge", () => {
  let _bridge: Bridge;
  let _signers: SignerWithAddress[];
  let _tokens: ERC20Permit[];

  before(async () => {
    _signers = await ethers.getSigners();
    const coinFactory = new TgCoin__factory(_signers[0]);
    _tokens = [await coinFactory.deploy(), await coinFactory.deploy()];
    const bridgeFactory = new Bridge__factory(_signers[0]);
    _bridge = await bridgeFactory.deploy(
      CHAINS[0],
      "ETH",
      FEE,
      _tokens.map((t) => t.address),
      CHAINS
    );
  });

  describe("sendERC20", async () => {
    it("send tokens and emit event", async () => {
      const balanceBefore = await _tokens[0].balanceOf(_bridge.address);
      const signature = await signERC2612Permit(
        _signers[0].provider,
        _tokens[0].address,
        _signers[0].address,
        _bridge.address,
        FEE.toString()
      );

      await expect(
        await _bridge.sendERC20(
          _signers[0].address,
          _tokens[0].address,
          FEE,
          CHAINS[1],
          signature.deadline,
          signature.v,
          signature.r,
          signature.s,
          { value: FEE }
        )
      )
        .to.emit(_bridge, "TransferERC20")
        .withArgs(
          _signers[0].address,
          _signers[0].address,
          _tokens[0].address,
          FEE,
          CHAINS[1]
        );

      expect(await _tokens[0].balanceOf(_bridge.address)).to.be.above(
        balanceBefore.add(FEE.sub(1))
      );
    });
  });
});
