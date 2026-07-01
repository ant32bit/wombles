import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class ProcessCreateInstruction implements IInstruction {

    public static MASK: number = 0xFFC0;
    public static PACK: number[] = [10,2,2,2];
    public static HEAD: number = 0x0180;
    public static OPCODE: string = 'pcr';
    public static PATTERN: string = '$x, $y, $z';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 3], y: [1, 3], z:[1, 3] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _pointerRegister: number;
    private _pidRegister: number;
    private _instructionOffsetRegister: number;

    constructor(pointerRegister: number, pidRegister: number, instructionOffsetRegister: number) {
        this._pointerRegister = pointerRegister;
        this._pidRegister =pidRegister;
        this._instructionOffsetRegister = instructionOffsetRegister;
    }

    public decode(): string {
        return `${ProcessCreateInstruction.OPCODE} $${this._pointerRegister}, $${this._pidRegister}, $${this._instructionOffsetRegister}`;
    }

    public encode(): number {
        const args = [this._pointerRegister, this._pidRegister, this._instructionOffsetRegister]
        return pack(ProcessCreateInstruction.HEAD, ProcessCreateInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

