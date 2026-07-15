import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchNotEqualInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("bne instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x844B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchNotEqualInstruction);
        expect(decoded).is.equals('bne $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bne $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchNotEqualInstruction);
        expect(encoded).is.equals(0x844B);
    });

    it("can branch to a negative offset", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchNotEqualInstruction(1, 2, 3);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET - 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 300);
        fixture.setRegister(RegisterType.Data, 2, 600);
        fixture.setRegister(RegisterType.Data, 3, -5);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
        expect(actualResult).to.equal(expectedAddress);
    });

    for (const i of [[0, -1], [600, -600]])
        it(`will jump because ${i[0]} ≠ ${i[1]}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new BranchNotEqualInstruction(1, 2, 3);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i[0]);
            fixture.setRegister(RegisterType.Data, 2, i[1]);
            fixture.setRegister(RegisterType.Data, 3, 5);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
            expect(actualResult).to.equal(expectedAddress);
        });

    for (const i of [0, 600, -600])
        it(`won't jump because ${i} = ${i}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new BranchNotEqualInstruction(1, 2, 3);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i);
            fixture.setRegister(RegisterType.Data, 2, i);
            fixture.setRegister(RegisterType.Data, 3, 5);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
            expect(actualResult).to.equal(expectedAddress);
        });
});
