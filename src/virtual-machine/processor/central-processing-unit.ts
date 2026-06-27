import { Memory16bitResolver, RandomAccessMemory } from "../memory";
import { Process, RegisterType } from "./process";
import * as Decoder from "../instructions/decoder";

export class CentralProcessingUnit {

    private processes: {[pid: string]: Process};
    private memory: RandomAccessMemory;

    constructor(memory: RandomAccessMemory) {
        this.memory = memory;
        this.processes = {};
    }

    public performTick() {
        for (const process of Object.values(this.processes)) {
            if (process.isKilled())
                continue;

            const ipResolver = process.getRegisterResolver(RegisterType.InstructionPointer);
            const instructionAddress = ipResolver.resolveGet(this.memory) >>> 0;
            const instructionResolver = new Memory16bitResolver(instructionAddress);
            const instructionRaw = instructionResolver.resolveGet(this.memory);
            const instruction = Decoder.decode(instructionRaw);
            if (instruction != undefined) {
                instruction.evaluate(this.memory, process);
            }
            const newInstructionAddress = ipResolver.resolveGet(this.memory) >>> 0;
            if (instructionAddress === newInstructionAddress)
                ipResolver.resolveSet(this.memory, instructionAddress + 2);
        }
    }

}
