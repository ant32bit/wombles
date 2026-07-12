import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, StoreToMemoryInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("stm instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x2463;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(StoreToMemoryInstruction);
        expect(decoded).is.equals('stm $1[2], $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('stm $1[2], $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(StoreToMemoryInstruction);
        expect(encoded).is.equals(0x2463);
    });

    it("will write to memory from a register", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new StoreToMemoryInstruction(1, 2, 3);

        const destinationAddress = 0x80000270;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0xA1B2C3D4);
        fixture.setRegister(RegisterType.Data, 3, destinationAddress);
        fixture.run();

        const actualValue = fixture.memory.readNumber(destinationAddress, 1);
        expect(actualValue).to.equal(0xC3);
    });

    it("will not die if the memory address is invalid", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new StoreToMemoryInstruction(1, 2, 3);

        const destinationAddress = 0x80000270;

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0xA1B2C3D4);
        fixture.setRegister(RegisterType.Data, 3, 0);
        fixture.run();
    });
});
