import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, RightShiftInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("rsh instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x7C4B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(RightShiftInstruction);
        expect(decoded).is.equals('rsh $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('rsh $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(RightShiftInstruction);
        expect(encoded).is.equals(0x7C4B);
    });

    it("can right shift a number by another number", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new RightShiftInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0x0C000000);
        fixture.setRegister(RegisterType.Data, 2, 25);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(0x00000006);
    });

    it("can right shift a number out of bounds", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new RightShiftInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0x0C000000);
        fixture.setRegister(RegisterType.Data, 2, 27);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(0x00000001);
    });

    it("rhs values higher than 31 produce 0", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new RightShiftInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0x0C000000);
        fixture.setRegister(RegisterType.Data, 2, 32);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(0x00000000);
    });

    it("can treat lhs numbers as unsigned", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new RightShiftInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, -5);
        fixture.setRegister(RegisterType.Data, 2, 8);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(0x00FFFFFF);
    });

    it("can treat rhs numbers as unsigned", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new RightShiftInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 5);
        fixture.setRegister(RegisterType.Data, 2, -7);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(0x00000000);
    });
});
