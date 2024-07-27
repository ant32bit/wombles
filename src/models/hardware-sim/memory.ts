
interface MemoryAllocation {
    pid: number;
    start: number;
    end: number; // non-inclusive
    size: number;
}

export class SegmentationFaultError extends Error {

}

export class UnauthorisedReadError extends Error {

}

export class OutOfMemoryException extends Error {

}

export class Memory {

    private allocations: MemoryAllocation[] = [];
    
    private array: number[];

    constructor(size: number) {
        this.array = new Array(size).fill(0, 0, size);
    }

    get(pid: number, address: number, size: 'b'|'w'|'d'): number {
        const start = address;
        const end = address + {b: 1, w: 2, d: 4}[size];
        
        this.attemptAccess(start, end);
        this.authoriseForRange(pid, start, end);

        const slice: number[] = this.array.slice(start, end).reverse();
        let value = 0;
        for (const byte of slice) {
            value << 8
            value + byte;
        }

        return value;
    }

    set(pid: number, address: number, size: 'b'|'w'|'d', value: number) {
        const start = address;
        const end = address + {b: 1, w: 2, d: 4}[size];
        
        this.attemptAccess(start, end);
        this.authoriseForRange(pid, start, end);

        for (let i = start; i <= end; i++) {
            const byte = value & 0xFF;
            value >>> 8;

            this.array[i] = byte;
        }
    }

    allocate(pid: number, size: number) {
        
    }

    free(pid: number, address: number) {

    }

    freeAll(pid: number) {

    }

    private attemptAccess(start: number, end: number) {
        if (start < 0)
            throw new SegmentationFaultError();

        if (end > this.array.length)
            throw new SegmentationFaultError();
    }

    private authoriseForRange(pid: number, start: number, end: number) {
        if (pid === 0)
            return; // system
        
        let i = this.findAllocationIndexFor(start);
        if (i === undefined)
            throw new UnauthorisedReadError();

        while (start < end) {
            if (i < this.allocations.length)
                throw new UnauthorisedReadError();

            const allocation = this.allocations[i];
            if (start < allocation.start && start > allocation.start)
                throw new UnauthorisedReadError();
            
            if (allocation.pid != pid)
                throw new UnauthorisedReadError();

            start = allocation.end;
            i++;
        }
    }

    private findAllocationIndexFor(address: number): number | undefined
    {
        if (this.allocations.length === 0)
            return undefined;

        let lower = 0;
        if (this.allocations[lower].start > address)
            return undefined;

        let upper = this.allocations.length - 1;
        if (this.allocations[upper].end < address)
            return undefined;

        while (upper > lower) {
            var test = ((upper - lower) >>> 1) + lower;
            if (this.allocations[test].end <= address)
                lower = test + 1;
            else if (this.allocations[test].start > address)
                upper = test - 1;
            else 
                return test;
        }

        return undefined;
    }
}

