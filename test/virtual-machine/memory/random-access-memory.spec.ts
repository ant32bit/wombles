import { assert, expect } from "chai";
import { RandomAccessMemory } from "../../../src/virtual-machine/memory";

describe("random access memory", () => {

    it ('throws if addressable space is too large', () => {
        assert.throws(() => new RandomAccessMemory(22, 10), RangeError);
    });

    it ('can read/write a byte of memory', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x98;

        var read1 = memory.ReadNumber(pointer, 1);

        memory.WriteNumber(pointer, 1, value);
        var read2 = memory.ReadNumber(pointer, 1);

        assert.equal(read1, 0);
        assert.equal(read2, value);
    });

    it ('can read/write a word of memory', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x9876;

        var read1 = memory.ReadNumber(pointer, 2);

        memory.WriteNumber(pointer, 2, value);
        var read2 = memory.ReadNumber(pointer, 2);

        assert.equal(read1, 0);
        assert.equal(read2, value);
    });

    it ('can read/write a dword of memory', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x98765432;

        var read1 = memory.ReadNumber(pointer, 4);

        memory.WriteNumber(pointer, 4, value);
        var read2 = memory.ReadNumber(pointer, 4);

        assert.equal(read1, 0);
        assert.equal(read2, value);
    });

    it ('will truncate a write on the end edge', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x800000FE;
        var value = 0x98765432;

        memory.WriteNumber(pointer, 4, value);
        var read = memory.ReadNumber(pointer, 4);

        assert.equal(read, 0x9876);
    });

    it ('will truncate a value to fit the size', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var value = 0x98765432;

        memory.WriteNumber(pointer, 2, value);
        var read = memory.ReadNumber(pointer - 2, 4);

        assert.equal(read, 0x5432);
    });

    it ('will return trucate pointers to the address mask', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x80000011;
        var dirtyPointer1 = 0x87654311;
        var dirtyPointer2 = 0x83456711;
        var value = 0x9876;

        memory.WriteNumber(pointer, 2, value);
        var read0 = memory.ReadNumber(pointer, 2);
        var read1 = memory.ReadNumber(dirtyPointer1, 2);
        var read2 = memory.ReadNumber(dirtyPointer2, 2);

        assert.equal(read0, 0x9876);
        assert.equal(read1, 0x9876);
        assert.equal(read2, 0x9876);
    });

    it ('will read 0 for a null pointer', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x00000000;
        var read = memory.ReadNumber(pointer, 1);

        assert.equal(read, 0x00);
    });

    it ('will read 0 for an invalid pointer', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x00000011;
        var read = memory.ReadNumber(pointer, 1);

        assert.equal(read, 0x00);
    });

    it ('will not throw writing to an invalid pointer', () => {
        var memory = new RandomAccessMemory(4, 4);
        var pointer = 0x00000011;
        assert.doesNotThrow(() => memory.WriteNumber(pointer, 1, 0xFF))
    });
});

