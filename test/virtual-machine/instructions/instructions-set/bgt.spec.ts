import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchGreaterThanInstruction } from "../../../../src/virtual-machine/instructions";

describe("bgt instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x904B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchGreaterThanInstruction);
        expect(decoded).is.equals('bgt $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bgt $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchGreaterThanInstruction);
        expect(encoded).is.equals(0x904B);
    });
});
