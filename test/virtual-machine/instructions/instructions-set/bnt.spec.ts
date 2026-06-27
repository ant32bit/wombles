import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BinaryNotInstruction } from "../../../../src/virtual-machine/instructions";

describe("bnt instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x7448;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BinaryNotInstruction);
        expect(decoded).is.equals('bnt $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bnt $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BinaryNotInstruction);
        expect(encoded).is.equals(0x7448);
    });
});
