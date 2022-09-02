import { execSync } from "child_process";
import chainsConfig from "../../chains.config.json";
import * as fs from "fs";

const ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/;

const main = () => {
    const deployResult: { chain: string; address: string | undefined }[] = [];
    for (const chain of chainsConfig) {
        const chainName = chain.name.toLowerCase();
        const deployCmd = `npx hardhat run ./scripts/deploy.ts --network ${chainName}`;
        const response = execSync(deployCmd).toString();
        const address = response.match(ADDRESS_REGEX)?.[0];
        console.log(address);
        deployResult.push({ chain: chainName, address: address });
        console.log(response);
    }

    fs.writeFileSync("./deploy-result.json", JSON.stringify(deployResult, null, 4));
};

main();
