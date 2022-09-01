import { TransferEvent } from "../generated/schema";
import { Transfer } from "../generated/TugaBridge/TugaBridge";

export function handleTransfer(event: Transfer): void {
    const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    const entity = new TransferEvent(id);
    entity.sender = event.params.sender;
    entity.receiver = event.params.receiver;
    entity.token = event.params.token;
    entity.amount = event.params.amount;
    entity.destinationChainId = event.params.destinationChainId.toI32();
    entity.save();
}
