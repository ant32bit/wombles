import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestIfTrueInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("tit instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xB848;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestIfTrueInstruction);
        expect(decoded).is.equals('tit $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tit $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestIfTrueInstruction);
        expect(encoded).is.equals(0xB848);
    });

    for (const i of [1, -1, 600, -600])
        it(`can set to true because ${i} is true`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new TestIfTrueInstruction(1, 2);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.Data, 2);
            expect(actualResult).to.equal(1);
        });

    it(`can set to false because 0 is false`, () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new TestIfTrueInstruction(1, 2);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0);
        fixture.run();

        const actualResult = fixture.getRegister(RegisterType.Data, 2);
        expect(actualResult).to.equal(0);
    });
});
