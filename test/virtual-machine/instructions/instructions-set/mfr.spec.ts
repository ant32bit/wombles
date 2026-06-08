import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, MemoryFreeInstruction } from "../../../../src/virtual-machine/instructions";

describe("mfr instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x0141;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(MemoryFreeInstruction);
        expect(decoded).is.equals('mfr $1');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('mfr $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(MemoryFreeInstruction);
        expect(encoded).is.equals(0x0141);
    });
});
