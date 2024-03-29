require("babel-register");
require("babel-polyfill");
const HDWalletProvider = require("truffle-hdwallet-provider");

require("dotenv").config({ path: "../../.env" });

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          process.env.OWNER_MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
        );
      },
      network_id: "3",
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(
          process.env.OWNER_MNEMONIC,
          `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
        );
      },
      network_id: "5",
    },
  },
  compilers: {
    solc: {
      version: "0.4.25", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};
