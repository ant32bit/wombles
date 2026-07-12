import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, StackPushInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("psh instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02E1;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(StackPushInstruction);
        expect(decoded).is.equals('psh $1');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('psh $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(StackPushInstruction);
        expect(encoded).is.equals(0x02E1);
    });

    it("can push to the stack", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new StackPushInstruction(12);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 12, 0xDEADBEEF);

        const expectedStackPointer = fixture.getRegister(RegisterType.StackPointer) - 4;

        fixture.run();

        var stackPointerAfterRun = fixture.getRegister(RegisterType.StackPointer);
        var stackValue = fixture.memory.readNumber(stackPointerAfterRun, 4);

        expect(stackPointerAfterRun).to.equal(expectedStackPointer);
        expect(stackValue).to.equal(0xDEADBEEF);
    });
});
