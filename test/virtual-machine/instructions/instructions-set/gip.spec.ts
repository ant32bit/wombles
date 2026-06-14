import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, GetInstructionPointerInstruction } from "../../../../src/virtual-machine/instructions";

describe("gip instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02C1;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(GetInstructionPointerInstruction);
        expect(decoded).is.equals('gip $1');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('gip $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(GetInstructionPointerInstruction);
        expect(encoded).is.equals(0x02C1);
    });
});
