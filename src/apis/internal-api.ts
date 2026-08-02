import { EventManager } from './event-manager';
import { StartupRequest } from './events';
import { IEventHandler, IPostable } from './interfaces';

export class InternalAPI {

    private eventManager: EventManager;

    constructor(transmitter: IEventHandler, reciever: IPostable) {
        this.eventManager = new EventManager(transmitter, reciever, {
            'startup': undefined
        });
    }

    public async startup(initialWomble: string): Promise<void> {
        const response = await this.eventManager.request('startup', new StartupRequest(initialWomble));
    }
}
