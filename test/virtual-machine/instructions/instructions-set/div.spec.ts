import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, DivisionInstruction } from "../../../../src/virtual-machine/instructions";

describe("div instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x504B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(DivisionInstruction);
        expect(decoded).is.equals('div $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('div $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(DivisionInstruction);
        expect(encoded).is.equals(0x504B);
    });
});
