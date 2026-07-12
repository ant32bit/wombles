import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, SubtractionInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("sub instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x484B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(SubtractionInstruction);
        expect(decoded).is.equals('sub $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('sub $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(SubtractionInstruction);
        expect(encoded).is.equals(0x484B);
    });

    it("can subtract two numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new SubtractionInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 3);
        fixture.setRegister(RegisterType.Data, 2, 2);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(1);
    });

    it("can subtract positive and negative numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new SubtractionInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, -3);
        fixture.setRegister(RegisterType.Data, 2, 2);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(-5 >>> 0);
    });
});
