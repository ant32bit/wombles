import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ImmediateSetRegisterInstruction } from "../../../../src/virtual-machine/instructions";

describe("set instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xC68B;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ImmediateSetRegisterInstruction);
        expect(decoded).is.equals('set $1[2], 139');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('set $1[2], 139');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ImmediateSetRegisterInstruction);
        expect(encoded).is.equals(0xC68B);
    });
});
