import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestIfFalseInstruction } from "../../../../src/virtual-machine/instructions";

describe("tif instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xBC48;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestIfFalseInstruction);
        expect(decoded).is.equals('tif $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tif $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestIfFalseInstruction);
        expect(encoded).is.equals(0xBC48);
    });
});
