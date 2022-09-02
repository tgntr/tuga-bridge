import * as fs from "fs";
import YAML from "yaml";
import contractDeployResult from "../contracts/contract-deploy-result.json";

const main = (): void => {
    setNetworksJson();
    setSubgraphYaml();
    // todo add env variable for subgraph key + name
    // todo MAYBE put bridge name (TugaBridge) in env or sth
};

const setNetworksJson = (): void => {
    const networks = {};
    contractDeployResult.forEach((c) => {
        networks[c.chain] = { TugaBridge: { address: c.address } };
    });
    fs.writeFileSync("./networks.json", JSON.stringify(networks, null, 4));
};

const setSubgraphYaml = (): void => {
    const config: { dataSources: { network: string; source: { address: string } }[] } = YAML.parse(
        fs.readFileSync("./subgraph.example.yaml", "utf8")
    );
    const example = Object.assign({}, config.dataSources[0]);
    config.dataSources = contractDeployResult.map((c) => ({
        ...example,
        network: c.chain,
        source: { ...example.source, address: c.address },
    }));
    fs.writeFileSync("./subgraph.yaml", YAML.stringify(config));
};

main();
