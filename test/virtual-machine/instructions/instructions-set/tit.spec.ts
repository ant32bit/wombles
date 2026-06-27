import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestIfTrueInstruction } from "../../../../src/virtual-machine/instructions";

describe("tit instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xB848;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestIfTrueInstruction);
        expect(decoded).is.equals('tit $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tit $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestIfTrueInstruction);
        expect(encoded).is.equals(0xB848);
    });
});
