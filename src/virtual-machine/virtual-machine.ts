import { CentralProcessingUnit, ProcessMapping } from './processor';
import { IProcessDefinition, RandomAccessMemory } from './memory';
import { CannotAddProcessError } from './virtual-machine-errors';

const SystemProcess: number = 1;

enum VMState {
    Stopped,
    Paused,
    Running,
}

export class VirtualMachine {

    private systemProcesses: IProcessDefinition[] = [];

    private processor: CentralProcessingUnit;
    private memory: RandomAccessMemory;
    private state: VMState = VMState.Stopped;
    private ticks: number = 0;

    constructor(processor: CentralProcessingUnit, memory: RandomAccessMemory) {
        this.processor = processor;
        this.memory = memory;
    }

    public start() {
        if (this.state === VMState.Running)
            return;

        if (this.state === VMState.Stopped) {
            for (const process of this.systemProcesses) {
                this.processor.startProcess(SystemProcess, process.processId);
            }
        }

        setTimeout(this.run, 0);
    }

    public pause() {
        if (this.state === VMState.Running)
            this.state = VMState.Paused;

        return;
    }

    public stop() {
        this.state = VMState.Stopped;
    }

    public addProgram(instructions: number[]) {
        var process = this.processor.createProcess(SystemProcess);
        if(process == null)
            throw new CannotAddProcessError();

        this.systemProcesses.push(process);

        let address = process.address + ProcessMapping.INSTRUCTIONS_OFFSET;
        for (const instruction of instructions) {
            this.memory.writeNumber(address, 2, instruction);
            address += 2;
        }
    }

    private run() {
        if (this.state != VMState.Running)
            return;

        this.processor.performTick();
        this.ticks++;
        setTimeout(this.report, 0);
    }

    private report() {
        setTimeout(this.run);
    }
}
