import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestGreaterOrEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("tge instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xA84B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestGreaterOrEqualInstruction);
        expect(decoded).is.equals('tge $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('tge $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestGreaterOrEqualInstruction);
        expect(encoded).is.equals(0xA84B);
    });
});
