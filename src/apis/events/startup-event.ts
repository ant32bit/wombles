import { ChangeLog } from "./change-log";

export class StartupRequest {

    public memorySizeInBits: number;
    public frameSizeInBits: number;

    public initialWomble: string;

    constructor(initialWomble: string) {
        this.initialWomble = initialWomble;
        this.memorySizeInBits = 23;
        this.frameSizeInBits = 10;
    }
}

export class StartupResponse {
    constructor(changes: ChangeLog) {
        this.changes = changes;
    }

    public changes: ChangeLog;
}
