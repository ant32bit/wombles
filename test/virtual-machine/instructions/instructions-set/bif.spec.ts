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

    it("can jump to a negative offset", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfFalseInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET - 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.setRegister(RegisterType.Data, 2, -5);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
        expect(actualResult).to.equal(expectedAddress);
    });

    it("will jump because 0 is false", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfFalseInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.setRegister(RegisterType.Data, 2, 5);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
        expect(actualResult).to.equal(expectedAddress);
    });

    for (const i of [1, -1, 600, -600])
        it(`won't jump because ${i} is true`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new BranchIfFalseInstruction(1, 2);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i);
            fixture.setRegister(RegisterType.Data, 2, 5);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
            expect(actualResult).to.equal(expectedAddress);
        });
});
