import { WriteLog, ReadLog, Logs } from "./logs";

export class Logger {

    private readBuffers: ReadBuffer[] = [];
    private writeBuffers: WriteBuffer[] = [];

    constructor() {
        this.clearLogs();
    }

    public startSession(): void {
        this.readBuffers.push(new ReadBuffer());
        this.writeBuffers.push(new WriteBuffer());
    }

    public clearLogs(): void {
        this.readBuffers = [];
        this.writeBuffers = [];
        this.startSession();
    }

    public popLogs(): Logs {
        const logs = {
            reads: this.readBuffers.pop()?.toReadLogs() || [],
            writes: this.writeBuffers.pop()?.toWriteLogs() || []
        }

        if (this.readBuffers.length == 0) {
            this.readBuffers.unshift(new ReadBuffer());
        }

        if (this.writeBuffers.length == 0) {
            this.writeBuffers.unshift(new WriteBuffer());
        }

        return logs;
    }

    public logRead(index: number): void {
        this.readBuffers[0].log(index);
    }

    public logWrite(index: number, value: number): void {
        this.writeBuffers[0].log(index, value);
    }
}

class ReadBuffer {
    private readIndexes: number[] = [];

    public log(index: number): void {
        this.readIndexes.push(index);
    }

    public toReadLogs(): ReadLog[] {
        if (this.readIndexes.length === 0)
            return [];

        const orderedReads = [...this.readIndexes].sort();
        const readLogs: ReadLog[] = [];

        let currLog = { address: orderedReads[0], size: 1 };
        readLogs.push(currLog);

        for (let i = 1; i <= orderedReads.length; i++) {
            const prev = orderedReads[i - 1];
            const curr = orderedReads[i];
            const diff = curr - prev;

            if (diff === 0)
                continue;

            if (diff === 1) {
                currLog.size++;
                continue;
            }

            currLog = { address: curr, size: 1}
            readLogs.push(currLog);
        }

        return readLogs;
    }
}

class WriteBuffer {
    private writes: { index: number, value: number }[] = [];

    public log(index: number, value: number): void {
        this.writes.push({index, value});
    }

    public toWriteLogs(): WriteLog[] {
        if (this.writes.length === 0)
            return [];

        const dupe: {[key: string]: { index: number, value: number }} = {};
        const writes: {index: number, value: number}[] = [];
        for (let i = 0; i < this.writes.length; i++) {
            const write = this.writes[i];
            const key = write.index.toString(16);
            if (key in dupe) {
                dupe[key].value = write.value;
            }
            else {
                dupe[key] = {index: write.index, value: write.value};
                writes.push(dupe[key]);
            }
        }

        writes.sort((a,b) => a.index - b.index);

        const writeLogs: [number, number[]][] = [];
        let address: number = writes[0].index;
        let changes: number[] = []
        writeLogs.push([address, changes]);

        for (let i = 1; i <= writes.length; i++) {
            const prev = writes[i - 1];
            const curr = writes[i];
            const diff = curr.index - prev.index;

            if (diff === 1) {
                changes.push(curr.value);
                continue;
            }

            address = curr.index;
            changes = [];
            writeLogs.push([address, changes]);
        }

        return writeLogs.map(log => ({address: log[0], changes: new Uint8Array(log[1])}));
    }
}
