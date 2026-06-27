import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchIfFalseInstruction } from "../../../../src/virtual-machine/instructions";

describe("bif instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x9C48;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchIfFalseInstruction);
        expect(decoded).is.equals('bif $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bif $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchIfFalseInstruction);
        expect(encoded).is.equals(0x9C48);
    });
});
