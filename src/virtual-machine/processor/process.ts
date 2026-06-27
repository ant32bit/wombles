import { IProcessDefinition, IMemoryResolver, Memory32bitResolver, RandomAccessMemory } from "../memory";

export enum RegisterType {
    Data,
    Interrupt,
    JumpBack,
    StackPointer,
    InstructionPointer
}

export class Process {

    private static R_OFFSETS: Map<RegisterType, number> = new Map([
        [RegisterType.Data, 0],
        [RegisterType.Interrupt, 60],
        [RegisterType.JumpBack, 92],
        [RegisterType.StackPointer, 124],
        [RegisterType.InstructionPointer, 128]
    ]);

    private static INIT_IP: number = 132;

    private processId: number;
    private address: number;
    private memory: RandomAccessMemory;

    private running: boolean;
    private killed: boolean;

    constructor(memory: RandomAccessMemory, definition: IProcessDefinition) {
        this.processId = definition.processId;
        this.address = definition.address;
        this.memory = memory;
        this.running = false;
        this.killed = false;
    }

    public isStarted(): boolean { return this.running; }
    public isKilled(): boolean { return this.killed; }


    public start(): boolean {
        if (this.killed)
            return false;

        this.running = true;
            return true;
    }

    public kill(): boolean {
        if (!this.running)
            return false;

        this.running = false;
        this.killed = true;
        return true;
    }

    public getRegisterResolver(type: RegisterType, number: number = 0): IMemoryResolver {
        if (type === RegisterType.Data && number === 0)
            return new ZeroRegisterResolver();

        const baseAddress = this.address >>> 0;
        const registerOffset = Process.R_OFFSETS.get(type) || 0;
        const register = type in [RegisterType.InstructionPointer, RegisterType.StackPointer] ? 0 : number * 4;

        return new Memory32bitResolver(baseAddress + registerOffset + register);
    }
}

class ZeroRegisterResolver implements IMemoryResolver {
    resolveGet(memory: RandomAccessMemory): number { return 0; }
    resolveGetByte(memory: RandomAccessMemory, index: 0): number { return 0; }
    resolveSet(memory: RandomAccessMemory, value: number): void { return; }
}

