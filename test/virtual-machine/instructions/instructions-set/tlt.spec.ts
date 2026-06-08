import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestLessThanInstruction } from "../../../../src/virtual-machine/instructions";

describe("tlt instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xB44B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestLessThanInstruction);
        expect(decoded).is.equals('tlt $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('tlt $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestLessThanInstruction);
        expect(encoded).is.equals(0xB44B);
    });
});
