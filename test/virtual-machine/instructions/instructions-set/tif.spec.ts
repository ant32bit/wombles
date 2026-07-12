import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestIfFalseInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("tif instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xBC48;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestIfFalseInstruction);
        expect(decoded).is.equals('tif $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tif $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestIfFalseInstruction);
        expect(encoded).is.equals(0xBC48);
    });

    it(`can set to true because 0 = 0`, () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new TestIfFalseInstruction(1, 2);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 2);
        expect(actualResult).to.equal(1);
    });

    for (const i of [1, -1, 600, -600])
        it(`can set to false because ${i} ≠ 0`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new TestIfFalseInstruction(1, 2);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.Data, 2);
            expect(actualResult).to.equal(0);
        });
});
