import { run, ethers } from "hardhat";
import {
  TG_COIN_GOERLI,
  ROPSTEN,
  RINKEBY,
  FANTOM,
  GOERLI,
  FEE,
} from "../common/constants";
import { Bridge__factory } from "../typechain-types";

async function main() {
  const nativeToken = ethers.utils.formatBytes32String("ETH");
  const [alice] = await ethers.getSigners();

  const bridgeFactory = new Bridge__factory(alice);
  const bridge = await bridgeFactory.deploy(
    nativeToken,
    FEE,
    [TG_COIN_GOERLI],
    [ROPSTEN, RINKEBY, FANTOM, GOERLI]
  );
  await bridge.deployed();
  console.log("Contract deployed at address " + bridge.address);

  await bridge.deployTransaction.wait(5);

  await run("verify:verify", {
    address: bridge.address,
    constructorArguments: [
      nativeToken,
      FEE,
      [TG_COIN_GOERLI],
      [ROPSTEN, RINKEBY, FANTOM, GOERLI],
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
