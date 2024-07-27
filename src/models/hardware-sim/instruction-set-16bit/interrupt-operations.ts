import { IInstruction } from "./instruction-interface";

export class ExpressInterrupt implements IInstruction {
    mnemonic: string = 'exi';

    constructor(public opcode: number, public opsubcode: number, public interruptCode: number) {

    }
}

export class EndOfInterrupt implements IInstruction {
    mnemonic: string = 'eoi';

    constructor(public opcode: number, public opsubcode: number) {

    }
}

export class JumpToOnInterrupt implements IInstruction {
    mnemonic: string = 'ifi';

    constructor(public opcode: number, public opsubcode: number, public interruptCode: number) {

    }
}

export class JumpBackFromInterrupt implements IInstruction {
    mnemonic: string = 'fii';

    constructor(public opcode: number, public opsubcode: number) {

    }
}