import { expect } from "chai";
import { VirtualMachineFixture } from "./_fixture";
import { InstructionDecoder, InstructionEncoder, AdditionInstruction } from "../../../../src/virtual-machine/instructions";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("add instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x444B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(AdditionInstruction);
        expect(decoded).is.equals('add $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('add $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(AdditionInstruction);
        expect(encoded).is.equals(0x444B);
    });

    it("can add two numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new AdditionInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 2);
        fixture.setRegister(RegisterType.Data, 2, 3);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'R')![1][2]).to.equal(5);
    });

    it("can add positive and negative numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new AdditionInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, -3);
        fixture.setRegister(RegisterType.Data, 2, 2);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'R')![1][2]).to.equal(0xFFFFFFFF); // (-1)
    });
});

