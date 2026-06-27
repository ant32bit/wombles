import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BinaryOrInstruction } from "../../../../src/virtual-machine/instructions";

describe("bor instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x6C4B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BinaryOrInstruction);
        expect(decoded).is.equals('bor $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bor $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BinaryOrInstruction);
        expect(encoded).is.equals(0x6C4B);
    });
});
