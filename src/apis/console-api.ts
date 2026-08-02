import { IEventHandler, IPostable } from './interfaces';
import { EventManager } from './event-manager';
import { StartupRequest, StartupResponse } from './events';

export class ConsoleAPI {

    private eventManager: EventManager;

    constructor(transmitter: IEventHandler, reciever: IPostable) {
        this.eventManager = new EventManager(transmitter, reciever, {
            'startup': this.onStartup.bind(this)
        });
    }

    private onStartup(request: StartupRequest): StartupResponse {
        return { changes: [] };
    }
}
