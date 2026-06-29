import { IProcessDefinition, IMemoryResolver, Memory32bitResolver } from "../memory";
import { ZeroRegisterResolver } from "./zero-register"

export enum RegisterType {
    Data,
    Interrupt,
    JumpBack,
    StackPointer,
    InstructionPointer
}

export class Process {

    public static INSTRUCTIONS_OFFSET: number = 132;

    public static REGISTERS_OFFSETS: Map<RegisterType, number> = new Map([
        [RegisterType.Data, 0],
        [RegisterType.Interrupt, 60],
        [RegisterType.JumpBack, 92],
        [RegisterType.InstructionPointer, 124],
        [RegisterType.StackPointer, 128]
    ]);

    private processId: number;
    private address: number;

    private running: boolean;
    private killed: boolean;

    constructor(definition: IProcessDefinition) {
        this.processId = definition.processId;
        this.address = definition.address;
        this.running = false;
        this.killed = false;
    }

    public getProcessDefinition(): IProcessDefinition {
        return {
            processId: this.processId,
            address: this.address
        };
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
        const registersOffset = Process.REGISTERS_OFFSETS.get(type)! || 0;
        const memoryOffset =
            (type === RegisterType.InstructionPointer || type === RegisterType.StackPointer ? 0 : ((number - (type === RegisterType.Data ? 1 : 0)) * 4));

        return new Memory32bitResolver(baseAddress + registersOffset + memoryOffset);
    }

    public dump(): [number, number, string] {
        return [this.processId, this.address >>> 0, (this.running ? 'r' : '_') + (this.killed ? 'k' : '_')]
    }
}
