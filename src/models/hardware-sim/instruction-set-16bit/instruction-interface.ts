export interface IInstruction {
    mnemonic: string;
    opcode: number;
}

export class InstructionEvalError extends Error {
    
}
