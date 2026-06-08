import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class ProcessStartInstruction implements IInstruction {

    public static MASK: number = 0xFFC0;
    public static PACK: number[] = [10,2,4];
    public static HEAD: number = 0x01C0;
    public static OPCODE: string = 'pst';
    public static PATTERN: string = '$x';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!); }

    private _pidRegister: number;

    constructor(pidRegister: number) {
        this._pidRegister = pidRegister;
    }

    public decode(): string {
        return `${ProcessStartInstruction.OPCODE} $${this._pidRegister}`;
    }

    public encode(): number {
        const args = [0, this._pidRegister]
        return pack(ProcessStartInstruction.HEAD, ProcessStartInstruction.PACK, args);
    }
}
