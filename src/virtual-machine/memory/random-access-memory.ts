import { HeapAllocation } from "./heap-allocation";
import { ProcessAllocation } from "./process-allocation";

export interface IProcessDefinition {
    processId: number;
    address: number;
}

export interface IMemoryResolver {

    resolveGet(memory: RandomAccessMemory): number;
    resolveGetByte(memory: RandomAccessMemory, index: 0): number;
    resolveSet(memory: RandomAccessMemory, value: number): void;
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
    private heaps: HeapAllocation[];
    private processes: ProcessAllocation[];

    private nextProcessId: number = 2;

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
    }

    public getFrameSizeInBytes(): number {
        return this.frameSize;
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

    public getResolver(pointer: number, size: number): IMemoryResolver {
        return new VariableMemoryResolver(pointer, size);
    }

    public allocProcess(parentPId: number): IProcessDefinition | null {
        try {
            const address = this.allocateFrame();
            const allocation = new ProcessAllocation(this.nextProcessId++, parentPId, address);

            this.processes.push(allocation);
            return {
                processId: allocation.processId,
                address: allocation.address >>> 0
            };
        }
        catch {
            return null;
        }
    }

    public transferProcess(ownerId: number, processId: number): boolean {
        const index = this.processes.findIndex(allocation => allocation.processId == processId);
        if (index < 0)
            return false;

        const process = this.processes[index];
        if (process.ownerId !== ownerId)
            return false;

        process.transfer();
        return true;
    }

    public freeProcess(processId: number): void {
        const index = this.processes.findIndex(allocation => allocation.processId == processId);
        if (index < 0) return;

        const process = this.processes[index];
        process.free();

        const unstartedChildren = this.processes
            .filter(child => child.ownerId == processId)
            .forEach(child => child.free());
    }

    public reserveHeap(ownerId: number, size: number): number | null {
        for(let i = 0; i < this.heaps.length; i++) {
            const address = this.heaps[i].reserve(ownerId, size);
            if (address != null) {
                return address;
            }
        }

        try {
            const heapFrame = this.allocateFrame();
            const heap = new HeapAllocation(heapFrame, this.frameSize);
            const address = heap.reserve(ownerId, size);
            this.heaps.push(heap);
            return address;
        }
        catch {
            return null;
        }
    }

    public freeHeap(ownerId: number, address: number): void {
        for(const heap of this.heaps) {
            if (heap.unreserve(ownerId, address))
                break;
        }
    }

    public dump(): { frames: string, processes: [number, number, number][], heaps: [number, number, number][][] } {
        const frameClusters = Array
            .from(this.frames, c => c.toString(2).padStart(32, '0'))

        const last = this.numberOfFrames % 32;
        if (last > 0)
            frameClusters[frameClusters.length - 1] = frameClusters[frameClusters.length - 1].substring(32 - last);

        const frames: string = frameClusters.join('');
        const processes = this.processes.map(p => p.dump());
        const heaps = this.heaps.map(h => h.dump());

        return { frames, processes, heaps }
    }

    private allocateFrame(collect: boolean = false): number {

        if (collect)
            this.collect();

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

        if (frameId >= this.numberOfFrames) {
            if (!collect)
                return this.allocateFrame(true);
            throw new OutOfMemoryError();
        }

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

    private collect(): void {
        const killedProcesses = this.processes.filter(allocation => allocation.ownerId === 0);
        for(const killedProcess of killedProcesses) {
            this.freeFrame(killedProcess.address);
            this.heaps.forEach(heap => heap.unreserveAll(killedProcess.processId));
        }

        this.processes = this.processes.filter(allocation => allocation.ownerId !== 0);
        const unusedHeaps = this.heaps.filter(heap => !heap.hasReservations());
        this.heaps = this.heaps.filter(heap => heap.hasReservations());
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

class VariableMemoryResolver implements IMemoryResolver {
    private baseAddress: number;
    private size: number;

    constructor(pointer: number, size: number) {
        this.baseAddress = (pointer >>> 0) & 0x7FFFFFFF;
        this.size = size;
    }

    public resolveGet(memory: RandomAccessMemory): number {
        return memory.readNumber(this.getAddress(), this.size);
    }

    public resolveGetByte(memory: RandomAccessMemory, index: 0): number {
        if (index < 0 || this.size >= index)
            throw new RangeError(`index ${index} is out of range of ${this.size} byte memory resolver`);
        return memory.readNumber(this.getAddress(index), 1);
    }

    public resolveSet(memory: RandomAccessMemory, value: number): void {
        memory.writeNumber(this.getAddress(), this.size, value);
    }

    private getAddress(offset: number = 0): number {
        return ((this.baseAddress + offset) >>> 0) | 0x80000000;
    }
}

export class Memory32bitResolver extends VariableMemoryResolver {
    constructor(pointer: number) {
        super(pointer, 4);
    }
}

export class Memory16bitResolver extends VariableMemoryResolver {
    constructor(pointer: number) {
        super(pointer, 2);
    }
}

export class Memory8bitResolver extends VariableMemoryResolver {
    constructor(pointer: number) {
        super(pointer, 1);
    }
}
