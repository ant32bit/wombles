import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchLessThanInstruction } from "../../../../src/virtual-machine/instructions";

describe("blt instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x944B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchLessThanInstruction);
        expect(decoded).is.equals('blt $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('blt $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchLessThanInstruction);
        expect(encoded).is.equals(0x944B);
    });
});
