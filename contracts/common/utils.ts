import { BigNumber, BigNumberish, PayableOverrides } from "ethers";

export function getTxOptions(
  value: BigNumberish = BigNumber.from(0)
): PayableOverrides {
  return {
    value: value,
    gasPrice: process.env.GAS_PRICE ?? 1000000000,
    gasLimit: process.env.GAS_LIMIT ?? 200000,
  };
}
