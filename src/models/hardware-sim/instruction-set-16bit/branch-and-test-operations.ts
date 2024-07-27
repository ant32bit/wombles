import { IInstruction, InstructionEvalError } from "./instruction-interface";

export enum CompareOperator {
    Equal = 0,
    NotEqual = 1,
    GreaterThanOrEqual = 2,
    LessThanOrEqual = 3,
    GreaterThan = 4,
    LessThan = 5,
    Unknown1 = 6,
    Unknown2 = 7
}

const enumEval: CompareOperator[] = [
    CompareOperator.Equal,
    CompareOperator.NotEqual,
    CompareOperator.GreaterThanOrEqual,
    CompareOperator.LessThanOrEqual,
    CompareOperator.GreaterThan,
    CompareOperator.LessThan,
    CompareOperator.Unknown1,
    CompareOperator.Unknown2
];

const cmpMnemonic: string[] = ['eq', 'ne', 'ge', 'le', 'gt', 'lt', 'u1', 'u2'];

export class JumpIf implements IInstruction {
    mnemonic: string;

    constructor(public opcode: number, public opsubcode: number, public cmpsubcode: number, public Ro: number, public Rl: number, public Rr: number) {
        if (cmpsubcode === CompareOperator.Unknown1 || cmpsubcode === CompareOperator.Unknown2)
            throw new InstructionEvalError();

        this.mnemonic = 'j' + cmpMnemonic[cmpsubcode];
    }
}

export class BranchIf implements IInstruction {
    mnemonic: string;

    constructor(public opcode: number, public opsubcode: number, public cmpsubcode: number, public Ro: number, public Rl: number, public Rr: number) {
        if (cmpsubcode === CompareOperator.Unknown1 || cmpsubcode === CompareOperator.Unknown2)
            throw new InstructionEvalError();
        
        this.mnemonic = 'b' + cmpMnemonic[cmpsubcode];
    }
}

export class TestCompare implements IInstruction {
    mnemonic: string;

    constructor(public opcode: number, public cmpsubcode: number, public Rd: number, public Rl: number, public Rr: number) {
        if (cmpsubcode === CompareOperator.Unknown1 || cmpsubcode === CompareOperator.Unknown2)
            throw new InstructionEvalError();
        
        this.mnemonic = 't' + cmpMnemonic[cmpsubcode];
    }
}


