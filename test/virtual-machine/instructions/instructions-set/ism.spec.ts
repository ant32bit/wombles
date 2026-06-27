import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ImmediateSetMemoryInstruction } from "../../../../src/virtual-machine/instructions";

describe("ism instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x318B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ImmediateSetMemoryInstruction);
        expect(decoded).is.equals('ism $1, 139');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('ism $1, 139');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ImmediateSetMemoryInstruction);
        expect(encoded).is.equals(0x318B);
    });
});
