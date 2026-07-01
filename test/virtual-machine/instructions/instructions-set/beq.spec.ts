import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchEqualInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("beq instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x804B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchEqualInstruction);
        expect(decoded).is.equals('beq $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('beq $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchEqualInstruction);
        expect(encoded).is.equals(0x804B);
    });

    it("can branch if two registers are equal", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchEqualInstruction(1, 2, 3);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 600);
        fixture.setRegister(RegisterType.Data, 2, 600);
        fixture.setRegister(RegisterType.Data, 3, 5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });

    it("can branch to a negative offset", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchEqualInstruction(1, 2, 3);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET - 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 600);
        fixture.setRegister(RegisterType.Data, 2, 600);
        fixture.setRegister(RegisterType.Data, 3, -5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });

    it("won't branch when registers are not equal", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchEqualInstruction(1, 2, 3);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 600);
        fixture.setRegister(RegisterType.Data, 2, 300);
        fixture.setRegister(RegisterType.Data, 3, 5);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'IP')![1][0]).to.equal(expectedAddress);
    });
});
