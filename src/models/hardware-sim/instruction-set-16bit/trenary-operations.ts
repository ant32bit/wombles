import { IInstruction } from "./instruction-interface";

type Trenary = (lhs: number, rhs: number) => number;
const ops: [mnemonic: string, func: Trenary][] = [
    ['add', (l,r) => l + r],
    ['sub', (l,r) => l - r],
    ['mul', (l,r) => l * r],
    ['div', (l,r) => l / r],
    ['mod', (l,r) => l % r],
    ['and', (l,r) => l !== 0 && r !== 0 ? 1 : 0],
    ['nor', (l,r) => l !== 0 || r!== 0 ? 1 : 0],
    ['xor', (l,r) => (l !== 0  && r !== 0 ) || (l !== 0  || r !== 0 ) ? 1 : 0],
    ['not', (l,r) => l === 0 ? 1 : 0],
    ['bnd', (l,r) => l & r],
    ['bor', (l,r) => l | r],
    ['bxr', (l,r) => l ^ r],
    ['bnt', (l,r) => ~l],
    ['lsh', (l,r) => l << r],
    ['rsh', (l,r) => l >>> r],   
]

export class TrenaryOperation implements IInstruction {
    public mnemonic: string;
    private fn: Trenary;

    constructor(public opcode: number, public opsubcode: number, public Rd: number, public Rl: number, public Rr: number) {
        [this.mnemonic, this.fn] = ops[opsubcode - 1];
    }
}