import { RandomAccessMemory } from "../../memory/random-access-memory";
import { Process, RegisterType } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class ImmediateSetMemoryInstruction implements IInstruction {

    public static MASK: number = 0xF000;
    public static PACK: number[] = [4,4,8];
    public static HEAD: number = 0x3000;
    public static OPCODE: string = 'ism';
    public static PATTERN: string = '$x, y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15], y: [0, 255] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _destinationPointerRegister: number;
    private _immediateValue: number;

    constructor(destinationPointerRegister: number, immediateValue: number) {
        this._destinationPointerRegister = destinationPointerRegister;
        this._immediateValue = immediateValue;
    }

    public decode(): string {
        return `${ImmediateSetMemoryInstruction.OPCODE} $${this._destinationPointerRegister}, ${this._immediateValue}`;
    }

    public encode(): number {
        const args = [this._destinationPointerRegister, this._immediateValue]
        return pack(ImmediateSetMemoryInstruction.HEAD, ImmediateSetMemoryInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

