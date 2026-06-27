import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, DivisionInstruction } from "../../../../src/virtual-machine/instructions";

describe("div instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x504B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(DivisionInstruction);
        expect(decoded).is.equals('div $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('div $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(DivisionInstruction);
        expect(encoded).is.equals(0x504B);
    });
});
