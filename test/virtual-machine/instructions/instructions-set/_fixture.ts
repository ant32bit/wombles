import { IInstruction } from "../../../../src/virtual-machine/instructions";
import { IProcessDefinition, RandomAccessMemory } from "../../../../src/virtual-machine/memory";
import { CentralProcessingUnit, ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor";

export class VirtualMachineFixture {

    public memory: RandomAccessMemory;
    public cpu: CentralProcessingUnit;
    public process: IProcessDefinition;

    private instructionOffset: number = 0;

    constructor() {
        this.memory = new RandomAccessMemory(2, 8);
        this.cpu = new CentralProcessingUnit(this.memory, { processLifetime: 10, cpmMutationRate: 0, impMissRate: 0 });
        this.process = this.cpu.createProcess(1)!;
    }

    public setInstruction(instruction: IInstruction) {
        const address = (this.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + this.instructionOffset;
        const value = instruction.encode();
        this.memory.writeNumber(address, 2, value);
        this.instructionOffset += 2;
    }

    public setRegister(type: RegisterType, number: number, value: number) {
        const address = this.getRegisterAddress(type, number);
        this.memory.writeNumber(address, 4, value >>> 0);
    }

    public getRegister(type: RegisterType, number: number = 0): number {
        const address = this.getRegisterAddress(type, number);
        return this.memory.readNumber(address, 4) >>> 0;
    }

    public startProcess(): void {
        this.cpu.startProcess(1, 2);
    }

    public run() {
        this.startProcess();
        this.cpu.performTick();
    }

    private getRegisterAddress(type: RegisterType, number: number): number {
        const baseAddress = this.process.address >>> 0;
        const registersOffset = ProcessMapping.REGISTERS_OFFSETS.get(type)!;
        const memoryOffset =
            (type === RegisterType.InstructionPointer || type === RegisterType.StackPointer ? 0 : ((number - (type === RegisterType.Data ? 1 : 0)) * 4));
        const address = baseAddress + registersOffset + memoryOffset;
        return address >>> 0;
    }
}


