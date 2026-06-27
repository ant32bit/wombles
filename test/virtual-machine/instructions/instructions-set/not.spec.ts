import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LogicalNotInstruction } from "../../../../src/virtual-machine/instructions";

describe("not instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x6448;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LogicalNotInstruction);
        expect(decoded).is.equals('not $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('not $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LogicalNotInstruction);
        expect(encoded).is.equals(0x6448);
    });
});
