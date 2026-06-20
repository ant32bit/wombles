import { expect } from "chai";
import { RandomAccessMemory } from "../../../src/virtual-machine/memory";

describe("process allocation", () => {

    it ('can allocate a process', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.createProcess(1);

        const dump = memory.dump();

        expect(processDef).to.not.be.null;
        expect(processDef!.address >>> 0).to.equal(0x800000F0 >>> 0);
        expect(processDef!.processId).to.equal(2);

        expect(dump.frames).to.equal('0111111111111111')
        expect(dump.processes[0][1]).to.equal('init');
    });

    it ('can start a process', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.createProcess(1);
        const runningProcessesBeforeStart = memory.getRunningProcesses();
        memory.startProcess(1, processDef!.processId);
        const runningProcessesAfterStart = memory.getRunningProcesses();

        const dump = memory.dump();

        expect(runningProcessesBeforeStart).to.be.empty;
        expect(runningProcessesAfterStart.length).to.equal(1)
        expect(runningProcessesAfterStart[0]).to.deep.equal(processDef);
        expect(dump.processes[0][1]).to.equal('running');
    });

    it ('can kill a process', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.createProcess(1)!;
        memory.startProcess(1, processDef.processId);
        const runningProcessesBeforeKill = memory.getRunningProcesses();
        memory.killProcess(processDef.processId);
        const runningProcessesAfterKill = memory.getRunningProcesses();

        const dump = memory.dump();

        expect(runningProcessesBeforeKill.length).to.equal(1)
        expect(runningProcessesBeforeKill[0]).to.deep.equal(processDef);
        expect(runningProcessesAfterKill).to.be.empty;
        expect(dump.processes[0][1]).to.equal('killed');
    });

    it ('won\'t start a process from a different owner', () => {
        const memory = new RandomAccessMemory(4, 4);

        const processDef = memory.createProcess(1);
        const runningProcessesBeforeStart = memory.getRunningProcesses();
        memory.startProcess(7, processDef!.processId);
        const runningProcessesAfterStart = memory.getRunningProcesses();

        const dump = memory.dump();

        expect(runningProcessesBeforeStart).to.be.empty;
        expect(runningProcessesAfterStart).to.be.empty;
        expect(dump.processes[0][1]).to.equal('init');
    });
});
