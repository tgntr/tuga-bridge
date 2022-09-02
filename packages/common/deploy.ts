import { execSync } from "child_process";
import * as fs from "fs";
import chainsConfig from "../../chains.config.json";

type SubgraphNetworksConfig = {
    [networkName: string]: { TugaBridge: { address: string } };
};

// todo split to two - deployBridge & setConfig
const setSubgraphNetworksConfig = () => {
    const config: SubgraphNetworksConfig = {};

    chainsConfig.forEach((c) => {
        const chainName = c.name.toLowerCase();
        const cmd = `npx hardhat run ./scripts/deploy.ts --network ${chainName}`;
        const result = execSync(cmd, { cwd: "../contracts" }).toString("utf8");
        console.log(result);
        const bridgeAddress = result.split(/\s+/).find((s) => s.startsWith("0x") && s.length === 42);
        config[chainName] = { TugaBridge: { address: bridgeAddress ?? "" } };
    });

    fs.writeFileSync("../subgraph/networks.json", JSON.stringify(config, null, 4));
};

setSubgraphNetworksConfig();
