import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, DivisionInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("div instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x504B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(DivisionInstruction);
        expect(decoded).is.equals('div $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('div $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(DivisionInstruction);
        expect(encoded).is.equals(0x504B);
    });

    it("can add two numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new DivisionInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 4);
        fixture.setRegister(RegisterType.Data, 2, 2);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(2);
    });

    it("can add positive and negative numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new DivisionInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 4);
        fixture.setRegister(RegisterType.Data, 2, -2);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(0xFFFFFFFE); // (-2)
    });
});
