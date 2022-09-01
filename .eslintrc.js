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
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    "no-unused-vars": [1, { args: "all" }],
    camelcase: ["error", { ignoreImports: true }],
    "node/no-unpublished-import": "off",
    "node/no-extraneous-import": ["error", { allowModules: ["ethers", "dotenv"] }],
    "node/no-missing-import": [
      "error",
      {
        allowModules: [],
        resolvePaths: ["./*"],
        tryExtensions: [".js", ".json", ".ts", ".tsx"],
      },
    ],
    "no-use-before-define": [0],
    "prettier/prettier": [
      "error",
      {
        // todo
        // tabWidth: 4,
        printWidth: 100,
      },
    ],
  },
};
