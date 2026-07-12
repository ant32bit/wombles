import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, StackPopInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("pop instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x02F1;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(StackPopInstruction);
        expect(decoded).is.equals('pop $1');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('pop $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(StackPopInstruction);
        expect(encoded).is.equals(0x02F1);
    });

    it("can pop from the stack", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new StackPopInstruction(12);

        fixture.setInstruction(instruction);

        // push to stack;
        const stackPointer = fixture.getRegister(RegisterType.StackPointer);
        fixture.setRegister(RegisterType.StackPointer, 0, stackPointer - 4);
        fixture.memory.writeNumber(stackPointer - 4, 4, 0xDEADBEEF);

        fixture.run();

        var stackPointerAfterRun = fixture.getRegister(RegisterType.StackPointer);
        var register12 = fixture.getRegister(RegisterType.Data, 12);

        expect(stackPointerAfterRun).to.equal(stackPointer);
        expect(register12).to.equal(0xDEADBEEF);
    });
});
