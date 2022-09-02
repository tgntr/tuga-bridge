module.exports = {
    extends: ["../../.eslintrc.js"],
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "node/no-extraneous-require": [
            "error",
            {
                allowModules: ["dotenv"],
            },
        ],
        "node/no-missing-require": "off",
        "node/no-unpublished-require": "off",
    },
};
