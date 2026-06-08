import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, StoreToMemoryInstruction } from "../../../../src/virtual-machine/instructions";

describe("stm instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x2463;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(StoreToMemoryInstruction);
        expect(decoded).is.equals('stm $1[2], $3');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('stm $1[2], $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(StoreToMemoryInstruction);
        expect(encoded).is.equals(0x2463);
    });
});
