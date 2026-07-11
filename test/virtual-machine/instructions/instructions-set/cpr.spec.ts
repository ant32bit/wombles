import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, CopyRegisterInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("cpr instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x4048;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(CopyRegisterInstruction);
        expect(decoded).is.equals('cpr $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('cpr $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(CopyRegisterInstruction);
        expect(encoded).is.equals(0x4048);
    });

    it("can copy registers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new CopyRegisterInstruction(1, 2);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0x4B);
        fixture.setRegister(RegisterType.Data, 2, 0x00);
        fixture.run();

        var actualValue = fixture.getRegister(RegisterType.Data, 2);
        expect(actualValue).to.equal(0x4B);
    });
});
