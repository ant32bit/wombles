import { expect } from "chai";
import { InstructionDecoder, InstructionEncoder, MemoryFreeInstruction } from "../../../../src/virtual-machine/instructions";
import { VirtualMachineFixture } from "./_fixture";
import { RegisterType } from "../../../../src/virtual-machine/processor/process-mapping";

describe("mfr instruction", () => {
    it("can be decoded", () => {
        const instruction = 0x0141;
        const actual = InstructionDecoder.decode(instruction);
        const decoded = actual!.decode();

        expect(actual).instanceOf(MemoryFreeInstruction);
        expect(decoded).is.equals('mfr $1');
    });

    it("can be encoded", () => {

        const actual = InstructionEncoder.encode('mfr $1');
        const encoded = actual!.encode();

        expect(actual).instanceOf(MemoryFreeInstruction);
        expect(encoded).is.equals(0x0141);
    });

    it("can free memory", () => {
        const fixture = new VirtualMachineFixture();
        const instruction = new MemoryFreeInstruction(1);

        const address = fixture.memory.reserveHeap(fixture.process.processId, 2);

        fixture.setInstruction(instruction);
        fixture.setRegister(RegisterType.Data, 1, address!);

        const dumpBeforeRun = fixture.memory.dump();

        fixture.run();

        const dumpAfterRun = fixture.memory.dump();

        expect(dumpBeforeRun.heaps[0].length).to.equal(3);
        expect(dumpAfterRun.heaps[0].length).to.equal(1);
    });
});
