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
        "no-unused-vars": ["warn", { args: "all" }],
        camelcase: ["error", { ignoreImports: true, allow: ["network_id"] }],
        "node/no-unpublished-import": "off",
        "no-unused-expressions": ["warn"],
        "node/no-extraneous-import": ["error", { allowModules: ["ethers", "dotenv"] }],
        "node/no-missing-import": [
            "error",
            {
                allowModules: [],
                resolvePaths: ["./*"],
                tryExtensions: [".js", ".json", ".ts", ".tsx"],
            },
        ],
        "no-use-before-define": ["off"],
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
                printWidth: 110,
            },
        ],
    },
};
