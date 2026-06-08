import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LogicalExclusiveOrInstruction } from "../../../../src/virtual-machine/instructions";

describe("xor instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x604B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LogicalExclusiveOrInstruction);
        expect(decoded).is.equals('xor $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('xor $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LogicalExclusiveOrInstruction);
        expect(encoded).is.equals(0x604B);
    });
});
