import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, CopyRegisterInstruction } from "../../../../src/virtual-machine/instructions";

describe("cpr instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x4048;
        const decoder = new InstructionDecoder();
        const actual = decoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(CopyRegisterInstruction);
        expect(decoded).is.equals('cpr $1, $2');
    });

    it("can be encoded", () => {

        const encoder = new InstructionEncoder();
        const actual = encoder.encode('cpr $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(CopyRegisterInstruction);
        expect(encoded).is.equals(0x4048);
    });
});
