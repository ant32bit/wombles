import { expect } from "chai";
import { RandomAccessMemory } from "../../../src/virtual-machine/memory";

describe("process allocation", () => {

    it ('can allocate a process', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.allocProcess(1);

        const dump = memory.dump();

        expect(processDef).to.not.be.null;
        expect(processDef!.address >>> 0).to.equal(0x800000F0 >>> 0);
        expect(processDef!.processId).to.equal(2);

        expect(dump.frames).to.equal('0111111111111111');
        expect(dump.processes[0]).to.deep.equal([2, 1, 0x800000F0]);
    });

    it ('can transfer a process', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.allocProcess(1);
        const runningProcessesBeforeTransfer = memory.dump().processes;
        memory.transferProcess(1, processDef!.processId);
        const runningProcessesAfterTransfer = memory.dump().processes;

        expect(runningProcessesBeforeTransfer[0]).to.deep.equal([2, 1, 0x800000F0]);
        expect(runningProcessesAfterTransfer[0]).to.deep.equal([2, 2, 0x800000F0]);
    });

    it ('can free a process', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.allocProcess(1)!;
        memory.transferProcess(1, processDef.processId);
        const runningProcessesBeforeFree = memory.dump().processes;
        memory.freeProcess(processDef.processId);
        const runningProcessesAfterFree = memory.dump().processes;

        expect(runningProcessesBeforeFree[0]).to.deep.equal([2, 2, 0x800000F0]);
        expect(runningProcessesAfterFree[0]).to.deep.equal([2, 0, 0x800000F0]);
    });

    it ('won\'t transfer a process from a different owner', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.allocProcess(1);
        const runningProcessesBeforeTransfer = memory.dump().processes;
        memory.transferProcess(7, processDef!.processId);
        const runningProcessesAfterTransfer = memory.dump().processes;

        expect(runningProcessesBeforeTransfer[0]).to.deep.equal([2, 1, 0x800000F0]);
        expect(runningProcessesAfterTransfer[0]).to.deep.equal([2, 1, 0x800000F0]);
    });
});
