import { IEventHandler, IPostable } from '../interfaces';
import { EventManager } from './event-manager';
import { StartupRequest, StartupResponse } from '../events';
import { VirtualMachine } from '../virtual-machine/virtual-machine';
import { RandomAccessMemory } from '../virtual-machine/memory';
import { CentralProcessingUnit } from '../virtual-machine/processor';
import { compile } from '../virtual-machine/instructions/compiler';

export type VirtualMachinePointer = { instance?: VirtualMachine }

export class ConsoleAPI {

    private eventManager: EventManager;
    private virtualMachinePointer: VirtualMachinePointer;

    constructor(transmitter: IEventHandler, reciever: IPostable, vmPointer: VirtualMachinePointer) {
        this.virtualMachinePointer = vmPointer;
        this.eventManager = new EventManager(transmitter, reciever, {
            'startup': this.onStartup.bind(this),
            'start': this.onStart.bind(this),
            'pause': this.onPause.bind(this),
        });
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
        }
        catch (e) {
            error = (e as Error).message;
        }

        return new StartupResponse(memory?.export(), error);
    }

    private onStart(request: null): boolean {
        if (!this.virtualMachinePointer.instance)
            return false;

        this.virtualMachinePointer.instance.start((event => {
            this.eventManager.emit("tickCompleted", event);
        }));
        return true;
    }

    private onPause(request: null): boolean {
        if (!this.virtualMachinePointer.instance)
            return false;

        this.virtualMachinePointer.instance!.pause();
        return true;
    }
}
