import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, GetInstructionPointerInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("gip instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02C1;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(GetInstructionPointerInstruction);
        expect(decoded).is.equals('gip $1');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('gip $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(GetInstructionPointerInstruction);
        expect(encoded).is.equals(0x02C1);
    });

    it("can save the instruction pointer to a register", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new GetInstructionPointerInstruction(12);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET;

        fixture.setInstruction(instruction);
        fixture.run();

        const actualRegister = fixture.getRegister(RegisterType.Data, 12);
        expect(actualRegister).to.equal(expectedAddress);
    });
});
