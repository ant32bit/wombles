import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LogicalAndInstruction } from "../../../../src/virtual-machine/instructions";

describe("and instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x584B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LogicalAndInstruction);
        expect(decoded).is.equals('and $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('and $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LogicalAndInstruction);
        expect(encoded).is.equals(0x584B);
    });
});
