import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LeftShiftInstruction } from "../../../../src/virtual-machine/instructions";

describe("lsh instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x784B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LeftShiftInstruction);
        expect(decoded).is.equals('lsh $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('lsh $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LeftShiftInstruction);
        expect(encoded).is.equals(0x784B);
    });
});
