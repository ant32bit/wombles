import { IInstruction } from "./instruction-interface";

export class StackPushInstruction implements IInstruction {
    mnemonic: string = 'psh';
    
    constructor(public opcode: number, public opsubcode: number, public Rs: number) {

    }
}

export class StackPopInstruction implements IInstruction {
    mnemonic: string = 'pop';
    
    constructor(public opcode: number, public opsubcode: number, public Rd: number) {

    }
}