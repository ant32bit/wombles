import { IInstruction } from "./instruction-interface";

export class NoOperation implements IInstruction {
    mnemonic: string = 'nop';

    constructor(public opcode: number, public opsubcode: number) {

    }
}

export class EndCurrentProcess implements IInstruction {
    mnemonic: string = 'end';

    constructor(public opcode: number, public opsubcode: number, public exitCode: number) {

    }
}

export class SleepForClicks implements IInstruction {
    mnemonic: string = 'slp';

    constructor(public opcode: number, public opsubcode: number, public nSleep: number) {

    }
}


