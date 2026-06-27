import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("teq instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xA04B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestEqualInstruction);
        expect(decoded).is.equals('teq $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('teq $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestEqualInstruction);
        expect(encoded).is.equals(0xA04B);
    });
});
