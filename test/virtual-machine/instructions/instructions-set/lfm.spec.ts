import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LoadFromMemoryInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("cpm instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x204B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LoadFromMemoryInstruction);
        expect(decoded).is.equals('lfm $1, $2[3]');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('lfm $1, $2[3]');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LoadFromMemoryInstruction);
        expect(encoded).is.equals(0x204B);
    });

    for (const i of [[0, 0xE5B2C3D4], [1, 0xA1E5C3D4], [2, 0xA1B2E5D4], [3, 0xA1B2C3E5]])
        it(`will load from memory to index ${i[0]}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new LoadFromMemoryInstruction(1, 2, i[0]);

            const sourceAddress = 0x80000270;

            fixture.memory.writeNumber(sourceAddress, 1, 0xE5);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, sourceAddress);
            fixture.setRegister(RegisterType.Data, 2, 0xA1B2C3D4);
            fixture.run();

            const actualValue = fixture.getRegister(RegisterType.Data, 2);

            expect(actualValue).to.equal(i[1]);
        });

    it("can set to zero for an invalid address", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new LoadFromMemoryInstruction(1, 2, 2);

        const sourceAddress = 0x00000270;

        fixture.memory.writeNumber(sourceAddress, 1, 0x4B);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, sourceAddress);
        fixture.setRegister(RegisterType.Data, 2, 0xA1B2C3D4);
        fixture.run();

        const actualValue = fixture.getRegister(RegisterType.Data, 2);
        expect(actualValue).to.equal(0xA1B200D4);
    });
});
