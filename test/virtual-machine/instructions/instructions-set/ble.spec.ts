import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchLessOrEqualInstruction } from "../../../../src/virtual-machine/instructions";

describe("ble instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x8C4B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchLessOrEqualInstruction);
        expect(decoded).is.equals('ble $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('ble $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchLessOrEqualInstruction);
        expect(encoded).is.equals(0x8C4B);
    });
});
