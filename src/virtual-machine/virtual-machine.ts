import { CentralProcessingUnit, ProcessMapping } from './processor';
import { IProcessDefinition, RandomAccessMemory } from './memory';
import { CannotAddProcessError } from './virtual-machine-errors';
import { TickCompletedEvent, TickListener } from '../events';

const SystemProcess: number = 1;

export class VirtualMachine {

    private systemProcesses: IProcessDefinition[] = [];

    private processor: CentralProcessingUnit;
    private memory: RandomAccessMemory;
    private execution?: Promise<void>;
    private ticks: number = 0;
    private tickListener?: TickListener;

    constructor(processor: CentralProcessingUnit, memory: RandomAccessMemory) {
        this.processor = processor;
        this.memory = memory;
        this.initialised = false;
    }

    public setTickListener(callback: TickListener) {
        this.tickListener = callback;
    }

    public start(): void {
        this.run();
    }

    public async step(): Promise<void> {
        this.run(false);
        await this.kill();

        return;
    }

    public async pause(): Promise<void> {
        await this.kill();
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

    public dumpProcess(processId: number): [IProcessDefinition, Uint8Array] | undefined {
        const definition = this.processor.getProcess(processId);
        if (!definition)
            return undefined;

        const frame = this.memory.dumpFrame(definition.address);
        return [definition, frame];
    }

    /////// low level execution ///////

    private initialised: boolean = false;
    private killFlag: boolean = false;

    private init(): void {
        if (!this.initialised)
            for (const process of this.systemProcesses) {
                this.processor.startProcess(SystemProcess, process.processId);
            }
        this.initialised = true;
    }

    private run(loop: boolean = true): void {
        this.init();
        this.killFlag = !loop;

        if (this.execution)
            return;

        this.execution = new Promise<void>(
            ((resolve: () => void) => this._run(resolve)).bind(this));
    }

    private async kill() {
        if (!this.execution)
            return;

        this.killFlag = true;
        await this.execution;
        this.execution = undefined;
    }

    private _run(resolve: () => void) {
        this.memory.startNewSession();
        this.processor.performTick();
        this.ticks++;

        const tick = this.ticks;
        const processes = this.processor.getProcesses();
        const changes = this.memory.popSessionLogs();

        if (this.tickListener)
            this.tickListener(new TickCompletedEvent(tick, processes, changes));

        if (!this.killFlag)
            setTimeout((() => this._run(resolve)).bind(this), 0);
        else
            resolve();
    }
}
