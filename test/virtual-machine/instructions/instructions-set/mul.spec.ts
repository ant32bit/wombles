import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, MultiplicationInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("mul instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x4C4B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(MultiplicationInstruction);
        expect(decoded).is.equals('mul $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('mul $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(MultiplicationInstruction);
        expect(encoded).is.equals(0x4C4B);
    });

    it("can multiply two numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new MultiplicationInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 4);
        fixture.setRegister(RegisterType.Data, 2, 2);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(8);
    });

    it("can multiply positive and negative numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new MultiplicationInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 4);
        fixture.setRegister(RegisterType.Data, 2, -2);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 3);
        expect(actualResult).to.equal(-8 >>> 0);
    });
});
