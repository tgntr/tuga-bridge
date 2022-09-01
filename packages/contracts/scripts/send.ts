import { signERC2612Permit } from "eth-permit";
import { ethers } from "hardhat";
import { TG_COIN_GOERLI, FEE } from "../common/constants";
import { getTxOptions } from "../common/utils";
import { Bridge__factory } from "../typechain-types";

const BRIDGE_GOERLI = "0x140e1ac1f07dfdd30fc584d67d6ceec19c1ac9fa";

async function main() {
    const [alice] = await ethers.getSigners();
    const permit = await signERC2612Permit(
        alice.provider,
        TG_COIN_GOERLI,
        alice.address,
        BRIDGE_GOERLI,
        FEE.toNumber()
    );
    const signature = await alice.signMessage(
        ethers.utils.arrayify(
            ethers.utils.solidityKeccak256(
                [
                    "address",
                    "address",
                    "address",
                    "uint256",
                    "uint32",
                    "uint32",
                    "uint8",
                    "bytes32",
                    "bytes32",
                ],
                [
                    alice.address,
                    alice.address,
                    TG_COIN_GOERLI,
                    FEE.toString(),
                    5,
                    3,
                    permit.v,
                    permit.r,
                    permit.s,
                ]
            )
        )
    );

    const bridgeFactory = new Bridge__factory(alice);
    console.log(
        await bridgeFactory
            .attach(BRIDGE_GOERLI)
            .sendERC20(
                alice.address,
                TG_COIN_GOERLI,
                FEE,
                3,
                signature,
                permit.deadline,
                permit.v,
                permit.r,
                permit.s,
                getTxOptions(FEE)
            )
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
