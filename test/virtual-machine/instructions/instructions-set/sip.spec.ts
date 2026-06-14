import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, SetInstructionPointerInstruction } from "../../../../src/virtual-machine/instructions";

describe("sip instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02D1;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(SetInstructionPointerInstruction);
        expect(decoded).is.equals('sip $1');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('sip $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(SetInstructionPointerInstruction);
        expect(encoded).is.equals(0x02D1);
    });
});
