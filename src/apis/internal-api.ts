import { EventManager } from './event-manager';
import { GetProcessRequest, ProcessSnapshot, StartupRequest, TickCompletedEvent } from '../events';
import { IEventHandler, IPostable } from '../interfaces';

export class InternalAPI {

    private eventManager: EventManager;


    constructor(transmitter: IEventHandler, reciever: IPostable) {
        this.eventManager = new EventManager(transmitter, reciever, {
            'get-process': undefined,
            'startup': undefined,
            'start': undefined,
            'step': undefined,
            'pause': undefined,
        });
    }

    public async startup(initialWomble: string, memorySize: number, programSize: number): Promise<Uint8Array> {
        const response = await this.eventManager.request('startup', new StartupRequest(initialWomble, memorySize, programSize));
        if (!response.memory || response.errors)
            throw new Error(response.errors || "unknown error");

        return response.memory;
    }

    public async start(): Promise<void> {
        const response = await this.eventManager.request('start', null);
    }

    public async step(): Promise<void> {
        const response = await this.eventManager.request('step', null);
    }

    public async pause(): Promise<void> {
        const response = await this.eventManager.request('pause', null);
    }

    public async addTickListener(callback: (event: TickCompletedEvent) => void) {
        this.eventManager.subscribe("tickCompleted", callback);
    }

    public async getProcessSnapshot(processId: number): Promise<ProcessSnapshot> {
        const response = await this.eventManager.request('get-process', new GetProcessRequest(processId));
        if (response.processSnapshot == undefined)
            throw new Error (`could not find process ${processId}`);

        return response.processSnapshot;
    }
}
