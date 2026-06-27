import { RandomAccessMemory } from "../../memory/random-access-memory";
import { Process, RegisterType } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class SetInstructionPointerInstruction implements IInstruction {

    public static MASK: number = 0xFFF0;
    public static PACK: number[] = [12,4];
    public static HEAD: number = 0x02D0;
    public static OPCODE: string = 'sip';
    public static PATTERN: string = '$x';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!); }

    private _sourceRegister: number;

    constructor(sourceRegister: number) {
        this._sourceRegister = sourceRegister;
    }

    public decode(): string {
        return `${SetInstructionPointerInstruction.OPCODE} $${this._sourceRegister}`;
    }

    public encode(): number {
        const args = [this._sourceRegister]
        return pack(SetInstructionPointerInstruction.HEAD, SetInstructionPointerInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

