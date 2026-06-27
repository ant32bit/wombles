export class ProcessAllocation {

    public ownerId: number;
    public processId: number;
    public address: number;

    constructor(processId: number, ownerId: number, address: number) {
        this.ownerId = ownerId;
        this.processId = processId;
        this.address = address;
    }

    public transfer(): void {
        this.ownerId = this.processId;
    }

    public free(): void {
        this.ownerId = 0;
    }

    public dump(): [number, number, number] {
        return [
            this.processId,
            this.ownerId,
            this.address >>> 0
        ];
    }
}
