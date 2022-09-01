import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { signERC2612Permit } from "eth-permit";
import { getTxOptions } from "../common/utils";
import { Bridge, Bridge__factory, ERC20Permit, TgCoin__factory } from "../typechain-types";
import { ChainsConfig } from "../common/chains.config.utils";
import { BigNumber } from "ethers";

describe("Bridge", () => {
  let _bridge: Bridge;
  let _alice: SignerWithAddress;
  let _chainId: number;
  let _tokens: ERC20Permit[];
  let _chains: number[];
  let _fee: BigNumber;

  before(async () => {
    [_alice] = await ethers.getSigners();
    _chainId = await _alice.getChainId();

    const chainsConfig = ChainsConfig.getTest();
    _chains = ChainsConfig.chainIds();
    _fee = chainsConfig.fee();

    const tokenFactory = new TgCoin__factory(_alice);
    _tokens = [await tokenFactory.deploy(), await tokenFactory.deploy()];
    _tokens.forEach(async (t) => await t.deployed());

    const bridgeFactory = new Bridge__factory(_alice);
    _bridge = await bridgeFactory.deploy(
      chainsConfig.nativeTokenAsBytes32(),
      _fee,
      _tokens.map((t) => t.address),
      _chains
    );
    await _bridge.deployed();
  });

  describe("sendERC20", async () => {
    it("send tokens and emit event", async () => {
      const permit = await signERC2612Permit(
        _alice.provider,
        _tokens[0].address,
        _alice.address,
        _bridge.address,
        _fee.toString()
      );
      const signature = await _alice.signMessage(
        ethers.utils.arrayify(
          ethers.utils.solidityKeccak256(
            [
              "address",
              "address",
              "address",
              "uint256",
              "uint32",
              "uint32",
              "uint8",
              "bytes32",
              "bytes32",
            ],
            [
              _alice.address,
              _alice.address,
              _tokens[0].address,
              _fee,
              _chainId,
              _chains[0],
              permit.v,
              permit.r,
              permit.s,
            ]
          )
        )
      );
      const balanceBefore = await _tokens[0].balanceOf(_bridge.address);

      await expect(
        await _bridge
          .connect(_alice)
          .sendERC20(
            _alice.address,
            _tokens[0].address,
            _fee,
            _chains[0],
            signature,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s,
            getTxOptions(_fee)
          )
      )
        .to.emit(_bridge, "Transfer")
        .withArgs(_alice.address, _alice.address, _tokens[0].address, _fee, _chains[0]);

      expect(await _tokens[0].balanceOf(_bridge.address)).to.be.above(
        balanceBefore.add(_fee.sub(1))
      );
    });
  });
});
