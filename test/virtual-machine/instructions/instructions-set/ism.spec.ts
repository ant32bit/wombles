import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ImmediateSetMemoryInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("ism instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x318B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ImmediateSetMemoryInstruction);
        expect(decoded).is.equals('ism $1, 139');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('ism $1, 139');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ImmediateSetMemoryInstruction);
        expect(encoded).is.equals(0x318B);
    });

    it("can set memory", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new ImmediateSetMemoryInstruction(1, 100);

        const destinationAddress = 0x8000015F;

        fixture.memory.writeNumber(destinationAddress, 1, 30);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, destinationAddress);
        fixture.run();

        const actualValue = fixture.memory.readNumber(destinationAddress, 1);

        expect(actualValue).to.equal(100);
    });
});
