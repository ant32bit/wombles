import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class CopyMemoryInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,2,4,4];
    public static HEAD: number = 0x2800;
    public static OPCODE: string = 'cpm';
    public static PATTERN: string = '$x, $y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15], y: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _sourcePointerRegister: number;
    private _destinationPointerRegister: number;

    constructor(sourcePointerRegister: number, destinationPointerRegister: number) {
        this._sourcePointerRegister = sourcePointerRegister;
        this._destinationPointerRegister = destinationPointerRegister;
    }

    public decode(): string {
        return `${CopyMemoryInstruction.OPCODE} $${this._sourcePointerRegister}, $${this._destinationPointerRegister}`;
    }

    public encode(): number {
        const args = [0, this._sourcePointerRegister, this._destinationPointerRegister]
        return pack(CopyMemoryInstruction.HEAD, CopyMemoryInstruction.PACK, args);
    }
}
