import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, SetInstructionPointerInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("sip instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02D1;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(SetInstructionPointerInstruction);
        expect(decoded).is.equals('sip $1');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('sip $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(SetInstructionPointerInstruction);
        expect(encoded).is.equals(0x02D1);
    });

    it("can set the instruction pointer", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new SetInstructionPointerInstruction(1);

        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, expectedAddress);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
        expect(actualResult).to.equal(expectedAddress);
    })
});
