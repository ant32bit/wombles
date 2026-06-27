import { RandomAccessMemory } from "../../memory/random-access-memory";
import { Process, RegisterType } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class StackPopInstruction implements IInstruction {

    public static MASK: number = 0xFFF0;
    public static PACK: number[] = [12,4];
    public static HEAD: number = 0x02F0;
    public static OPCODE: string = 'pop';
    public static PATTERN: string = '$x';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!); }

    private _destinationRegister: number;

    constructor(destinationRegister: number) {
        this._destinationRegister = destinationRegister;
    }

    public decode(): string {
        return `${StackPopInstruction.OPCODE} $${this._destinationRegister}`;
    }

    public encode(): number {
        const args = [this._destinationRegister]
        return pack(StackPopInstruction.HEAD, StackPopInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

