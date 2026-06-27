import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestNotEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("tne instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xA44B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestNotEqualInstruction);
        expect(decoded).is.equals('tne $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tne $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestNotEqualInstruction);
        expect(encoded).is.equals(0xA44B);
    });
});
