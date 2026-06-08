import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BeginInterruptInstruction } from "../../../../src/virtual-machine/instructions";

describe("bei instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x028F;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BeginInterruptInstruction);
        expect(decoded).is.equals('bei 7');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('bei 7');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BeginInterruptInstruction);
        expect(encoded).is.equals(0x028F);
    });
});
