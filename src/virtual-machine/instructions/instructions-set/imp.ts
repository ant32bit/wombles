import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class IncrementMemoryPointerInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,6];
    public static HEAD: number = 0x2C00;
    public static OPCODE: string = 'imp';
    public static PATTERN: string = '$x, y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15], y: [0, 63] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _pointerRegister: number;
    private _valueSize: number;

    constructor(pointerRegister: number, valueSize: number) {
        this._pointerRegister = pointerRegister;
        this._valueSize = valueSize;
    }

    public decode(): string {
        return `${IncrementMemoryPointerInstruction.OPCODE} $${this._pointerRegister}, ${this._valueSize}`;
    }

    public encode(): number {
        const args = [this._pointerRegister, this._valueSize];
        return pack(IncrementMemoryPointerInstruction.HEAD, IncrementMemoryPointerInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

