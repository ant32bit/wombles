import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LogicalOrInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("ior instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x5C4B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LogicalOrInstruction);
        expect(decoded).is.equals('ior $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('ior $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LogicalOrInstruction);
        expect(encoded).is.equals(0x5C4B);
    });

    for (const a of [[0,0,0],[0,1,1],[1,0,1],[1,1,1]])
        it(`can logically or numbers (${a[0]} & ${a[1]} = ${a[2]})`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new LogicalOrInstruction(1, 2, 3);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, a[0]);
            fixture.setRegister(RegisterType.Data, 2, a[1]);
            fixture.run();

            const actualResult = fixture.getRegister(RegisterType.Data, 3);
            expect(actualResult).to.equal(a[2]);
        });
});
