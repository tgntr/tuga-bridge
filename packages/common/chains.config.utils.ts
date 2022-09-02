import { BigNumber, ethers } from "ethers";
import chainsConfig from "../../chains.config.json";
import HDWalletProvider from "@truffle/hdwallet-provider";

type TokenInfo = {
    name: string;
    address: string;
};

type ChainInfo = {
    name: string;
    chainId: number;
    nativeToken: string;
    fee: number;
    tokens: TokenInfo[];
};

type HardhatNetworksConfig = {
    [networkName: string]: { url: string; accounts: string[] } | undefined;
};

type TruffleNetworksConfig = {
    [networkName: string]: { provider: () => any; network_id: string } | undefined;
};

const infuraUrl = (chainName: string): string => {
    return `https://${chainName}.infura.io/v3/${process.env.INFURA_API_KEY}`;
};

export class ChainsConfig {
    private chainInfo: ChainInfo;

    constructor(chainId: number) {
        const chainInfo = chainsConfig.find((c) => c.chainId === chainId);
        if (!chainInfo) {
            throw new Error("Invalid chain id");
        }

        this.chainInfo = chainInfo;
    }

    static get = (chainId: number): ChainsConfig => {
        return new ChainsConfig(chainId);
    };

    static getTest = (): ChainsConfig => {
        return new ChainsConfig(chainsConfig[0].chainId);
    };

    static toHardhatNetworksConfig = (): HardhatNetworksConfig => {
        const networks: HardhatNetworksConfig = {};
        chainsConfig.forEach((c) => {
            const chainName = c.name.toLowerCase();
            networks[chainName] = {
                url: infuraUrl(chainName),
                accounts: [process.env.OWNER_PRIVATE_KEY ?? ""],
            };
        });

        return networks;
    };

    static toTruffleNetworksConfig = (): TruffleNetworksConfig => {
        const networks: TruffleNetworksConfig = {};

        chainsConfig.forEach((c) => {
            const chainName = c.name.toLowerCase();
            networks[chainName] = {
                provider: () => new HDWalletProvider(process.env.OWNER_MNEMONIC ?? "", infuraUrl(chainName)),
                network_id: c.chainId.toString(),
            };
        });

        return networks;
    };

    static chainIds = (): number[] => {
        return chainsConfig.map((c) => c.chainId);
    };

    fee = (): BigNumber => {
        return ethers.utils.parseEther(this.chainInfo.fee.toString());
    };

    nativeTokenAsBytes32 = (): string => {
        return ethers.utils.formatBytes32String(this.chainInfo.nativeToken);
    };

    tokenAddresses = (): string[] => {
        return this.chainInfo.tokens.map((t) => t.address);
    };

    chainName = (): string => {
        return this.chainInfo.name;
    };
}