import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class ImmediateSetRegisterInstruction implements IInstruction {

    public static MASK: number = 0xC000;
    public static PACK: number[] = [2,4,2,8];
    public static HEAD: number = 0xC000;
    public static OPCODE: string = 'set';
    public static PATTERN: string = '$x[y], z';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15], y: [0, 3], z:[0, 255] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!, variables.z!); }

    private _destinationRegister: number;
    private _destinationIndex: number
    private _immediateValue: number;

    constructor(destinationRegister: number, destinationIndex: number, immediateValue: number) {
        this._destinationRegister = destinationRegister;
        this._destinationIndex = destinationIndex;
        this._immediateValue = immediateValue;
    }

    public decode(): string {
        return `set $${this._destinationRegister}[${this._destinationIndex}], ${this._immediateValue}`;
    }

    public encode(): number {
        const args = [this._destinationRegister, this._destinationIndex, this._immediateValue]
        return pack(ImmediateSetRegisterInstruction.HEAD, ImmediateSetRegisterInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void { }
}

