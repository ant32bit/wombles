import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, EndOfInterruptInstruction } from "../../../../src/virtual-machine/instructions";

describe("eoi instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x0296;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(EndOfInterruptInstruction);
        expect(decoded).is.equals('eoi 6');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('eoi 6');
        const encoded = actual!.encode();

        expect(actual).instanceOf(EndOfInterruptInstruction);
        expect(encoded).is.equals(0x0296);
    });
});
