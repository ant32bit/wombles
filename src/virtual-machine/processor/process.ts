import { IProcessDefinition, IMemoryResolver, Memory32bitResolver } from "../memory";
import { ZeroRegisterResolver } from "./zero-register";
import { ProcessMapping, RegisterType } from "./process-mapping";

export class Process {

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
        const registersOffset = ProcessMapping.REGISTERS_OFFSETS.get(type)! || 0;
        const memoryOffset =
            (type === RegisterType.InstructionPointer || type === RegisterType.StackPointer ? 0 : ((number - (type === RegisterType.Data ? 1 : 0)) * 4));

        return new Memory32bitResolver(baseAddress + registersOffset + memoryOffset);
    }

    public dump(): [number, number, string] {
        return [this.processId, this.address >>> 0, (this.running ? 'r' : '_') + (this.killed ? 'k' : '_')]
    }
}
