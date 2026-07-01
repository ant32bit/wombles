import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class BinaryNotInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0x7400;
    public static OPCODE: string = 'bnt';
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
        return `${BinaryNotInstruction.OPCODE} $${this._sourceRegister}, $${this._destinationRegister}`;
    }

    public encode(): number {
        const args = [this._sourceRegister, this._destinationRegister, 0]
        return pack(BinaryNotInstruction.HEAD, BinaryNotInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {
        const srcResolver = process.getRegisterResolver(RegisterType.Data, this._sourceRegister);
        const destResolver = process.getRegisterResolver(RegisterType.Data, this._destinationRegister);

        const src = srcResolver.resolveGet(memory) >>> 0;

        destResolver.resolveSet(memory, (~src) >>> 0);
    }
}
