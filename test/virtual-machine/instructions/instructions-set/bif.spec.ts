import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchIfFalseInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("bif instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x9C48;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchIfFalseInstruction);
        expect(decoded).is.equals('bif $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bif $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchIfFalseInstruction);
        expect(encoded).is.equals(0x9C48);
    });

    it("can branch if register is false", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfFalseInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.setRegister(RegisterType.Data, 2, 5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });

    it("can branch to a negative offset", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfFalseInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET - 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.setRegister(RegisterType.Data, 2, -5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });

    it("won't branch when register is true", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfFalseInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 1);
        fixture.setRegister(RegisterType.Data, 2, 5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });
});
