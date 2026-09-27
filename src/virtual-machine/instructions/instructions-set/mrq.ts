import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class MemoryRequestInstruction implements IInstruction {

    public static MASK: number = 0xFFC0;
    public static PACK: number[] = [10,3,3];
    public static HEAD: number = 0x0100;
    public static OPCODE: string = 'mrq';
    public static PATTERN: string = '$x, $y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [1, 7], y: [1, 7] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _pointerRegister: number;
    private _sizeRegister: number;

    constructor(pointerRegister: number, sizeRegister: number) {
        this._pointerRegister = pointerRegister;
        this._sizeRegister = sizeRegister;
    }

    public decode(): string {
        return `${MemoryRequestInstruction.OPCODE} $${this._pointerRegister}, $${this._sizeRegister}`;
    }

    public encode(): number {
        const args = [this._pointerRegister, this._sizeRegister]
        return pack(MemoryRequestInstruction.HEAD, MemoryRequestInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {

        const pointerResolver = process.getRegisterResolver(RegisterType.Data, this._pointerRegister);
        const sizeResolver = process.getRegisterResolver(RegisterType.Data, this._sizeRegister);

        const size = sizeResolver.resolveGet(memory);

        const processId = process.getProcessDefinition().processId;
        const address = memory.reserveHeap(processId, size) ?? 0;

        pointerResolver.resolveSet(memory, address);
    }

    public description(): string {
        return `Request size ${this._sizeRegister} of memory to be allocated and store the address in $${this._pointerRegister}.`;
    }
}

