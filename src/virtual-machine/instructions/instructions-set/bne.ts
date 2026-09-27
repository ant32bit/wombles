import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class BranchNotEqualInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0x8400;
    public static OPCODE: string = 'bne';
    public static PATTERN: string = '$x, $y, $z';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [0, 15], z:[1, 3] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _lhsRegister: number;
    private _rhsRegister: number;
    private _offsetRegister: number;

    constructor(lhsRegister: number, rhsRegister: number, offsetRegister: number) {
        this._lhsRegister = lhsRegister;
        this._rhsRegister = rhsRegister;
        this._offsetRegister = offsetRegister;
    }

    public decode(): string {
        return `${BranchNotEqualInstruction.OPCODE} $${this._lhsRegister}, $${this._rhsRegister}, $${this._offsetRegister}`;
    }

    public encode(): number {
        const args = [this._lhsRegister, this._rhsRegister, this._offsetRegister]
        return pack(BranchNotEqualInstruction.HEAD, BranchNotEqualInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {
        const lhsResolver = process.getRegisterResolver(RegisterType.Data, this._lhsRegister);
        const rhsResolver = process.getRegisterResolver(RegisterType.Data, this._rhsRegister);

        const lhs = lhsResolver.resolveGet(memory);
        const rhs = rhsResolver.resolveGet(memory);

        if (lhs !== rhs) {
            const offsetResolver = process.getRegisterResolver(RegisterType.Data, this._offsetRegister);
            const offset = offsetResolver.resolveGetSigned(memory);

            const ipResolver = process.getRegisterResolver(RegisterType.InstructionPointer);
            const ip = ipResolver.resolveGet(memory);
            ipResolver.resolveSet(memory, ip + (offset * 2));
        }
    }

    public description(): string {
        return `If $${this._lhsRegister} ≠ $${this._rhsRegister} jump to the instruction $${this._offsetRegister} away.`
    }
}
