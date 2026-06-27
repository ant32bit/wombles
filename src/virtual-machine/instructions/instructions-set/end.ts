import { RandomAccessMemory } from "../../memory/random-access-memory";
import { Process, RegisterType } from "../../processor/process";
import { IInstruction } from "../instruction"
import { pack } from "../packer"

export class ExitInstruction implements IInstruction {

    public static MASK: number = 0xFF80;
    public static PACK: number[] = [9,7];
    public static HEAD: number = 0x0080;
    public static OPCODE: string = 'end';
    public static PATTERN: string = 'x';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 127] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!); }

    private _exitCode: number;

    constructor(exitCode: number) {
        this._exitCode = exitCode;
    }

    public decode(): string {
        return `${ExitInstruction.OPCODE} ${this._exitCode}`;
    }

    public encode(): number {
        const args = [this._exitCode]
        return pack(ExitInstruction.HEAD, ExitInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

