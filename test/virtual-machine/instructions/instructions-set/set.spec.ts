import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ImmediateSetRegisterInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("set instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xC68B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ImmediateSetRegisterInstruction);
        expect(decoded).is.equals('set $1[2], 139');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('set $1[2], 139');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ImmediateSetRegisterInstruction);
        expect(encoded).is.equals(0xC68B);
    });

    it("can set registry", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new ImmediateSetRegisterInstruction(1, 2, 0xBE);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0xDEAD00EF);
        fixture.run();

        var actualValue = fixture.getRegister(RegisterType.Data, 1)

        expect(actualValue).to.equal(0xDEADBEEF);
    });
});
