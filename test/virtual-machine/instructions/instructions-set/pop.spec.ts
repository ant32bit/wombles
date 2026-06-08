import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, StackPopInstruction } from "../../../../src/virtual-machine/instructions";

describe("pop instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02F1;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(StackPopInstruction);
        expect(decoded).is.equals('pop $1');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('pop $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(StackPopInstruction);
        expect(encoded).is.equals(0x02F1);
    });
});
