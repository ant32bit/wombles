import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LogicalNotInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("not instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x6448;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LogicalNotInstruction);
        expect(decoded).is.equals('not $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('not $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LogicalNotInstruction);
        expect(encoded).is.equals(0x6448);
    });

    for (const a of [[0,1],[1,0]])
        it(`can logically not numbers (!${a[0]} = ${a[1]})`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new LogicalNotInstruction(1, 2);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, a[0]);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.Data, 2);
            expect(actualResult).to.equal(a[1]);
        });
});
