import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class TestGreaterThanInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0xB000;
    public static OPCODE: string = 'tgt';
    public static PATTERN: string = '$x, $y, $z';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [0, 15], z:[1, 3] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _lhsRegister: number;
    private _rhsRegister: number;
    private _destinationRegister: number;

    constructor(lhsRegister: number, rhsRegister: number, destinationRegister: number) {
        this._lhsRegister = lhsRegister;
        this._rhsRegister = rhsRegister;
        this._destinationRegister = destinationRegister;
    }

    public decode(): string {
        return `${TestGreaterThanInstruction.OPCODE} $${this._lhsRegister}, $${this._rhsRegister}, $${this._destinationRegister}`;
    }

    public encode(): number {
        const args = [this._lhsRegister, this._rhsRegister, this._destinationRegister]
        return pack(TestGreaterThanInstruction.HEAD, TestGreaterThanInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {
        const lhsResolver = process.getRegisterResolver(RegisterType.Data, this._lhsRegister);
        const rhsResolver = process.getRegisterResolver(RegisterType.Data, this._rhsRegister);
        const destResolver = process.getRegisterResolver(RegisterType.Data, this._destinationRegister);

        const lhs = lhsResolver.resolveGetSigned(memory);
        const rhs = rhsResolver.resolveGetSigned(memory);

        destResolver.resolveSet(memory, lhs > rhs ? 1 : 0);
    }

    public description(): string {
        return `Test that $${this._lhsRegister} > $${this._rhsRegister} and store the result in $${this._destinationRegister}.`
    }
}

