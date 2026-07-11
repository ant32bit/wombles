import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, EndOfInterruptInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping, RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("eoi instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x0296;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(EndOfInterruptInstruction);
        expect(decoded).is.equals('eoi 6');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('eoi 6');
        const encoded = actual!.encode();

        expect(actual).instanceOf(EndOfInterruptInstruction);
        expect(encoded).is.equals(0x0296);
    });

    for (const i of [0,1,2,3,4,5,6,7])
        it(`can jump back to the address in J${i} register`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new EndOfInterruptInstruction(i);
            const jumpBackAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 10;

            fixture.setInstruction(instruction);

            fixture.startProcess();
            fixture.setRegister(RegisterType.JumpBack, i, jumpBackAddress);

            fixture.run();

            const actualPointer = fixture.getRegister(RegisterType.InstructionPointer);
            const JumpBackRegister = fixture.getRegister(RegisterType.JumpBack, i);

            expect(actualPointer).to.equal(jumpBackAddress);
            expect(JumpBackRegister).to.equal(0);
        });

    for (const i of [0,1,2,3,4,5,6,7])
        it(`won't jump back if J${i} = 0`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new EndOfInterruptInstruction(i);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

            fixture.setInstruction(instruction);

            fixture.startProcess();
            fixture.setRegister(RegisterType.JumpBack, i, 0);

            fixture.run();

            const actualPointer = fixture.getRegister(RegisterType.InstructionPointer);
            expect(actualPointer).to.equal(expectedAddress);
        });
});
