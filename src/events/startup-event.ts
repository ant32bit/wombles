export class StartupRequest {
    public memorySizeInBits: number;
    public frameSizeInBits: number;

    public initialWomble: string;

    constructor(initialWomble: string, memorySizeInBits: number, frameSizeInBits: number) {
        this.initialWomble = initialWomble;
        this.memorySizeInBits = memorySizeInBits;
        this.frameSizeInBits = frameSizeInBits;
    }
}

export class StartupResponse {
    public errors: string | null;
    public memory: Uint8Array | null;

    constructor(memory: Uint8Array | null = null, errors: string | null = null) {
        this.memory = memory;
        this.errors = errors;
    }
}
