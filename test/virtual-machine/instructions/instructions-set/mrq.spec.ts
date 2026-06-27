import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, MemoryRequestInstruction } from "../../../../src/virtual-machine/instructions";

describe("mrq instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x010A;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(MemoryRequestInstruction);
        expect(decoded).is.equals('mrq $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('mrq $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(MemoryRequestInstruction);
        expect(encoded).is.equals(0x010A);
    });
});
