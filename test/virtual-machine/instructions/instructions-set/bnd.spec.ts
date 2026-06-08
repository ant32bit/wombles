import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BinaryAndInstruction } from "../../../../src/virtual-machine/instructions";

describe("bnd instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x684B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BinaryAndInstruction);
        expect(decoded).is.equals('bnd $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('bnd $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BinaryAndInstruction);
        expect(encoded).is.equals(0x684B);
    });
});
