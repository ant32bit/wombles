import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ProcessCreateInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("pcr instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x019B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ProcessCreateInstruction);
        expect(decoded).is.equals('pcr $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('pcr $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ProcessCreateInstruction);
        expect(encoded).is.equals(0x019B);
    });

    it("can create a process", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new ProcessCreateInstruction(1, 2, 3);

        fixture.setInstruction(instruction);

        const dumpBeforeRun = fixture.cpu.dump();

        fixture.run();

        const dumpAfterRun = fixture.cpu.dump();

        expect(dumpBeforeRun.processes.length).to.equal(1);
        expect(dumpAfterRun.processes.length).to.equal(2);

        const processAddressInRegister = fixture.getRegister(RegisterType.Data, 1);
        const processIdInRegister = fixture.getRegister(RegisterType.Data, 2);
        const instructionsAddressInRegister = fixture.getRegister(RegisterType.Data, 3);

        const processStateInCpu = dumpAfterRun.processes[1][2];
        const processAddressInCpu = dumpAfterRun.processes[1][1];
        const processIdInCpu = dumpAfterRun.processes[1][0];
        const instructionsAddressInCpu = dumpAfterRun.registers[1][3][1][0]; // InstructionPointer

        expect(processStateInCpu).to.equal('__');
        expect(processAddressInRegister).to.equal(processAddressInCpu);
        expect(processIdInRegister).to.equal(processIdInCpu);
        expect(instructionsAddressInRegister).to.equal(instructionsAddressInCpu);
    });

    it("can return all zeros if it can't create a process", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new ProcessCreateInstruction(1, 2, 3);

        // eat all available memory
        fixture.memory.reserveHeap(1, 256);
        fixture.memory.reserveHeap(1, 256);
        fixture.memory.reserveHeap(1, 256);

        fixture.setInstruction(instruction);
        fixture.run();

        const dumpAfterRun = fixture.cpu.dump();

        expect(dumpAfterRun.processes.length).to.equal(1);

        const processAddressInRegister = fixture.getRegister(RegisterType.Data, 1);
        const processIdInRegister = fixture.getRegister(RegisterType.Data, 2);
        const instructionsAddressInRegister = fixture.getRegister(RegisterType.Data, 3);

        expect(processAddressInRegister).to.equal(0);
        expect(processIdInRegister).to.equal(0);
        expect(instructionsAddressInRegister).to.equal(0);
    });
});
