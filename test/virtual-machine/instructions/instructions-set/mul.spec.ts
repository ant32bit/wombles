import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, MultiplicationInstruction } from "../../../../src/virtual-machine/instructions";

describe("mul instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x4C4B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(MultiplicationInstruction);
        expect(decoded).is.equals('mul $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('mul $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(MultiplicationInstruction);
        expect(encoded).is.equals(0x4C4B);
    });
});
