import { Logs } from '../virtual-machine/memory/logs';

export type TickListener = (event: TickCompletedEvent) => void;

export class TickCompletedEvent {

    public tick: number;
    public programs: number;
    public changes: Logs;

    constructor(tick: number, programs: number, changes: Logs) {
        this.tick = tick;
        this.programs = programs;
        this.changes = changes;
    }
}
