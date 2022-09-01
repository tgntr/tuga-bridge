import { run, ethers } from "hardhat";
import { ChainsConfig } from "../common/chains.config.utils";
import { Bridge__factory } from "../typechain-types";

async function main() {
    const { chainId } = await ethers.provider.getNetwork();
    const chainsConfig = ChainsConfig.get(chainId);
    const nativeToken = chainsConfig.nativeTokenAsBytes32();
    const fee = chainsConfig.fee();
    const tokens = chainsConfig.tokenAddresses();
    const chains = ChainsConfig.chainIds();
    const [alice] = await ethers.getSigners();

    const bridgeFactory = new Bridge__factory(alice);
    const bridge = await bridgeFactory.deploy(nativeToken, fee, tokens, chains);
    await bridge.deployed();
    console.log(`Contract deployed to ${chainsConfig.chainName()} at address ${bridge.address}`);

    await bridge.deployTransaction.wait(5);

    await run("verify:verify", {
        address: bridge.address,
        constructorArguments: [nativeToken, fee, tokens, chains],
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
