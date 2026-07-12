import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ProcessStartInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("pst instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x01C1;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ProcessStartInstruction);
        expect(decoded).is.equals('pst $1');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('pst $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ProcessStartInstruction);
        expect(encoded).is.equals(0x01C1);
    });

    it("can create a process", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new ProcessStartInstruction(1);

        const pid = fixture.process.processId;
        const newProcess = fixture.cpu.createProcess(pid);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, newProcess!.processId);
        fixture.run();

        const dumpAfterRun = fixture.cpu.dump();
        const processStateInCpu = dumpAfterRun.processes[1][2];

        expect(processStateInCpu).to.equal('r_');
    });
});
