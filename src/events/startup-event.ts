export class StartupRequest {
    public memorySizeInBits: number;
    public frameSizeInBits: number;

    public processLifetime: number;
    public cpmMutationRate: number;
    public impMissRate: number;

    public initialWomble: string;

    constructor(initialWomble: string, memorySizeInBits: number, frameSizeInBits: number, processLifetime: number, cpmMutationRate: number, impMissRate: number) {
        this.initialWomble = initialWomble;
        this.memorySizeInBits = memorySizeInBits;
        this.frameSizeInBits = frameSizeInBits;
        this.processLifetime = processLifetime;
        this.cpmMutationRate = cpmMutationRate;
        this.impMissRate = impMissRate;
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
