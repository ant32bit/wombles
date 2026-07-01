import { RandomAccessMemory } from "../../memory/random-access-memory";
import { RegisterType } from "../../processor";
import { Process } from "../../processor/process";
import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class BranchIfFalseInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0x9C00;
    public static OPCODE: string = 'bif';
    public static PATTERN: string = '$x, $y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _testRegister: number;
    private _offsetRegister: number;

    constructor(testRegister: number, offsetRegister: number) {
        this._testRegister = testRegister;
        this._offsetRegister = offsetRegister;
    }

    public decode(): string {
        return `${BranchIfFalseInstruction.OPCODE} $${this._testRegister}, $${this._offsetRegister}`;
    }

    public encode(): number {
        const args = [this._testRegister, this._offsetRegister, 0]
        return pack(BranchIfFalseInstruction.HEAD, BranchIfFalseInstruction.PACK, args);
    }

    public evaluate(memory: RandomAccessMemory, process: Process): void {
        const testResolver = process.getRegisterResolver(RegisterType.Data, this._testRegister);

        const test = testResolver.resolveGet(memory);

        if (test === 0) {
            const offsetResolver = process.getRegisterResolver(RegisterType.Data, this._offsetRegister);
            const offset = offsetResolver.resolveGet(memory) + 0;

            const ipResolver = process.getRegisterResolver(RegisterType.InstructionPointer);
            const ip = ipResolver.resolveGet(memory);
            ipResolver.resolveSet(memory, ip + (offset * 2));
        }
    }
}
