import { PayableOverrides, utils } from "ethers";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Bridge__factory } from "../typechain-types";

const DAI_ROPSTEN = "0xE1Acc0c71c12d23329E0982922B3496ba8623378";
const FTM_ROPSTEN = "0xE768A083b64B4a060A21dd0C8a0D21483Bc9D88e";
const ROPSTEN = 3;
const RINKEBY = 4;
const FANTOM = 4002;

async function main() {
  const [alice] = await ethers.getSigners();
  const options: PayableOverrides = {
    value: utils.parseEther("0.0001"),
    gasLimit: 4200000,
    gasPrice: 80000000000,
  };
  const bridgeFactory = new Bridge__factory(alice);
  const bridge = await bridgeFactory.deploy(
    "ETH",
    utils.parseEther("0.0001"),
    [DAI_ROPSTEN, FTM_ROPSTEN],
    [ROPSTEN, RINKEBY, FANTOM],
    options
  );
  console.log(bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
