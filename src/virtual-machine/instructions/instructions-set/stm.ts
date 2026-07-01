import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class StoreToMemoryInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,2,4];
    public static HEAD: number = 0x2400;
    public static OPCODE: string = 'stm';
    public static PATTERN: string = '$x[y], $z';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [0, 3], z:[1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _sourceRegister: number;
    private _sourceIndex: number;
    private _destinationPointerRegister: number;

    constructor(sourceRegister: number, sourceIndex: number, destinationPointerRegister: number) {
        this._sourceRegister = sourceRegister;
        this._sourceIndex = sourceIndex;
        this._destinationPointerRegister = destinationPointerRegister;
    }

    public decode(): string {
        return `${StoreToMemoryInstruction.OPCODE} $${this._sourceRegister}[${this._sourceIndex}], $${this._destinationPointerRegister}`;
    }

    public encode(): number {
        const args = [this._sourceRegister, this._sourceIndex, this._destinationPointerRegister]
        return pack(StoreToMemoryInstruction.HEAD, StoreToMemoryInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

