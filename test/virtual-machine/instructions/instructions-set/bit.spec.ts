import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchIfTrueInstruction } from "../../../../src/virtual-machine/instructions";

describe("bit instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x9848;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchIfTrueInstruction);
        expect(decoded).is.equals('bit $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bit $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchIfTrueInstruction);
        expect(encoded).is.equals(0x9848);
    });
});
