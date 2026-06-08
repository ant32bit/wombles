import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LoadFromMemoryInstruction } from "../../../../src/virtual-machine/instructions";

describe("cpm instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x204B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LoadFromMemoryInstruction);
        expect(decoded).is.equals('lfm $1, $2[3]');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('lfm $1, $2[3]');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LoadFromMemoryInstruction);
        expect(encoded).is.equals(0x204B);
    });
});
