import { BigNumber, ethers } from "ethers";
import { NetworksUserConfig } from "hardhat/types/config";
import { ChainInfo, chainsConfig } from "../../../chains.config";

export class ChainsConfig {
  static get = (chainId: number): ChainsConfig => {
    return new ChainsConfig(chainId);
  };

  static getTest = (): ChainsConfig => {
    return new ChainsConfig(chainsConfig[0].chainId);
  };

  static toHardhatNetworksConfig = (): NetworksUserConfig => {
    const networks: NetworksUserConfig = {};
    chainsConfig.forEach((c) => {
      const chainName = c.name.toLowerCase();
      networks[chainName] = {
        url: `https://${chainName}.infura.io/v3/${process.env.INFURA_API_KEY ?? ""}`,
        accounts: [process.env.OWNER_PRIVATE_KEY ?? ""],
      };
    });

    return networks;
  };

  static chainIds = (): number[] => {
    return chainsConfig.map((c) => c.chainId);
  };

  private chainInfo: ChainInfo;

  constructor(chainId: number) {
    const chainInfo = chainsConfig.find((c) => c.chainId === chainId);
    if (!chainInfo) {
      throw new Error("Invalid chain id");
    }

    this.chainInfo = chainInfo;
  }

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
