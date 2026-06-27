import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ExitInstruction } from "../../../../src/virtual-machine/instructions";

describe("end instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x00E4;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ExitInstruction);
        expect(decoded).is.equals('end 100');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('end 100');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ExitInstruction);
        expect(encoded).is.equals(0x00E4);
    });
});
