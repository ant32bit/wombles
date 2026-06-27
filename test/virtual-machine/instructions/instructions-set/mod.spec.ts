import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ModulusInstruction } from "../../../../src/virtual-machine/instructions";

describe("mod instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x544B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ModulusInstruction);
        expect(decoded).is.equals('mod $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('mod $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ModulusInstruction);
        expect(encoded).is.equals(0x544B);
    });
});
