import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchIfTrueInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("bit instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x9848;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchIfTrueInstruction);
        expect(decoded).is.equals('bit $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bit $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchIfTrueInstruction);
        expect(encoded).is.equals(0x9848);
    });

    it("can branch if register is true", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfTrueInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 1);
        fixture.setRegister(RegisterType.Data, 2, 5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });

    it("can branch to a negative offset", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfTrueInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET - 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 1);
        fixture.setRegister(RegisterType.Data, 2, -5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });

    it("won't branch when register is false", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfTrueInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.setRegister(RegisterType.Data, 2, 5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });
});
