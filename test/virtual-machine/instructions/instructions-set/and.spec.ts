import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, LogicalAndInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("and instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x584B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(LogicalAndInstruction);
        expect(decoded).is.equals('and $1, $2, $3');
    });

    it("can be encoded", () => {
        const actual = InstructionEncoder.encode('and $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(LogicalAndInstruction);
        expect(encoded).is.equals(0x584B);
    });

    for (const a of [[0,0,0],[0,1,0],[1,0,0],[1,1,1]])
        it(`can logically and numbers (${a[0]} & ${a[1]} = ${a[2]})`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new LogicalAndInstruction(1, 2, 3);

            fixture.setInstruction(instruction);
            fixture.setRegister(RegisterType.Data, 1, a[0]);
            fixture.setRegister(RegisterType.Data, 2, a[1]);
            fixture.run();

            const dump = fixture.cpu.dump();

            expect(dump.registers[0].find(d => d[0] == 'R')![1][2]).to.equal(a[2]);
        });
});
