interface Chain {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: { symbol: string; decimals: number };
}

const networks: Map<string, Chain> = new Map<string, Chain>([
  [
    "0x3",
    {
      chainId: "0x3",
      chainName: "Ethereum Ropsten Testnet",
      rpcUrls: ["https://ropsten.infura.io/v3/"],
      blockExplorerUrls: ["https://ropsten.etherscan.io"],
      nativeCurrency: {
        symbol: "ETH",
        decimals: 18,
      },
    },
  ],
  [
    "0x4",
    {
      chainId: "0x4",
      chainName: "Ethereum Rinkeby Testnet",
      rpcUrls: ["https://rinkeby.infura.io/v3/"],
      blockExplorerUrls: ["https://rinkeby.etherscan.io"],
      nativeCurrency: {
        symbol: "ETH",
        decimals: 18,
      },
    },
  ],
  [
    "0xFA2",
    {
      chainId: "0xFA2",
      chainName: "Fantom Testnet",
      rpcUrls: ["https://rpc.testnet.fantom.network"],
      blockExplorerUrls: ["https://testnet.ftmscan.com"],
      nativeCurrency: {
        symbol: "FTM",
        decimals: 18,
      },
    },
  ],
]);

export async function connect(chainId: string): Promise<void> {
  if (!networks.has(chainId)) {
    throw new Error("Unsupported chain id");
  }

  const provider = getMetamaskProvider();
  await provider.request({ method: "eth_requestAccounts" });
  const currentChainId = await provider.request({ method: "eth_chainId" });

  if (currentChainId !== chainId) {
    await provider
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      })
      .catch(async () => {
        await provider
          .request({
            method: "wallet_addEthereumChain",
            params: [networks.get(chainId)],
          })
          .catch(() => {
            throw new Error();
          });
      });
  }
}

export function getConnectedAddress(): string {
  return getMetamaskProvider().selectedAddress;
}

function getMetamaskProvider() {
  const provider = window.ethereum;
  if (!provider) {
    throw new Error("Metamask is not installed");
  }
  return provider;
}
