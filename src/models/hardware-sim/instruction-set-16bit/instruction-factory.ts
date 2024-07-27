import { IInstruction } from './instruction-interface';
import { AllocFromHeap, BranchIf, Clear, CopyTo, CreateProcess, EndCurrentProcess, EndOfInterrupt, ExpressInterrupt, FreeAllocatedAtLoc, JumpBackFromInterrupt, JumpIf, JumpToOnInterrupt, LoadFromMemory, NoOperation, SetImmediate, SleepForClicks, StackPopInstruction, StackPushInstruction, StartProcess, StoreToMemory, TestCompare, TrenaryOperation } from './instructions';

export { IInstruction };

// 0 0000  4 0100  8 1000  C 1100
// 1 0001  5 0101  9 1001  D 1101
// 2 0010  6 0110  A 1010  E 1110
// 3 0011  7 0111  B 1011  F 1111

type InstrDef = (components: number[]) => IInstruction;
type MaskSet = [mask: number, [expected: number, packs: number[], defFn: InstrDef][]];

const masks: MaskSet[] = [
    [0xFFF0, [
        [0x02E0, [6,6,4], c => new StackPushInstruction(c[0], c[1], c[2])],
        [0x02F0, [6,6,4], c => new StackPopInstruction(c[0], c[1], c[2])],
    ]],
    [0xFFE0, [
        [0x0280, [6,5,3,2], c => new ExpressInterrupt(c[0], c[1], c[2])],
        [0x02A0, [6,5,5], c => new EndOfInterrupt(c[0], c[1])],
        [0x02C0, [6,5,3,2], c => new JumpToOnInterrupt(c[0], c[1], c[2])],
        [0x02E0, [6,5,5], c => new JumpBackFromInterrupt(c[0], c[1])],
    ]],
    [0xFFC0, [
        [0x0100, [6,4,2,4], c => new AllocFromHeap(c[0], c[1], c[2], c[3])],
        [0x0140, [6,4,2,4], c => new FreeAllocatedAtLoc(c[0], c[1], c[3])],
        [0x0180, [6,4,2,2,2], c => new CreateProcess(c[0], c[1], c[2], c[3], c[4])],
        [0x01C0, [6,4,2,4], c => new StartProcess(c[0], c[1], c[3])],
    ]],
    [0xFF80, [
        [0x0000, [6,3,7], c => new NoOperation(c[0], c[1])],
        [0x0080, [6,3,7], c => new EndCurrentProcess(c[0], c[1], c[2])],
        [0x0200, [6,3,7], c => new SleepForClicks(c[0], c[1], c[2])],
    ]],
    [0xF000, [
        [0x4000, [2,2,2,2,4,4], c => new LoadFromMemory(c[0], c[1], c[2], c[3], c[4], c[5])],
        [0x5000, [2,2,2,2,4,4], c => new StoreToMemory(c[0], c[1], c[2], c[3], c[4], c[5])],
        [0x6000, [2,2,2,2,4,4], c => new CopyTo(c[0], c[1], c[2], c[3], c[4], c[5])],
        [0x7000, [2,2,2,2,4,4], c => new Clear(c[0], c[1], c[2], c[3], c[4])],
        [0x8000, [3,1,3,3,3,3], c => new JumpIf(c[0], c[1], c[2], c[3], c[4], c[5])],
        [0x9000, [3,1,3,3,3,3], c => new BranchIf(c[0], c[1], c[2], c[3], c[4], c[5])],
    ]],
    [0xE000, [
        [0xA000, [3,3,2,4,4], c => new TestCompare(c[0], c[1], c[2], c[3], c[4])],
    ]],
    [0xC000, [
        [0x0000, [2,4,2,4,4], c => new TrenaryOperation(c[0], c[1], c[2], c[3], c[4])],
        [0xC000, [2,2,4,8], c => new SetImmediate(c[0], c[1], c[2], c[3])],
    ]]
];


export class InstructionFactory {
    public interpret(mem: number): IInstruction {
        return this.decipher(mem, masks) ?? new NoOperation(mem, 0);
    }

    private decipher(value: number, masks: MaskSet[]): IInstruction | undefined {
        for(const maskSet of masks) {
            var checkVal = value | maskSet[0];

            for(const [expected, packs, ctor] of maskSet[1]) {
                if (checkVal !== expected)
                    continue;
                
                try {
                    return ctor(this.unpack(value, [16, ...packs]).splice(1));
                }
                catch {
                    // could not create
                }
            }
        }

        return undefined;
    }

    private unpack(value: number, sizes: number[]): number[] {
        const components: number[] = [];
        let pack = value;
        for (let i = sizes.length - 1; i >= 0; i--) {
            const size = sizes[i];
            const mask = (1 << size) - 1;
            components.unshift(pack & mask);
            pack = pack >>> size;
        }
        return components;
    }
}
