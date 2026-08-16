import { EventManager } from './event-manager';
import { StartupRequest, TickCompletedEvent } from '../events';
import { IEventHandler, IPostable } from '../interfaces';

export class InternalAPI {

    private eventManager: EventManager;


    constructor(transmitter: IEventHandler, reciever: IPostable) {
        this.eventManager = new EventManager(transmitter, reciever, {
            'startup': undefined
        });
    }

    public async startup(initialWomble: string, memorySize: number, programSize: number): Promise<Uint8Array> {
        const response = await this.eventManager.request('startup', new StartupRequest(initialWomble, memorySize, programSize));
        if (response.memory == null)
            throw new Error(response.errors || "unknown error");

        return response.memory;
    }

    public async addTickListener(callback: (event: TickCompletedEvent) => void) {
        this.eventManager.subscribe("tickCompleted", callback);
    }
}
