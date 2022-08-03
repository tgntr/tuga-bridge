module.exports = {
  extends: ["../../.eslintrc.js"],
  rules: {
    camelcase: ["error", { ignoreImports: true, allow: ["network_id"] }],
    "@typescript-eslint/no-var-requires": "off",
    "node/no-extraneous-require": [
      "error",
      {
        allowModules: ["dotenv"],
      },
    ],
  },
};
