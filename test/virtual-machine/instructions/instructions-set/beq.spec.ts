import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("beq instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x804B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchEqualInstruction);
        expect(decoded).is.equals('beq $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('beq $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchEqualInstruction);
        expect(encoded).is.equals(0x804B);
    });
});
