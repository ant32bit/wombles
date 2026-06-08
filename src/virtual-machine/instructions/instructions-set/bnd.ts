import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class BinaryAndInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0x6800;
    public static OPCODE: string = 'bnd';
    public static PATTERN: string = '$x, $y, $z';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [0, 15], z:[1, 3] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _rhsRegister: number;
    private _lhsRegister: number;
    private _destinationRegister: number;

    constructor(rhsRegister: number, lhsRegister: number, destinationRegister: number) {
        this._rhsRegister = rhsRegister;
        this._lhsRegister = lhsRegister;
        this._destinationRegister = destinationRegister;
    }

    public decode(): string {
        return `${BinaryAndInstruction.OPCODE} $${this._rhsRegister}, $${this._lhsRegister}, $${this._destinationRegister}`;
    }

    public encode(): number {
        const args = [this._rhsRegister, this._lhsRegister, this._destinationRegister]
        return pack(BinaryAndInstruction.HEAD, BinaryAndInstruction.PACK, args);
    }
}
