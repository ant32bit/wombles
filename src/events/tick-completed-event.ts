import { Logs } from '../virtual-machine/memory/logs';

export class TickCompletedEvent {

    public changes: Logs;

    constructor(changes: Logs) {
        this.changes = changes;
    }
}
