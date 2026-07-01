import { IInstruction } from "../../../../src/virtual-machine/instructions";
import { IProcessDefinition, RandomAccessMemory } from "../../../../src/virtual-machine/memory";
import { CentralProcessingUnit, ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor";

export class VirtualMachineFixture {

    public memory: RandomAccessMemory;
    public cpu: CentralProcessingUnit;
    public process: IProcessDefinition;

    constructor() {
        this.memory = new RandomAccessMemory(2, 8);
        this.cpu = new CentralProcessingUnit(this.memory);
        this.process = this.cpu.createProcess(1)!;
    }

    public setInstruction(instruction: IInstruction) {
        const address = (this.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET;
        const value = instruction.encode();
        this.memory.writeNumber(address, 2, value);
    }

    public setRegister(type: RegisterType, number: number, value: number) {
        const baseAddress = this.process.address >>> 0;
        const registersOffset = ProcessMapping.REGISTERS_OFFSETS.get(type)!;
        const memoryOffset =
            (type === RegisterType.InstructionPointer || type === RegisterType.StackPointer ? 0 : ((number - (type === RegisterType.Data ? 1 : 0)) * 4));
        const address = baseAddress + registersOffset + memoryOffset;
        this.memory.writeNumber(address, 4, value >>> 0);
    }

    public run() {
        this.cpu.startProcess(1, 2);
        this.cpu.performTick();
    }
}


