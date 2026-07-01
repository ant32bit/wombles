import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class BeginInterruptInstruction implements IInstruction {

    public static MASK: number = 0xFFF8;
    public static PACK: number[] = [13, 3];
    public static HEAD: number = 0x0288;
    public static OPCODE: string = 'bei';
    public static PATTERN: string = 'x';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 7] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!); }

    private _interruptCode: number;

    constructor(interruptCode: number) {
        this._interruptCode = interruptCode;
    }

    public decode(): string {
        return `${BeginInterruptInstruction.OPCODE} ${this._interruptCode}`;
    }

    public encode(): number {
        const args = [this._interruptCode]
        return pack(BeginInterruptInstruction.HEAD, BeginInterruptInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {
        const ip = process.getRegisterResolver(RegisterType.InstructionPointer);
        const irp = process.getRegisterResolver(RegisterType.Interrupt, this._interruptCode);
        const ipValue = ip.resolveGet(memory);
        irp.resolveSet(memory, ipValue + 2);
    }

    public getInterruptCode(): number {
        return this._interruptCode;
    }
}
