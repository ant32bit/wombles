import { IInstruction } from "../instruction";

export class NoOpInstruction implements IInstruction {

    public static MASK: number = 0xFFFF;
    public static PACK: number[] = [16];
    public static HEAD: number = 0x0000;
    public static OPCODE: string = 'nop';
    public static PATTERN: string = '';
    public static BOUNDS: {[v: string]: [number, number]} = { }
    public static PARSE(components: number[]): IInstruction { return new this(); }
    public static BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction { return new this(); }

    constructor() {
    }

    public decode(): string {
        return NoOpInstruction.OPCODE;
    }

    public encode(): number {
        return NoOpInstruction.HEAD;
    }
}
