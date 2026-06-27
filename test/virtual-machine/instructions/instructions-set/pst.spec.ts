import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ProcessStartInstruction } from "../../../../src/virtual-machine/instructions";

describe("pst instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x01C1;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ProcessStartInstruction);
        expect(decoded).is.equals('pst $1');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('pst $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ProcessStartInstruction);
        expect(encoded).is.equals(0x01C1);
    });
});
