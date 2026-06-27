import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchNotEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("bne instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x844B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchNotEqualInstruction);
        expect(decoded).is.equals('bne $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bne $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchNotEqualInstruction);
        expect(encoded).is.equals(0x844B);
    });
});
