import { IMemoryResolver, RandomAccessMemory } from "../memory/random-access-memory";

export class ZeroRegisterResolver implements IMemoryResolver {
    resolveGet(memory: RandomAccessMemory): number { return 0; }
    resolveGetSigned(memory: RandomAccessMemory): number { return 0; }
    resolveGetByte(memory: RandomAccessMemory, index: number): number { return 0; }
    resolveSet(memory: RandomAccessMemory, value: number): void { return; }
    resolveSetByte(memory: RandomAccessMemory, index: number, value: number): void { return; }
}
