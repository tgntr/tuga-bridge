require("babel-register");
require("babel-polyfill");
const { ChainsConfig } = require("../common/chains.config.utils");

require("dotenv").config({ path: "../../.env" });

module.exports = {
    networks: {
        ...ChainsConfig.toTruffleNetworksConfig(),
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        },
    },
    compilers: {
        solc: {
            version: "0.4.25", // Fetch exact version from solc-bin (default: truffle's version)
        },
    },
};
