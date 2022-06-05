import { utils } from "ethers";
import { ethers } from "hardhat";
import { Bridge__factory } from "../typechain-types";

const DAI_ROPSTEN = "0xE1Acc0c71c12d23329E0982922B3496ba8623378";
const FTM_ROPSTEN = "0xE768A083b64B4a060A21dd0C8a0D21483Bc9D88e";
const TG_COIN_GOERLI = "0x0bae146f9ff9af12c52868f34e7a92bc8424b5b0";
const ROPSTEN = 3;
const RINKEBY = 4;
const FANTOM = 4002;
const GOERLI = 420;

async function main() {
  const [alice] = await ethers.getSigners();
  const bridgeFactory = new Bridge__factory(alice);
  const bridge = await bridgeFactory.deploy(
    ethers.utils.formatBytes32String("ETH"),
    utils.parseEther("0.000001"),
    [TG_COIN_GOERLI],
    [ROPSTEN, RINKEBY, FANTOM, GOERLI]
  );
  await bridge.deployed();
  console.log("Contract deployed at address " + bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
