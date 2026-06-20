export class ProcessAllocation {

    public processId: number;
    public parentPId: number;
    public address: number;
    public running: boolean;
    public killed: boolean;

    constructor(processId: number, parentPId: number, address: number) {
        this.processId = processId;
        this.parentPId = parentPId;
        this.address = address;
        this.running = false;
        this.killed = false;
    }

    public start(ownerId: number): void {
        if (this.parentPId != ownerId) return;
        if (this.killed) return;

        this.running = true;
    }

    public kill(force: boolean = false): void {
        if (!force && !this.running) return;

        this.running = false;
        this.killed = true;
    }

    public dump(): [number, string] {
        return [
            this.processId,
            this.killed ? 'killed' : this.running ? 'running' : 'init'
        ];
    }
}
