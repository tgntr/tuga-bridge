module.exports = {
  extends: ["../../.eslintrc.js"],
  rules: {
    "node/no-missing-import": [
      "error",
      {
        allowModules: [],
        resolvePaths: ["./typechain-types/*"],
        tryExtensions: [".js", ".json", ".node", ".ts"],
      },
    ],
    "node/no-unpublished-import": [
      "error",
      {
        allowModules: ["hardhat", "ethers"],
      },
    ],
  },
};
