import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, IncrementMemoryPointerInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("imp instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x2C50;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(IncrementMemoryPointerInstruction);
        expect(decoded).is.equals('imp $1, 16');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('imp $1, 16');
        const encoded = actual!.encode();

        expect(actual).instanceOf(IncrementMemoryPointerInstruction);
        expect(encoded).is.equals(0x2C50);
    });

    for (const i of [1,2,4,8])
        it(`can increment the address in a register by ${i}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new IncrementMemoryPointerInstruction(12, i);

            const address = 0x8000015F;
            const expectedAddress = address + i;

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 12, address)
            fixture.run();

            const actualRegister = fixture.getRegister(RegisterType.Data, 12);
            expect(actualRegister).to.equal(expectedAddress);
        });
});
