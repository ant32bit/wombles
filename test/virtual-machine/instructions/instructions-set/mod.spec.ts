import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, ModulusInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor";

describe("mod instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x544B;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(ModulusInstruction);
        expect(decoded).is.equals('mod $1, $2, $3');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('mod $1, $2, $3');
        const encoded = actual!.encode();

        expect(actual).instanceOf(ModulusInstruction);
        expect(encoded).is.equals(0x544B);
    });

    for(const i of [
        [7, 3, 1], [7, -3, -2], [-7, 3, 2], [-7, -3, -1],
        [8, 2, 0], [8, -2,  0], [-8, 2, 0], [-8, -2,  0]
    ])
        it("can modulus two numbers", () => {
                const fixture = new VirtualMachineFixture();
                const instruction = new ModulusInstruction(1, 2, 3);

                fixture.setInstruction(instruction);
                fixture.setRegister(RegisterType.Data, 1, i[0]);
                fixture.setRegister(RegisterType.Data, 2, i[1]);
                fixture.run();

                const actualResult = fixture.getRegister(RegisterType.Data, 3);
                expect(actualResult).to.equal(i[2] >>> 0);
            });
});
