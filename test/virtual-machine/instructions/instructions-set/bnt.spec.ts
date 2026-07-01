import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BinaryNotInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("bnt instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x7448;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BinaryNotInstruction);
        expect(decoded).is.equals('bnt $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bnt $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BinaryNotInstruction);
        expect(encoded).is.equals(0x7448);
    });

    // b 0001 0010 0100 1000 1001 1010 1100 0011
    // b 1110 1101 1011 0111 0110 0101 0011 1100
    it("can perform a binary not on two numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BinaryNotInstruction(1, 2);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0x12489AC3);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'R')![1][1]).to.equal(0xEDB7653C);
    });
});
