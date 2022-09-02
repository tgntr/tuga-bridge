import { execSync } from "child_process";
import * as fs from "fs";
import chainsConfig from "../../chains.config.json";
import YAML from "yaml";

const main = () => {
    const deploy = deployContract();
    setSubgraphNetworksConfigJson(deploy);
    setSubgraphManifestConfigYaml(deploy);
    // todo add env variable for subgraph key + name
    // todo MAYBE put bridge name (TugaBridge) in env or sth
};

const deployContract = (): ContractDeployInfo => {
    const deploys: ContractDeployInfo = {};
    for (const chain of chainsConfig) {
        const chainName = chain.name.toLowerCase();
        const cmd = `npx hardhat run ./scripts/deploy.ts --network ${chainName}`;
        const execResult = execSync(cmd, { cwd: "../contracts" }).toString("utf8");
        console.log(execResult);
        const bridgeAddress = execResult.split(/\s+/).find((s) => s.startsWith("0x") && s.length === 42);
        deploys[chainName] = { address: bridgeAddress ?? "" };
    }
    return deploys;
};

const setSubgraphNetworksConfigJson = (deploy: ContractDeployInfo): void => {
    const config: SubgraphNetworksConfig = {};
    for (const [chain, address] of Object.entries(deploy)) {
        config[chain] = { TugaBridge: address };
    }
    fs.writeFileSync("../subgraph/networks.json", JSON.stringify(config, null, 4));
};

const setSubgraphManifestConfigYaml = (deploy: ContractDeployInfo): void => {
    const src = fs.readFileSync("../subgraph/subgraph.example.yaml", "utf8");
    const config: SubgraphManifestConfig = YAML.parse(src);
    const exampleSource = Object.assign({}, config.dataSources[0]);
    config.dataSources = [];
    for (const [chain, address] of Object.entries(deploy)) {
        config.dataSources.push({
            ...exampleSource,
            network: chain,
            source: {
                ...exampleSource.source,
                address: address.address,
            },
        });
    }
    fs.writeFileSync("../subgraph/subgraph.yaml", YAML.stringify(config));
};

type ContractDeployInfo = {
    [networkName: string]: { address: string };
};

type SubgraphNetworksConfig = {
    [networkName: string]: { TugaBridge: { address: string } };
};

type SubgraphManifestConfig = {
    specVersion: string;
    description: string;
    repository: string;
    schema: { file: string };
    dataSources: {
        kind: string;
        name: string;
        network: string;
        source: { address: string; abi: string };
        mapping: {
            kind: string;
            apiVersion: string;
            language: string;
            entities: string[];
            abis: { name: string; file: string }[];
            eventHandlers: { event: string; handler: string }[];
            file: string;
        };
    }[];
};

main();
