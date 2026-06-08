import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, RightShiftInstruction } from "../../../../src/virtual-machine/instructions";

describe("rsh instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x7C4B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(RightShiftInstruction);
        expect(decoded).is.equals('rsh $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('rsh $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(RightShiftInstruction);
        expect(encoded).is.equals(0x7C4B);
    });
});
