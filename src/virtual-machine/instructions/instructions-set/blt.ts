import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class BranchLessThanInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0x9400;
    public static OPCODE: string = 'blt';
    public static PATTERN: string = '$x, $y, $z';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [0, 15], z:[1, 3] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _rhsRegister: number;
    private _lhsRegister: number;
    private _offsetRegister: number;

    constructor(rhsRegister: number, lhsRegister: number, offsetRegister: number) {
        this._rhsRegister = rhsRegister;
        this._lhsRegister = lhsRegister;
        this._offsetRegister = offsetRegister;
    }

    public decode(): string {
        return `${BranchLessThanInstruction.OPCODE} $${this._rhsRegister}, $${this._lhsRegister}, $${this._offsetRegister}`;
    }

    public encode(): number {
        const args = [this._rhsRegister, this._lhsRegister, this._offsetRegister]
        return pack(BranchLessThanInstruction.HEAD, BranchLessThanInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {
        const rhsResolver = process.getRegisterResolver(RegisterType.Data, this._rhsRegister);
        const lhsResolver = process.getRegisterResolver(RegisterType.Data, this._lhsRegister);

        const rhs = rhsResolver.resolveGet(memory);
        const lhs = lhsResolver.resolveGet(memory);

        if (rhs < lhs) {
            const offsetResolver = process.getRegisterResolver(RegisterType.Data, this._offsetRegister);
            const offset = offsetResolver.resolveGet(memory) + 0;

            const ipResolver = process.getRegisterResolver(RegisterType.InstructionPointer);
            const ip = ipResolver.resolveGet(memory);
            ipResolver.resolveSet(memory, ip + (offset * 2));
        }
    }
}
