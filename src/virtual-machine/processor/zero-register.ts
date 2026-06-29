import { IMemoryResolver, RandomAccessMemory } from "../memory/random-access-memory";

export class ZeroRegisterResolver implements IMemoryResolver {
    resolveGet(memory: RandomAccessMemory): number { return 0; }
    resolveGetByte(memory: RandomAccessMemory, index: 0): number { return 0; }
    resolveSet(memory: RandomAccessMemory, value: number): void { return; }
}
