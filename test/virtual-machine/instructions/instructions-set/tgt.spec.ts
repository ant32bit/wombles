import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestGreaterThanInstruction } from "../../../../src/virtual-machine/instructions";

describe("tgt instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xB04B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestGreaterThanInstruction);
        expect(decoded).is.equals('tgt $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tgt $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestGreaterThanInstruction);
        expect(encoded).is.equals(0xB04B);
    });
});
