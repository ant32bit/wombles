import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ExitInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("end instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x00E4;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ExitInstruction);
        expect(decoded).is.equals('end 100');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('end 100');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ExitInstruction);
        expect(encoded).is.equals(0x00E4);
    });

    it("can kill the calling process", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new ExitInstruction(0x4B);

        fixture.setInstruction(instruction);
        fixture.run();

        const actualCode = fixture.getRegister(RegisterType.Data, 15);

        const dump = fixture.cpu.dump();

        expect(actualCode).to.equal(0x4B);
        expect(dump.processes).to.be.empty;
    });
});
