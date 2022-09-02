import { execSync } from "child_process";
import chainsConfig from "../../chains.config.json";
import * as fs from "fs";

const ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/;

const main = (): void => {
    const contractDeployResult: { chain: string; address: string | undefined }[] = [];
    chainsConfig.forEach((c) => {
        const chainName = c.name.toLowerCase();
        const deployCmd = `npx hardhat run ./scripts/deploy.ts --network ${chainName}`;
        const response = execSync(deployCmd).toString();
        const address = response.match(ADDRESS_REGEX)?.[0];
        contractDeployResult.push({ chain: chainName, address: address });
        console.log(response);
    });
    fs.writeFileSync("./contract-deploy-result.json", JSON.stringify(contractDeployResult, null, 4));
};

main();
