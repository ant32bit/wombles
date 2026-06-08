import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, CopyMemoryInstruction } from "../../../../src/virtual-machine/instructions";

describe("cpm instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x2812;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(CopyMemoryInstruction);
        expect(decoded).is.equals('cpm $1, $2');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('cpm $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(CopyMemoryInstruction);
        expect(encoded).is.equals(0x2812);
    });
});
