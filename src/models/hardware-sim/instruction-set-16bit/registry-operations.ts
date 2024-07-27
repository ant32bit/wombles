import { IInstruction } from "./instruction-interface";


export class SetImmediate implements IInstruction {
    mnemonic: string = 'set';

    constructor(public opcode: number, public byteIndex: number, public Rd: number, public immediate: number) {
        
    }
}

export class LoadFromMemory implements IInstruction {
    mnemonic: string = 'lfm';

    constructor(public opcode: number, public opsubcode: number, public dSize: number, public sSize: number, public Rd: number, public Rs: number) {

    }
}

export class StoreToMemory implements IInstruction {
    mnemonic: string = 'stm';

    constructor(public opcode: number, public opsubcode: number, public dSize: number, public sSize: number, public Rd: number, public Rs: number) {
        
    }
}

export class CopyTo implements IInstruction {
    mnemonic: string = 'cpy';

    constructor(public opcode: number, public opsubcode: number, public dSize: number, public sSize: number, public Rd: number, public Rs: number) {
        
    }
}

export class Clear implements IInstruction {
    mnemonic: string = 'clr';

    constructor(public opcode: number, public opsubcode: number, public dSize: number, public sSize: number, public Rd: number) {
        
    }
}

