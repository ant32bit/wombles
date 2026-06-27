import { RandomAccessMemory } from "../../memory/random-access-memory";
import { Process, RegisterType } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class LoadFromMemoryInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0x2000;
    public static OPCODE: string = 'lfm';
    public static PATTERN: string = '$x, $y[z]';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15], y: [1, 15], z:[0, 3] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _sourcePointerRegister: number;
    private _destinationRegister: number;
    private _destinationIndex: number;

    constructor(sourcePointerRegister: number, destinationRegister: number, destinationIndex: number) {
        this._sourcePointerRegister = sourcePointerRegister;
        this._destinationRegister = destinationRegister;
        this._destinationIndex = destinationIndex;
    }

    public decode(): string {
        return `${LoadFromMemoryInstruction.OPCODE} $${this._sourcePointerRegister}, $${this._destinationRegister}[${this._destinationIndex}]`;
    }

    public encode(): number {
        const args = [this._sourcePointerRegister, this._destinationRegister, this._destinationIndex]
        return pack(LoadFromMemoryInstruction.HEAD, LoadFromMemoryInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

