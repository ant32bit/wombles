import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, IncrementMemoryPointerInstruction } from "../../../../src/virtual-machine/instructions";

describe("imp instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x2C50;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(IncrementMemoryPointerInstruction);
        expect(decoded).is.equals('imp $1, 16');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('imp $1, 16');
        const encoded = actual!.encode();

        expect(actual).instanceOf(IncrementMemoryPointerInstruction);
        expect(encoded).is.equals(0x2C50);
    });
});
