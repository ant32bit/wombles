import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ExecuteInterruptInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("exi instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x0285;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ExecuteInterruptInstruction);
        expect(decoded).is.equals('exi 5');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('exi 5');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ExecuteInterruptInstruction);
        expect(encoded).is.equals(0x0285);
    });

    it("can trigger an interrupt", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new ExecuteInterruptInstruction(5);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 15, 0xDEADBEEF);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.interrupts).to.deep.equal([[5, 0xDEADBEEF]]);
    });
});
