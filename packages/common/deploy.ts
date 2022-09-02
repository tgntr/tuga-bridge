import { execSync } from "child_process";
import * as fs from "fs";
import chainsConfig from "../../chains.config.json";

type SubgraphNetworksConfig = {
    [networkName: string]: { TugaBridge: { address: string } };
};

const setSubgraphNetworksConfig = () => {
    const config: SubgraphNetworksConfig = {};

    chainsConfig.forEach((c) => {
        const chainName = c.name.toLowerCase();
        const cmd = `npx hardhat run ./scripts/deploy.ts --network ${chainName}`;
        const res = execSync(cmd, { cwd: "../contracts" });
        const bridgeAddress = res.toString("utf8").trim().split(" ").pop();
        config[chainName] = { TugaBridge: { address: bridgeAddress ?? "" } };
    });

    fs.writeFileSync("../subgraph/networks.json", JSON.stringify(config, null, 4));
};

setSubgraphNetworksConfig();
