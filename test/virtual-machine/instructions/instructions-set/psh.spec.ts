import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, StackPushInstruction } from "../../../../src/virtual-machine/instructions";

describe("psh instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02E1;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(StackPushInstruction);
        expect(decoded).is.equals('psh $1');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('psh $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(StackPushInstruction);
        expect(encoded).is.equals(0x02E1);
    });
});
