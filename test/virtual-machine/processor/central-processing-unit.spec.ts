import { expect } from "chai";
import { RandomAccessMemory } from "../../../src/virtual-machine/memory";
import { CentralProcessingUnit } from "../../../src/virtual-machine/processor";
import { Process, RegisterType } from "../../../src/virtual-machine/processor/process";
import { BeginInterruptInstruction } from "../../../src/virtual-machine/instructions";

describe('central processing unit', () => {

    it('can create processes', () => {
        const memory = new RandomAccessMemory(2, 8);
        const cpu = new CentralProcessingUnit(memory);

        const cpuBeforeCreate = cpu.dump();

        const def = cpu.createProcess(1);

        const cpuAfterCreate = cpu.dump();

        expect(cpuBeforeCreate.processes).to.be.empty;
        expect(cpuAfterCreate.processes.length).to.equal(1);
        expect(cpuAfterCreate.processes[0]).to.deep.equal([def!.processId, def!.address, '__']);
    });

    it('can start processes', () => {
        const memory = new RandomAccessMemory(2, 8);
        const cpu = new CentralProcessingUnit(memory);

        const def = cpu.createProcess(1);

        cpu.startProcess(1, def!.processId);
        const cpuAfterStart= cpu.dump();

        expect(cpuAfterStart.processes[0]).to.deep.equal([def!.processId, def!.address, 'r_']);
    });

    it('can kill processes', () => {
        const memory = new RandomAccessMemory(2, 8);
        const cpu = new CentralProcessingUnit(memory);

        const def = cpu.createProcess(1);
        cpu.startProcess(1, def!.processId);
        const cpuBeforeKill= cpu.dump();

        cpu.killProcess(def!.processId);

        const cpuAfterKill= cpu.dump();

        expect(cpuBeforeKill.processes[0]).to.deep.equal([def!.processId, def!.address, 'r_']);
        expect(cpuAfterKill.processes).to.be.empty;
    });

    it('can initialise ip, sp on create', () => {
        const memory = new RandomAccessMemory(2, 8);
        const cpu = new CentralProcessingUnit(memory);

        const def = cpu.createProcess(1);
        const cpuAfterCreate = cpu.dump();

        const expectedIp = def!.address + Process.INSTRUCTIONS_OFFSET;
        const actualIp = cpuAfterCreate.registers[0].find(d => d[0] == 'IP')![1][0];

        const expectedSp = def!.address + 256;
        const actualSp = cpuAfterCreate.registers[0].find(d => d[0] == 'SP')![1][0];

        expect(actualIp).to.equal(expectedIp);
        expect(actualSp).to.equal(expectedSp);
    });

    it('can initialise i, j on start', () => {
        const memory = new RandomAccessMemory(2, 8);
        const cpu = new CentralProcessingUnit(memory);

        const def = cpu.createProcess(1);

        const instrPtr = (def!.address + Process.INSTRUCTIONS_OFFSET) >>> 0;
        const expectedAddresses = [0, 22, 14, 64, 92, 12, 46, 56].map(offset => instrPtr + offset);

        const jRegPrt = (def!.address >>> 0) + Process.REGISTERS_OFFSETS.get(RegisterType.JumpBack)!;

        for (let i = 0; i < expectedAddresses.length; i++) {
            // add interrupt instructions
            const instruction = new BeginInterruptInstruction(i);
            const value = instruction.encode();
            memory.writeNumber(expectedAddresses[i], 2, value);

            // add junk to J registers
            memory.writeNumber(jRegPrt + (i * 4), 4, expectedAddresses[i]);
        }

        cpu.startProcess(1, 2);

        const cpuAfterStart = cpu.dump();

        for(const jRegister of cpuAfterStart.registers[0].find(d => d[0] == 'J')![1]) {
            expect(jRegister).to.equal(0);
        }

        const iRegisters = cpuAfterStart.registers[0].find(d => d[0] == 'I')![1];

        for(let i = 0; i < expectedAddresses.length; i++) {
            expect(iRegisters[i]).to.equal(expectedAddresses[i] + 2);
        }
    });
});
