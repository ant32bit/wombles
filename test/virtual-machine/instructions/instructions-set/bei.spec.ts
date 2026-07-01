import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BeginInterruptInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { ProcessMapping } from "../../../../src/virtual-machine/processor";

describe("bei instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x028F;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BeginInterruptInstruction);
        expect(decoded).is.equals('bei 7');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bei 7');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BeginInterruptInstruction);
        expect(encoded).is.equals(0x028F);
    });

    it("can expose the interrupt code", () => {
        const instruction = new BeginInterruptInstruction(5);
        expect(instruction.getInterruptCode()).to.equal(5);
    });

    for (const i of [0,1,2,3,4,5,6,7])
        it(`can set the I${i} register`, () => {
            const fixture = new VirtualMachineFixture();
            const instruction = new BeginInterruptInstruction(i);
            const expectedAddress = (fixture.process.address >>> 0) + ProcessMapping.INSTRUCTIONS_OFFSET + 2;

            fixture.setInstruction(instruction);
            fixture.run();

            const dump = fixture.cpu.dump();

            expect(dump.registers[0].find(d => d[0] == 'I')![1][i]).to.equal(expectedAddress);
        });
});
