import { RandomAccessMemory } from "../../memory/random-access-memory";
import { Process, RegisterType } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class LogicalNotInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0x6400;
    public static OPCODE: string = 'not';
    public static PATTERN: string = '$x, $y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _sourceRegister: number;
    private _destinationRegister: number;

    constructor(sourceRegister: number, destinationRegister: number) {
        this._sourceRegister = sourceRegister;
        this._destinationRegister = destinationRegister;
    }

    public decode(): string {
        return `${LogicalNotInstruction.OPCODE} $${this._sourceRegister}, $${this._destinationRegister}`;
    }

    public encode(): number {
        const args = [this._sourceRegister, this._destinationRegister, 0]
        return pack(LogicalNotInstruction.HEAD, LogicalNotInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

