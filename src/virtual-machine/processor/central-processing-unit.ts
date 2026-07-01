import { IProcessDefinition, Memory16bitResolver, RandomAccessMemory } from "../memory";
import { ProcessMapping, RegisterType } from "./process-mapping";
import { Process } from "./process";
import * as Decoder from "../instructions/decoder";
import { BeginInterruptInstruction } from "../instructions/instructions-set";

export class CentralProcessingUnit {

    private processes: {[processKey: string]: Process};
    private memory: RandomAccessMemory;

    constructor(memory: RandomAccessMemory) {
        this.memory = memory;
        this.processes = {};
    }

    public createProcess(parentProcessId: number): IProcessDefinition | null {
        const processDefinition: IProcessDefinition | null = this.memory.allocProcess(parentProcessId);
        if (processDefinition == null)
            return null;

        const process = new Process(processDefinition);
        const ipResolver = process.getRegisterResolver(RegisterType.InstructionPointer);
        const spResolver = process.getRegisterResolver(RegisterType.StackPointer);

        ipResolver.resolveSet(this.memory, processDefinition.address + ProcessMapping.INSTRUCTIONS_OFFSET);
        spResolver.resolveSet(this.memory, processDefinition.address + this.memory.getFrameSizeInBytes());

        this.processes[this.generateProcessKey(processDefinition.processId)] = process;

        return {
            processId: processDefinition.processId,
            address: processDefinition.address
        };
    }

    public startProcess(parentProcessId: number, processId: number) {
        const process = this.processes[this.generateProcessKey(processId)];

        if (process == null)
            return;

        if (!this.memory.transferProcess(parentProcessId, processId))
            return;

        const processDefinition = process.getProcessDefinition();

        const instructionsPointer = (processDefinition.address + ProcessMapping.INSTRUCTIONS_OFFSET) >>> 0;
        const instructionsEnd = (processDefinition.address + this.memory.getFrameSizeInBytes()) >>> 0;

        // read interrupts
        const interruptPointers = (new Array(8)).fill(0);
        for (let ip = instructionsPointer; ip < instructionsEnd; ip = (ip >>> 0) + 2) {
            const instructionResolver = new Memory16bitResolver(ip);
            const instructionRaw = instructionResolver.resolveGet(this.memory);
            const instruction = Decoder.decode(instructionRaw);
            if (instruction != undefined && instruction instanceof BeginInterruptInstruction) {
                const interruptCode = (instruction as BeginInterruptInstruction).getInterruptCode();
                interruptPointers[interruptCode] = ip + 2;
            }
        }

        for (const i of [0,1,2,3,4,5,6,7]) {
            const iResolver = process.getRegisterResolver(RegisterType.Interrupt, i);
            iResolver.resolveSet(this.memory, interruptPointers[i]);

            const jResolver = process.getRegisterResolver(RegisterType.JumpBack, i);
            jResolver.resolveSet(this.memory, 0);
        }

        process.start();
    }

    public killProcess(processId: number) {
        this.memory.freeProcess(processId);

        const processKey = this.generateProcessKey(processId);
        const process = this.processes[processKey];

        if (process == null)
            return;

        process.kill();
        delete this.processes[processKey];
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

    public dump(): { processes: [number, number, string][], registers: [string, number[]][][] } {
        const dump: { processes: [number, number, string][], registers: [string, number[]][][] } = {
            processes: [],
            registers: []
        };

        for (const process of Object.values(this.processes)) {
            dump.processes.push(process.dump());
            dump.registers.push(this.dumpRegisters(process));
        }

        return dump;
    }

    private generateProcessKey(processId: number): string {
        return (processId >>> 0).toString(16).padStart(8, '0');
    }

    private dumpRegisters(process: Process): [string, number[]][] {
        const def = process.getProcessDefinition();

        const dump: [string, number[]][] = [['R', []]];

        for (let offset = 0; offset < ProcessMapping.INSTRUCTIONS_OFFSET; offset += 4) {
            let i = dump.length - 1;
            if (DUMP_REGISTERS[i][1] <= offset) {
                dump.push([DUMP_REGISTERS[++i][0], []]);
            }
            const value = this.memory.readNumber(def.address + offset, 4) >>> 0;
            dump[i][1].push(value);
        }

        return dump;
    }
}

const DUMP_REGISTERS: [string, number][] = (() => {
    const base: [RegisterType, string][] = [
        [RegisterType.Data, 'R'],
        [RegisterType.Interrupt, 'I'],
        [RegisterType.JumpBack, 'J'],
        [RegisterType.InstructionPointer, 'IP'],
        [RegisterType.StackPointer, 'SP']
    ];

    const r: [string, number][] = new Array<[string, number]>(base.length);

    for (let i = 0; i < r.length; i++) {
        const title = base[i][1];
        let end = (i + 1 >= r.length) ? ProcessMapping.INSTRUCTIONS_OFFSET : ProcessMapping.REGISTERS_OFFSETS.get(base[i + 1][0]) ?? 0;
        r[i] = [title, end];
    }

    return r;
})();
