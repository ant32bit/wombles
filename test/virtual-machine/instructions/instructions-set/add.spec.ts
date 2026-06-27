import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, AdditionInstruction } from "../../../../src/virtual-machine/instructions";

describe("add instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x444B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(AdditionInstruction);
        expect(decoded).is.equals('add $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('add $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(AdditionInstruction);
        expect(encoded).is.equals(0x444B);
    });
});

