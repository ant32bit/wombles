import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, BinaryOrInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("bor instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x6C4B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(BinaryOrInstruction);
        expect(decoded).is.equals('bor $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('bor $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(BinaryOrInstruction);
        expect(encoded).is.equals(0x6C4B);
    });

    // b 0011 0101 0110 1001 1010 1100 1100 0011
    // b 0101 0011 0011 0011 0011 0101 1010 1010
    // b 0111 0111 0111 1011 1011 1101 1110 1011
    it("can perform a binary or on two numbers", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new BinaryOrInstruction(1, 2, 3);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, 0x3569ACC3);
        fixture.setRegister(RegisterType.Data, 2, 0x533335AA);
        fixture.run();

        const dump = fixture.cpu.dump();

        expect(dump.registers[0].find(d => d[0] == 'R')![1][2]).to.equal(0x777BBDEB);
    });
});
