import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchGreaterOrEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("bge instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x884B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchGreaterOrEqualInstruction);
        expect(decoded).is.equals('bge $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('bge $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchGreaterOrEqualInstruction);
        expect(encoded).is.equals(0x884B);
    });
});

