import { expect } from "chai";
import { RandomAccessMemory } from "../../../src/virtual-machine/memory";

describe("random access memory", () => {

    it ('throws if addressable space is too large', () => {
        expect(() => new RandomAccessMemory(22, 10)).to.throw(RangeError);
    });

    it ('can read/write a byte of memory', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x98;

        var read1 = memory.readNumber(pointer, 1);

        memory.writeNumber(pointer, 1, value);
        var read2 = memory.readNumber(pointer, 1);

        expect(read1).to.equal(0);
        expect(read2).to.equal(value);
    });

    it ('can read/write a word of memory', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x9876;

        var read1 = memory.readNumber(pointer, 2);

        memory.writeNumber(pointer, 2, value);
        var read2 = memory.readNumber(pointer, 2);

        expect(read1).to.equal(0);
        expect(read2).to.equal(value);
    });

    it ('can read/write a dword of memory', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x98765432;

        var read1 = memory.readNumber(pointer, 4);

        memory.writeNumber(pointer, 4, value);
        var read2 = memory.readNumber(pointer, 4);

        expect(read1).to.equal(0);
        expect(read2).to.equal(value);
    });

    it ('can truncate a write on the end edge', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x800000FE;
        var value = 0x98765432;

        memory.writeNumber(pointer, 4, value);
        var read = memory.readNumber(pointer, 4);

        expect(read).to.equal(0x9876);
    });

    it ('can truncate a value to fit the size', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x98765432;

        memory.writeNumber(pointer, 2, value);
        var read = memory.readNumber(pointer - 2, 4);

        expect(read).to.equal(0x5432);
    });

    it ('can return trucate pointers to the address mask', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var dirtyPointer1 = 0x87654311;
        var dirtyPointer2 = 0x83456711;
        var value = 0x9876;

        memory.writeNumber(pointer, 2, value);
        var read0 = memory.readNumber(pointer, 2);
        var read1 = memory.readNumber(dirtyPointer1, 2);
        var read2 = memory.readNumber(dirtyPointer2, 2);

        expect(read0).to.equal(0x9876);
        expect(read1).to.equal(0x9876);
        expect(read2).to.equal(0x9876);
    });

    it ('can read 0 for a null pointer', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x00000000;
        var read = memory.readNumber(pointer, 1);

        expect(read).to.equal(0x00);
    });

    it ('can read 0 for an invalid pointer', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x00000011;
        var read = memory.readNumber(pointer, 1);

        expect(read).to.equal(0x00);
    });

    it ('will not throw writing to an invalid pointer', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x00000011;
        expect(() => memory.writeNumber(pointer, 1, 0xFF)).does.not.throw();
    });

    it ('can garbage collect when it runs out of memory', () => {
        var memory = new RandomAccessMemory(2, 1);

        const process1 = memory.createProcess(1);
        memory.startProcess(1, process1!.processId);
        memory.killProcess(process1!.processId);

        const process2 = memory.createProcess(1);
        memory.startProcess(1, process2!.processId);

        const heap1 = memory.reserveHeap(1, 2);
        const heap2 = memory.reserveHeap(1, 2);
        memory.freeHeap(1, heap2!);

        const dumpBeforeGC = memory.dump();

        memory.createProcess(1);
        const dumpAfterGC = memory.dump();

        expect(dumpBeforeGC).to.deep.equal({
            frames: '0000',
            heaps: [
                [[0, 0x02, 0], [1, 0x02, 2]],
                [[0, 0x00, 2]]
            ],
            processes: [
                [2, 'killed'],
                [3, 'running']
            ]
        });

        expect(dumpAfterGC).to.deep.equal({
            frames: '0001',
            heaps: [
                [[0, 0x02, 0], [1, 0x02, 2]]
            ],
            processes: [
                [3, 'running'],
                [4, 'init']
            ]
        });
    });
});

