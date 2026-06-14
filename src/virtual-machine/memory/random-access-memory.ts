export class RandomAccessMemory {

    private chunkSize: number;
    private numberOfChunks: number;
    private memoryArray: Uint8Array;
    private addressMask: number;

    constructor(memoryIndexBits: number, chunkIndexBits: number) {
        if (memoryIndexBits + chunkIndexBits > 31) {
            throw new RangeError('Memory must be able to fit in 31 bits (2Gb addressable space)')
        }

        this.chunkSize = 1 << chunkIndexBits;
        this.numberOfChunks = 1 << memoryIndexBits;
        this.memoryArray = new Uint8Array(this.chunkSize * this.numberOfChunks);

        this.addressMask = 0;
        for(const b of Array(memoryIndexBits + chunkIndexBits)) {
            this.addressMask = (this.addressMask << 1) + 1;
        }
    }

    private ValidAddress(inputAddress: number, offset: number): number {
        var validationBit = (inputAddress >>> 31) & 0x00000001;
        if (validationBit > 0) {
            var address = (inputAddress & this.addressMask) + offset;
            if (address >= 0 && address < this.memoryArray.length)
                return address;
        }

        return 0x00000000;
    }

    public ReadNumber(pointer: number, size: number): number {
        const bytes: number[] = [];

        for (let offset = 0; offset < size; offset++) {
            const address = this.ValidAddress(pointer, offset);
            if (address == 0)
                break;
            bytes.push(this.memoryArray[address]);
        }

        let output: number = 0;
        for (const byte of bytes) {
            output = (output << 8) + byte;
        }

        return output >>> 0;
    }

    public WriteNumber(pointer: number, size: number, value: number): void {

        for (let offset = 0; offset < size; offset++) {
            const address = this.ValidAddress(pointer, offset);
            if (address == 0)
                break;
            const byte = (value >>> ((size - 1 - offset) << 3)) & 0x000000FF;
            this.memoryArray[address] = byte;
        }
    }
}
