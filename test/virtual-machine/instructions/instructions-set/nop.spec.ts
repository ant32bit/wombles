import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, NoOpInstruction } from "../../../../src/virtual-machine/instructions";

describe("nop instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x0000;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(NoOpInstruction);
        expect(decoded).is.equals('nop');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('nop');
        const encoded = actual!.encode();

        expect(actual).instanceOf(NoOpInstruction);
        expect(encoded).is.equals(0x0000);
    });
});
