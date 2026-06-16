export interface IProcessDefinition {
    processId: number;
    address: number;
}

export class RandomAccessMemory {

    private frameSize: number;
    private numberOfFrames: number;
    private memoryArray: Uint8Array;

    private frameMask: number;
    private addressMask: number;

    private frameIndexBits: number;
    private memoryIndexBits: number;

    private frames: Uint32Array;
    private heaps: Heap[];
    private processes: IProcessAllocation[];
    private nextProcessId;

    constructor(memoryIndexBits: number, frameIndexBits: number) {
        if (memoryIndexBits + frameIndexBits > 31) {
            throw new RangeError('Memory must be able to fit in 31 bits (2Gb addressable space)')
        }

        this.frameIndexBits = frameIndexBits;
        this.memoryIndexBits = memoryIndexBits;

        this.frameSize = 1 << frameIndexBits;
        this.numberOfFrames = 1 << memoryIndexBits;
        this.memoryArray = new Uint8Array(this.frameSize * this.numberOfFrames);

        this.addressMask = (1 << (memoryIndexBits + frameIndexBits)) - 1;
        this.frameMask = ((1 << memoryIndexBits) - 1) << frameIndexBits;

        const smallestFrameClusterSize = this.numberOfFrames % 32;
        const numberOfFullClusters = (this.numberOfFrames - smallestFrameClusterSize) / 32;
        const numberOfFrameClusters = numberOfFullClusters + (smallestFrameClusterSize == 0 ? 0 : 1)

        this.frames = new Uint32Array(numberOfFrameClusters);
        this.frames.fill(0xFFFFFFFF >>> 0);

        if (numberOfFrameClusters > 0)
            this.frames[numberOfFullClusters] = (1 << smallestFrameClusterSize) - 1;

        this.heaps = [];
        this.processes = [];
        this.nextProcessId = 2;
    }

    public readNumber(pointer: number, size: number): number {
        const bytes: number[] = [];

        for (let offset = 0; offset < size; offset++) {
            const address = this.validAddress(pointer, offset);
            if (address < 0)
                break;
            bytes.push(this.memoryArray[address]);
        }

        let output: number = 0;
        for (const byte of bytes) {
            output = (output << 8) + byte;
        }

        return output >>> 0;
    }

    public writeNumber(pointer: number, size: number, value: number): void {
        for (let offset = 0; offset < size; offset++) {
            const address = this.validAddress(pointer, offset);
            if (address < 0)
                break;
            const byte = (value >>> ((size - 1 - offset) << 3)) & 0x000000FF;
            this.memoryArray[address] = byte;
        }
    }

    public createProcess(parentPId: number): IProcessDefinition | null {
        try {
            const address = this.allocateFrame();
            const allocation = {
                parentPId,
                address,

                processId: this.nextProcessId++,

                running: false,
                killed: false,
            };

            this.processes.push(allocation);
            return {
                processId: allocation.processId,
                address: allocation.address
            };
        }
        catch {
            return null;
        }
    }

    public startProcess(ownerId: number, processId: number): void {
        const index = this.processes.findIndex(allocation => allocation.processId == processId);
        if (index < 0) return;

        const allocation = this.processes[index];

        if (allocation.parentPId != ownerId) return;
        if (allocation.killed) return;

        allocation.running = true;
    }

    public killProcess(processId: number): void {
        const index = this.processes.findIndex(allocation => allocation.processId == processId);
        if (index < 0) return;

        const allocation = this.processes[index];

        if (!allocation.running) return;

        allocation.running = false;
        allocation.killed = true;

        const unstartedChildren = this.processes
            .filter(child => child.parentPId == processId && child.running == false)
            .forEach(child => child.killed = true);
    }

    public getRunningProcesses(): IProcessDefinition[] {
        return this.processes
            .filter(p => p.running)
            .map(p => ({
                address: p.address,
                processId: p.processId
            }));
    }

    private allocateFrame(): number {
        let frameClusterId: number = 0;
        let availableFrameId: number = 0;

        while (frameClusterId < this.frames.length) {
            if (this.frames[frameClusterId] != 0) {
                availableFrameId = 31 - Math.clz32(this.frames[frameClusterId]);
                break;
            }
            frameClusterId++;
        }

        const frameId = frameClusterId * 32 + availableFrameId;

        if (frameId >= this.numberOfFrames)
            throw new OutOfMemoryError();

        this.frames[frameClusterId] &= ~(1 << availableFrameId) >>> 0;
        const address = 0x80000000 | (frameId << this.frameIndexBits);

        return address;
    }

    private freeFrame(pointer: number): void {
        var address = this.validAddress(pointer, 0);
        if (address < 0)
            return;

        var frameId = (address & this.frameMask) >>> this.frameIndexBits;
        var unavailableFrameId = frameId % 32;
        var frameClusterId = (frameId - unavailableFrameId) / 32;

        var unallocateMask = (1 << unavailableFrameId) >>> 0;
        this.frames[frameClusterId] |= unallocateMask;
    }

    public dump(): { frames: string, processes: [number, string][], heaps: [number, [number, number], boolean][][] } {
        const frameClusters = Array
            .from(this.frames, c => c.toString(2).padStart(32, '0'))

        const last = this.numberOfFrames % 32;
        if (last > 0)
            frameClusters[frameClusters.length - 1] = frameClusters[frameClusters.length - 1].substring(last);

        const frames: string = frameClusters.join('');

        const processes: [number, string][] = this.processes.map(p => [
            p.processId,
            p.killed ? 'killed' : p.running ? 'running' : 'init']);

        const heaps: [number, [number, number], boolean][][] = this.heaps.map(h => h.reservations.map(r => [
            r.ownerId,
            [r.bounds[0], r.bounds[1]],
            r.freed]));

        return { frames, processes, heaps }
    }

    private collect(): void {
        const killedProcesses = this.processes.filter(allocation => allocation.killed);
        for(const killedProcess of killedProcesses) {
            this.freeFrame(killedProcess.address);
            this.heaps.forEach(heap => heap.freeByProcess(killedProcess.processId));
        }

        this.processes = this.processes.filter(allocation => !allocation.killed);
        this.heaps.forEach(heap => heap.collect());

        const unusedHeaps = this.heaps.filter(heap => heap.reservations.length == 0);
        this.heaps = this.heaps.filter(heap => heap.reservations.length > 0);

        unusedHeaps.forEach(heap => this.freeFrame(heap.address));
    }

    private validAddress(inputAddress: number, offset: number): number {
        var validationBit = (inputAddress >>> 31) & 0x00000001;
        if (validationBit > 0) {
            var address = (inputAddress & this.addressMask) + offset;
            if (address >= 0 && address < this.memoryArray.length)
                return address;
        }

        return -1;
    }
}

class OutOfMemoryError extends Error {
    constructor() { super("out of memory"); }
}

class Heap {

    public address: number;
    public reservations: { ownerId: number, bounds: [number, number], freed: boolean }[];

    constructor(address: number) {
        this.address = address;
        this.reservations = [];
    }

    public freeByProcess(processId: number): void {
        this.reservations
            .filter(reservation => reservation.ownerId == processId)
            .forEach(reservation => reservation.freed = true);
    }

    public collect(): void {
        this.reservations = this.reservations.filter(reservation => !reservation.freed);
    }
}

interface IProcessAllocation {

    processId: number;
    parentPId: number;
    running: boolean;
    killed: boolean;
    address: number;
}
