import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ProcessCreateInstruction } from "../../../../src/virtual-machine/instructions";

describe("pcr instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x019B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ProcessCreateInstruction);
        expect(decoded).is.equals('pcr $1, $2, $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('pcr $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ProcessCreateInstruction);
        expect(encoded).is.equals(0x019B);
    });
});
