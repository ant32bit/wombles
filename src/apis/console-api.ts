import { IEventHandler, IPostable } from '../interfaces';
import { EventManager } from './event-manager';
import { GetProcessRequest, GetProcessResponse, StartupRequest, StartupResponse, ProcessSnapshotLineOfCode } from '../events';
import { VirtualMachine } from '../virtual-machine/virtual-machine';
import { RandomAccessMemory } from '../virtual-machine/memory';
import { CentralProcessingUnit, ProcessMapping } from '../virtual-machine/processor';
import { compile, decompile } from '../virtual-machine/instructions/compiler';

export type VirtualMachinePointer = { instance?: VirtualMachine }

export class ConsoleAPI {

    private eventManager: EventManager;
    private virtualMachinePointer: VirtualMachinePointer;

    constructor(transmitter: IEventHandler, reciever: IPostable, vmPointer: VirtualMachinePointer) {
        this.virtualMachinePointer = vmPointer;
        this.eventManager = new EventManager(transmitter, reciever, {
            'get-process': this.onGetProcess.bind(this),
            'startup': this.onStartup.bind(this),
            'start': this.onStart.bind(this),
            'step': this.onStep.bind(this),
            'pause': this.onPause.bind(this),
        });
    }

    private onGetProcess(request: GetProcessRequest): GetProcessResponse {
        if (!this.virtualMachinePointer.instance)
            return GetProcessResponse.ProcessNotFound;

        const [def, frame] = this.virtualMachinePointer.instance.dumpProcess(request.processId) || [];
        if (!def || !frame)
            return GetProcessResponse.ProcessNotFound;

        const pack: (index: number, size: number) => number = (index, size) => {
            let output: number = 0;

            for (let offset = 0; offset < size; offset++) {
                output = (output << 8) + frame[index + offset];
            }

            return output >>> 0;
        };

        const registers: number[] = [];
        for (let offset = 0; offset < ProcessMapping.INSTRUCTIONS_OFFSET; offset += 4) {
            registers.push(pack(offset, 4));
        }

        const stack: number[] = [];
        let stackOffset: number | undefined = registers[registers.length - 1] - def.address;
        if (stackOffset >= 0 && stackOffset < frame.length)
            for (let offset = stackOffset; offset < frame.length; offset += 4)
                stack.push(pack(offset, 4));
        else
            stackOffset = undefined;


        const currLine: number = ((registers[registers.length - 2] - def.address - ProcessMapping.INSTRUCTIONS_OFFSET) >>> 1) + 1;

        let code: { currLine: number, lines: ProcessSnapshotLineOfCode[] } = { currLine, lines: [] };

        const codeStart = ProcessMapping.INSTRUCTIONS_OFFSET;
        const codeEnd = (stackOffset ?? frame.length);

        const instructions: number[] = [];
        for (let offset = codeStart; offset < codeEnd; offset += 2) {
            instructions.push(pack(offset, 2));
        }
        const decompiled = decompile(instructions);

        for (const line of decompiled) {
            code.lines.push({
                lineNumber: line.lineNumber,
                value: line.value,
                blocks: splitDecodedLine(line.instruction.decode()),
                description: line.instruction.description()
            });
        }

        return new GetProcessResponse({ processId: request.processId, code, registers, stack });
    }

    private onStartup(request: StartupRequest): StartupResponse {
        let memory: RandomAccessMemory | null = null;
        let error: string | null = null;
        try {
            memory = new RandomAccessMemory(request.memorySizeInBits - request.frameSizeInBits, request.frameSizeInBits);
            const processor = new CentralProcessingUnit(memory);
            const vm = new VirtualMachine(processor, memory);

            const program = compile(request.initialWomble);
            vm.addProgram(program);

            this.virtualMachinePointer.instance = vm;
            this.virtualMachinePointer.instance.setTickListener(event => {
                this.eventManager.emit("tickCompleted", event);
            });
        }
        catch (e) {
            error = (e as Error).message;
        }

        return new StartupResponse(memory?.export(), error);
    }

    private onStart(request: null): boolean {
        if (!this.virtualMachinePointer.instance)
            return false;

        this.virtualMachinePointer.instance.start();
        return true;
    }

    private async onStep(request: null): Promise<boolean> {
        if (!this.virtualMachinePointer.instance)
            return false;

        await this.virtualMachinePointer.instance.step();
        return true;
    }

    private async onPause(request: null): Promise<boolean> {
        if (!this.virtualMachinePointer.instance)
            return false;

        await this.virtualMachinePointer.instance!.pause();
        return true;
    }
}

function splitDecodedLine(line: string): { type: string, value: string }[] {
    const values: { type: string, value: string }[] = [];

    values.push({ type: 'i', value: line.substring(0,3) });

    if (line.length === 3)
        return values;

    let curr: { type: string, value: string } = { type: 's', value: ' ' };
    const chars = line.substring(4).split('');
    const numbers = '0123456789'.split('');

    for (const char of chars) {
        const type = char in numbers ? 'v' : 's';
        if (type !== curr.type) {
            values.push(curr);
            curr = { type, value: '' }
        }
        curr.value += char;
    }

    values.push(curr);
    return values;
}
