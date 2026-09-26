import { Logs } from '../virtual-machine/memory/logs';

export type TickListener = (event: TickCompletedEvent) => void;
export type CurrentlyLoadedProcess = { processId: number, address: number, isStarted: boolean };

export class TickCompletedEvent {

    public tick: number;
    public processes: CurrentlyLoadedProcess[];
    public changes: Logs;

    constructor(tick: number, programs: CurrentlyLoadedProcess[], changes: Logs) {
        this.tick = tick;
        this.processes = programs;
        this.changes = changes;
    }
}

