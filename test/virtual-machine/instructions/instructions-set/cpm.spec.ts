import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, CopyMemoryInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("cpm instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x2812;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(CopyMemoryInstruction);
        expect(decoded).is.equals('cpm $1, $2');
    });

    it("can be encoded", () => {
        const actual = InstructionEncoder.encode('cpm $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(CopyMemoryInstruction);
        expect(encoded).is.equals(0x2812);
    });

    it("can copy memory", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new CopyMemoryInstruction(1, 2);

        const sourceAddress = 0x80000270;
        const destinationAddress = 0x8000015F;

        fixture.memory.writeNumber(sourceAddress, 1, 0x4B);
        fixture.memory.writeNumber(destinationAddress, 1, 0x00);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, sourceAddress);
        fixture.setRegister(RegisterType.Data, 2, destinationAddress);
        fixture.run();

        const actualValue = fixture.memory.readNumber(destinationAddress, 1);

        expect(actualValue).to.equal(0x4B);
    });

    it("won't copy from an invalid address", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new CopyMemoryInstruction(1, 2);

        const sourceAddress = 0x00000270;
        const destinationAddress = 0x8000015F;

        fixture.memory.writeNumber(sourceAddress, 1, 0x4B);
        fixture.memory.writeNumber(destinationAddress, 1, 0x00);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, sourceAddress);
        fixture.setRegister(RegisterType.Data, 2, destinationAddress);
        fixture.run();

        const actualValue = fixture.memory.readNumber(destinationAddress, 1);
        expect(actualValue).to.equal(0x00);
    });
});
