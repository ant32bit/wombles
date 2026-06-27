import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, SubtractionInstruction } from "../../../../src/virtual-machine/instructions";

describe("sub instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x484B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(SubtractionInstruction);
        expect(decoded).is.equals('sub $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('sub $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(SubtractionInstruction);
        expect(encoded).is.equals(0x484B);
    });
});
