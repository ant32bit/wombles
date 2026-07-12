import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, TestNotEqualInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("tne instruction", () => {
    it("can be decoded", () => {
        const instruction = 0xA44B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(TestNotEqualInstruction);
        expect(decoded).is.equals('tne $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('tne $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(TestNotEqualInstruction);
        expect(encoded).is.equals(0xA44B);
    });

    for (const i of [[0, -1], [600, -600]])
        it(`can set to true because ${i[0]} ≠ ${i[1]}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new TestNotEqualInstruction(1, 2, 3);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i[0]);
            fixture.setRegister(RegisterType.Data, 2, i[1]);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.Data, 3);
            expect(actualResult).to.equal(1);
        });

    for (const i of [0, 600, -600])
        it(`can set to false because ${i} = ${i}`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new TestNotEqualInstruction(1, 2, 3);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, i);
            fixture.setRegister(RegisterType.Data, 2, i);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.Data, 3);
            expect(actualResult).to.equal(0);
        });
});
