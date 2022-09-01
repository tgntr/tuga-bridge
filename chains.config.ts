export const chainsConfig: ChainsConfig = [
  {
    name: "Goerli",
    chainId: 5,
    nativeToken: "ETH",
    fee: 0.00001,
    tokens: [
      {
        name: "TUG",
        address: "0x0bae146f9ff9af12c52868f34e7a92bc8424b5b0",
      },
    ],
  },
  {
    name: "Ropsten",
    chainId: 3,
    nativeToken: "ETH",
    fee: 0.00001,
    tokens: [
      {
        name: "TUG",
        address: "0x0bae146f9ff9af12c52868f34e7a92bc8424b5b0",
      },
    ],
  },
];

export type TokenInfo = {
  name: string;
  address: string;
};

export type ChainInfo = {
  name: string;
  chainId: number;
  nativeToken: string;
  fee: number;
  tokens: TokenInfo[];
};

export type ChainsConfig = ChainInfo[];
