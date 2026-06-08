import { IInstruction } from "../instruction";
import { pack } from "../packer"

export class TestIfTrueInstruction implements IInstruction {

    public static MASK: number = 0xFC00;
    public static PACK: number[] = [6,4,4,2];
    public static HEAD: number = 0xB800;
    public static OPCODE: string = 'tit';
    public static PATTERN: string = '$x, $y';
    public static BOUNDS: {[v: string]: [number, number]} = { x: [0, 15], y: [1, 15] }
    public static PARSE(components: number[]): IInstruction { return new this(components[1], components[2]); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(variables.x!, variables.y!); }

    private _testRegister: number;
    private _destinationRegister: number;

    constructor(testRegister: number, destinationRegister: number) {
        this._testRegister = testRegister;
        this._destinationRegister = destinationRegister;
    }

    public decode(): string {
        return `${TestIfTrueInstruction.OPCODE} $${this._testRegister}, $${this._destinationRegister}`;
    }

    public encode(): number {
        const args = [this._testRegister, this._destinationRegister, 0]
        return pack(TestIfTrueInstruction.HEAD, TestIfTrueInstruction.PACK, args);
    }
}
