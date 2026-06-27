import { RandomAccessMemory } from "../memory/random-access-memory";
import { Process } from "../processor/process";

export interface IInstruction {
    decode(): string;
    encode(): number;
    evaluate(memory: RandomAccessMemory, process: Process): void;
}
