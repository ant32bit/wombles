import { RandomAccessMemory } from "../../memory/random-access-memory";
import { Process, RegisterType } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class MemoryFreeInstruction implements IInstruction {

    public static MASK: number = 0xFFC0;
    public static PACK: number[] = [10,2,4];
    public static HEAD: number = 0x0140;
    public static OPCODE: string = 'mfr';
    public static PATTERN: string = '$x';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!); }

    private _pointerRegister: number;

    constructor(pointerRegister: number) {
        this._pointerRegister = pointerRegister;
    }

    public decode(): string {
        return `${MemoryFreeInstruction.OPCODE} $${this._pointerRegister}`;
    }

    public encode(): number {
        const args = [0, this._pointerRegister]
        return pack(MemoryFreeInstruction.HEAD, MemoryFreeInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

