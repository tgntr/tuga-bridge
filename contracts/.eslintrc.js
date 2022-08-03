module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "standard",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules"] },
    ],
    "no-unused-vars": [1, { args: "all" }],
    camelcase: [2, { ignoreImports: true }],
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
