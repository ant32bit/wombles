import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestNotEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("tne instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xA44B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestNotEqualInstruction);
        expect(decoded).is.equals('tne $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('tne $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestNotEqualInstruction);
        expect(encoded).is.equals(0xA44B);
    });
});
