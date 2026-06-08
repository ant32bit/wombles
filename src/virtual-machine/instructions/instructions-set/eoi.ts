import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class EndOfInterruptInstruction implements IInstruction {

    public static MASK: number = 0xFFF8;
    public static PACK: number[] = [13, 3];
    public static HEAD: number = 0x0290;
    public static OPCODE: string = 'eoi';
    public static PATTERN: string = 'x';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 7] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!); }

    private _interruptCode: number;

    constructor(interruptCode: number) {
        this._interruptCode = interruptCode;
    }

    public decode(): string {
        return `${EndOfInterruptInstruction.OPCODE} ${this._interruptCode}`;
    }

    public encode(): number {
        const args = [this._interruptCode]
        return pack(EndOfInterruptInstruction.HEAD, EndOfInterruptInstruction.PACK, args);
    }
}
