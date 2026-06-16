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

    it ('will truncate a write on the end edge', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x800000FE;
        var value = 0x98765432;

        memory.writeNumber(pointer, 4, value);
        var read = memory.readNumber(pointer, 4);

        expect(read).to.equal(0x9876);
    });

    it ('will truncate a value to fit the size', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x98765432;

        memory.writeNumber(pointer, 2, value);
        var read = memory.readNumber(pointer - 2, 4);

        expect(read).to.equal(0x5432);
    });

    it ('will return trucate pointers to the address mask', () => {
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

    it ('will read 0 for a null pointer', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x00000000;
        var read = memory.readNumber(pointer, 1);

        expect(read).to.equal(0x00);
    });

    it ('will read 0 for an invalid pointer', () => {
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
});

