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

    for (const i of [1, -1, 600, -600])
        it(`will jump because ${i} is true`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new BranchIfTrueInstruction(1, 2);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i);
            fixture.setRegister(RegisterType.Data, 2, 5);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
            expect(actualResult).to.equal(expectedAddress);
        });

    it("won't jump because 0 is false", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BranchIfTrueInstruction(1, 2);
        const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.setRegister(RegisterType.Data, 2, 5);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.InstructionPointer);
        expect(actualResult).to.equal(expectedAddress);
    });
});
