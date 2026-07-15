import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BranchGreaterThanInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("bgt instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x904B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BranchGreaterThanInstruction);
        expect(decoded).is.equals('bgt $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bgt $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BranchGreaterThanInstruction);
        expect(encoded).is.equals(0x904B);
    });

    it("can jump to a negative offset", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchGreaterThanInstruction(1, 2, 3);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET - 10;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 700);
        fixture.setRegister(RegisterType.Data, 2, 600);
        fixture.setRegister(RegisterType.Data, 3, -5);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
        expect(actualResult).to.equal(expectedAddress);
    });

    for (const i of [[0, -1], [600, 300]])
        it(`will jump because ${i[0]} > ${i[1]}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new BranchGreaterThanInstruction(1, 2, 3);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i[0]);
            fixture.setRegister(RegisterType.Data, 2, i[1]);
            fixture.setRegister(RegisterType.Data, 3, 5);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
            expect(actualResult).to.equal(expectedAddress);
        });

    for (const i of [[0, 1], [600, 600], [-600, 600]])
        it(`won't jump because ${i[0]} ≤ ${i[1]}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new BranchGreaterThanInstruction(1, 2, 3);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i[0]);
            fixture.setRegister(RegisterType.Data, 2, i[1]);
            fixture.setRegister(RegisterType.Data, 3, 5);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
            expect(actualResult).to.equal(expectedAddress);
        });
});
