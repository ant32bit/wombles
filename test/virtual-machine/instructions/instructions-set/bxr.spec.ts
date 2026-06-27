import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BinaryExclusiveOrInstruction } from "../../../../src/virtual-machine/instructions";

describe("bxr instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x704B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BinaryExclusiveOrInstruction);
        expect(decoded).is.equals('bxr $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bxr $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BinaryExclusiveOrInstruction);
        expect(encoded).is.equals(0x704B);
    });
});
