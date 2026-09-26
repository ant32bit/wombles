import { IProcessDefinition, Memory16bitResolver, RandomAccessMemory } from "../memory";
import { ProcessMapping, RegisterType } from "./process-mapping";
import { ISystemOperations, Process } from "./process";
import * as Decoder from "../instructions/decoder";
import { BeginInterruptInstruction } from "../instructions/instructions-set";
import { CurrentlyLoadedProcess } from "../../events";

export class CentralProcessingUnit {

    private processes: {[processKey: string]: Process};
    private memory: RandomAccessMemory;
    private triggeredInterrupts: {code: number, value: number}[] = [];

    constructor(memory: RandomAccessMemory) {
        this.memory = memory;
        this.processes = {};
    }

    public createProcess(parentProcessId: number): IProcessDefinition | null {
        const processDefinition: IProcessDefinition | null = this.memory.allocProcess(parentProcessId);
        if (processDefinition == null)
            return null;

        const authenticatedOperations: ISystemOperations = {
            create: (() => this.createProcess(processDefinition.processId)).bind(this),
            start: ((pid: number) => this.startProcess(processDefinition.processId, pid)).bind(this),
            kill: ((pid: number) => this.killProcess(pid)).bind(this),
            interrupt: ((code: number, value: number) => this.queueInterrupt(code, value)).bind(this)
        };

        const process = new Process(processDefinition, authenticatedOperations);
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

        if (process.isStarted())
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

    public queueInterrupt(interruptCode: number, interruptValue: number) {
        this.triggeredInterrupts.push({
            code: interruptCode,
            value: interruptValue
        });
    }

    public performTick() {
        const processes = Object.values(this.processes).filter(p => !p.isKilled());

        while (this.triggeredInterrupts.length > 0) {
            const interrupt = this.triggeredInterrupts.shift()!;
            if (interrupt.code < 0 || interrupt.code > 7)
                continue;

            for (const process of processes) {
                const iResolver = process.getRegisterResolver(RegisterType.Interrupt, interrupt.code);

                const interruptStart = iResolver.resolveGet(this.memory);
                if (!this.memory.isValidAddress(interruptStart))
                    continue;

                const jResolver = process.getRegisterResolver(RegisterType.JumpBack, interrupt.code);
                if (jResolver.resolveGet(this.memory) !== 0x00000000)
                    continue;

                // put the current ip into the jumpback register
                const ipResolver = process.getRegisterResolver(RegisterType.InstructionPointer);
                const currPointer = ipResolver.resolveGet(this.memory);
                jResolver.resolveSet(this.memory, currPointer);

                // set the ip as the interrupt pointer
                const newPointer = iResolver.resolveGet(this.memory);
                ipResolver.resolveSet(this.memory, newPointer);

                // set $15 to the interrupt value
                const vResolver = process.getRegisterResolver(RegisterType.Data, 15);
                const clampedValue = (interrupt.value >>> 0) & 0xFFFFFFFF;
                vResolver.resolveSet(this.memory, clampedValue);
            }
        }

        for (const process of processes) {const ipResolver = process.getRegisterResolver(RegisterType.InstructionPointer);
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

    public getProcess(processId: number): IProcessDefinition | undefined {
        return this.processes[this.generateProcessKey(processId)]?.getProcessDefinition();
    }

    public getProcesses(): CurrentlyLoadedProcess[] {
        return Object
            .values(this.processes)
            .map(p => {
                const def = p.getProcessDefinition();
                return {
                    processId: def.processId,
                    address: (def.address & 0x7FFFFFFF) >>> 0,
                    isStarted: p.isStarted()
                }
            });
    }

    public dump(): { processes: [number, number, string][], registers: [string, number[]][][], interrupts: [number, number][] } {
        const dump: { processes: [number, number, string][], registers: [string, number[]][][], interrupts: [number, number][] } = {
            processes: [],
            registers: [],
            interrupts: []
        };

        for (const process of Object.values(this.processes)) {
            dump.processes.push(process.dump());
            dump.registers.push(this.dumpRegisters(process));
        }

        dump.interrupts = this.triggeredInterrupts.map(i => [i.code, i.value]);

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
