import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, MemoryRequestInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("mrq instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x010A;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(MemoryRequestInstruction);
        expect(decoded).is.equals('mrq $1, $2');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('mrq $1, $2');
        const encoded = actual!.encode();

        expect(actual).instanceOf(MemoryRequestInstruction);
        expect(encoded).is.equals(0x010A);
    });

    it("can allocate memory", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new MemoryRequestInstruction(1, 2);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 2, 4);

        const dumpBeforeRun = fixture.memory.dump();

        fixture.run();

        const dumpAfterRun = fixture.memory.dump();

        expect(dumpBeforeRun.heaps.length).to.equal(0);
        expect(dumpAfterRun.heaps.length).to.equal(1);

        expect(dumpAfterRun.heaps[0].length).to.equal(3);

        const addressInRegister = fixture.getRegister(RegisterType.Data, 1);
        const addressInHeap = dumpAfterRun.heaps[0][1][1] + 0x80000000;

        expect(addressInRegister).to.equal(addressInHeap);
    });

    it("can set a null pointer if there is no memory available", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new MemoryRequestInstruction(1, 2);

        // eat all available memory
        fixture.memory.reserveHeap(1, 256);
        fixture.memory.reserveHeap(1, 256);
        fixture.memory.reserveHeap(1, 256);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 2, 4);

        const dumpBeforeRun = fixture.memory.dump();

        fixture.run();

        const addressInRegister = fixture.getRegister(RegisterType.Data, 1);

        expect(addressInRegister).to.equal(0);
    });
});
