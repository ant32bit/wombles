import { expect } from "chai";
import { RandomAccessMemory } from "../../../src/virtual-machine/memory";

describe("heap allocation", () => {

    it ('can allocate a heap', () => {
        const memory = new RandomAccessMemory(4, 4);

        const mem = memory.reserveHeap(1, 2);
        const dump = memory.dump();

        expect(mem).to.not.be.null;
        expect(mem! >>> 0).to.equal(0x800000F0 >>> 0);

        expect(dump.frames).to.equal('0111111111111111')
        expect(dump.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 2],
            [0, 0x000000F2, 14]
        ]]);
    });

    it ('can allocate two items to a heap', () => {
        const memory = new RandomAccessMemory(4, 4);

        const mem1 = memory.reserveHeap(1, 2);
        const mem2 = memory.reserveHeap(4, 6);
        const dump = memory.dump();

        expect(mem1).to.not.be.null;
        expect(mem1! >>> 0).to.equal(0x800000F0 >>> 0);

        expect(mem2).to.not.be.null;
        expect(mem2! >>> 0).to.equal(0x800000F2 >>> 0);

        expect(dump.frames).to.equal('0111111111111111')
        expect(dump.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 2],
            [4, 0x000000F2, 6],
            [0, 0x000000F8, 8]
        ]]);
    });

    it ('can allocate free items', () => {
        const memory = new RandomAccessMemory(4, 4);

        memory.reserveHeap(1, 2);
        const mem = memory.reserveHeap(4, 6);
        memory.reserveHeap(5, 1);
        const dumpBeforeFree = memory.dump();

        memory.freeHeap(4, mem!);
        const dumpAfterFree = memory.dump();

        expect(dumpBeforeFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 2],
            [4, 0x000000F2, 6],
            [5, 0x000000F8, 1],
            [0, 0x000000F9, 7]
        ]]);

        expect(dumpAfterFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 2],
            [0, 0x000000F2, 6],
            [5, 0x000000F8, 1],
            [0, 0x000000F9, 7]
        ]]);
    });

    it ('can merge three items items', () => {
        const memory = new RandomAccessMemory(4, 4);

        memory.reserveHeap(1, 2);
        const mem1 = memory.reserveHeap(4, 2);
        const mem2 = memory.reserveHeap(5, 3);
        const mem3 = memory.reserveHeap(6, 4);
        memory.reserveHeap(5, 1);
        memory.freeHeap(4, mem1!);
        memory.freeHeap(6, mem3!);
        const dumpBeforeFree = memory.dump();

        memory.freeHeap(5, mem2!);
        const dumpAfterFree = memory.dump();

        expect(dumpBeforeFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 2],
            [0, 0x000000F2, 2],
            [5, 0x000000F4, 3],
            [0, 0x000000F7, 4],
            [5, 0x000000FB, 1],
            [0, 0x000000FC, 4]
        ]]);

        expect(dumpAfterFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 2],
            [0, 0x000000F2, 9],
            [5, 0x000000FB, 1],
            [0, 0x000000FC, 4]
        ]]);
    });

    it ('can allocate free and merge the first item', () => {
        const memory = new RandomAccessMemory(4, 4);

        const mem1 = memory.reserveHeap(1, 2);
        const mem2 = memory.reserveHeap(4, 6);
        memory.reserveHeap(5, 1);
        memory.freeHeap(4, mem2!);
        const dumpBeforeFree = memory.dump();

        memory.freeHeap(1, mem1!);
        const dumpAfterFree = memory.dump();

        expect(dumpBeforeFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 2],
            [0, 0x000000F2, 6],
            [5, 0x000000F8, 1],
            [0, 0x000000F9, 7]
        ]]);

        expect(dumpAfterFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 8],
            [5, 0x000000F8, 1],
            [0, 0x000000F9, 7]
        ]]);
    });

    it ('can allocate free and merge the last item', () => {
        const memory = new RandomAccessMemory(4, 4);

        memory.reserveHeap(1, 10);
        const mem1 = memory.reserveHeap(4, 4);
        const mem2 = memory.reserveHeap(5, 2);
        memory.freeHeap(4, mem1!);
        const dumpBeforeFree = memory.dump();

        memory.freeHeap(5, mem2!);
        const dumpAfterFree = memory.dump();

        expect(dumpBeforeFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 10],
            [0, 0x000000FA, 4],
            [5, 0x000000FE, 2]
        ]]);

        expect(dumpAfterFree.heaps).to.deep.equal([[
            [0, 0x000000F0, 0],
            [1, 0x000000F0, 10],
            [0, 0x000000FA, 6]
        ]]);
    });

    it ('can allocate a new heap if one is full', () => {
        const memory = new RandomAccessMemory(4, 4);

        memory.reserveHeap(1, 16);
        const dump1 = memory.dump();

        memory.reserveHeap(1, 1);
        const dump2 = memory.dump();

        expect(dump1.frames).to.equal('0111111111111111')
        expect(dump1.heaps).to.deep.equal([
            [
                [0, 0x000000F0, 0],
                [1, 0x000000F0, 16],
            ]
        ]);

        expect(dump2.frames).to.equal('0011111111111111')
        expect(dump2.heaps).to.deep.equal([
            [
                [0, 0x000000F0, 0],
                [1, 0x000000F0, 16],
            ],
            [
                [0, 0x000000E0, 0],
                [1, 0x000000E0, 1],
                [0, 0x000000E1, 15]
            ]
        ]);
    });
});
