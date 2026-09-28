import { Memory8bitResolver, RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class CopyMemoryInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,2,4,4];
    public static HEAD: number = 0x2800;
    public static OPCODE: string = 'cpm';
    public static PATTERN: string = '$x, $y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 15], y: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[2], components[3]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _sourcePointerRegister: number;
    private _destinationPointerRegister: number;

    constructor(sourcePointerRegister: number, destinationPointerRegister: number) {
        this._sourcePointerRegister = sourcePointerRegister;
        this._destinationPointerRegister = destinationPointerRegister;
    }

    public decode(): string {
        return `${CopyMemoryInstruction.OPCODE} $${this._sourcePointerRegister}, $${this._destinationPointerRegister}`;
    }

    public encode(): number {
        const args = [0, this._sourcePointerRegister, this._destinationPointerRegister]
        return pack(CopyMemoryInstruction.HEAD, CopyMemoryInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {

        let flipMask = 0;
        const mutationRate = process.options.cpmMutationRate;
        if (mutationRate > 0 && Math.random() < mutationRate) {
            flipMask = 1 << Math.ceil(Math.random() * 8);
        }

        const srcRegResolver = process.getRegisterResolver(RegisterType.Data, this._sourcePointerRegister);
        const destRegResolver = process.getRegisterResolver(RegisterType.Data, this._destinationPointerRegister);

        const srcAddress = srcRegResolver.resolveGet(memory);
        const destAddress = destRegResolver.resolveGet(memory);

        const srcResolver = new Memory8bitResolver(srcAddress);
        const destResolver = new Memory8bitResolver(destAddress);

        const value = srcResolver.resolveGet(memory) ^ flipMask;
        destResolver.resolveSet(memory, value);
    }

    public description(): string {
        return `Copy memory at address in $${this._sourcePointerRegister} into address in $${this._destinationPointerRegister}.`
    }
}

