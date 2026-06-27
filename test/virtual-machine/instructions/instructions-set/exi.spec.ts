import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ExecuteInterruptInstruction } from "../../../../src/virtual-machine/instructions";

describe("exi instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x0285;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ExecuteInterruptInstruction);
        expect(decoded).is.equals('exi 5');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('exi 5');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ExecuteInterruptInstruction);
        expect(encoded).is.equals(0x0285);
    });
});
