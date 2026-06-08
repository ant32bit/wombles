import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LogicalOrInstruction } from "../../../../src/virtual-machine/instructions";

describe("ior instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x5C4B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LogicalOrInstruction);
        expect(decoded).is.equals('ior $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('ior $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LogicalOrInstruction);
        expect(encoded).is.equals(0x5C4B);
    });
});
