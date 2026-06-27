import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestLessOrEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("tle instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xAC4B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestLessOrEqualInstruction);
        expect(decoded).is.equals('tle $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tle $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestLessOrEqualInstruction);
        expect(encoded).is.equals(0xAC4B);
    });
});
