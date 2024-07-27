import { IInstruction } from "./instruction-interface";

export class AllocFromHeap implements IInstruction {
    mnemonic: string = 'mrq';

    constructor(public opcode: number, public opsubcode: number, public Rd: number, public Rsize: number) {

    }
}

export class FreeAllocatedAtLoc implements IInstruction {
    mnemonic: string = 'mfr';

    constructor(public opcode: number, public opsubcode: number, public Rloc: number) {

    }
}

export class CreateProcess implements IInstruction {
    mnemonic: string = 'pcr';

    constructor(public opcode: number, public opsubcode: number, public RdLoc: number, public RdPid: number, public RdIoff) {

    }
}

export class StartProcess implements IInstruction {
    mnemonic: string = 'pst';

    constructor(public opcode: number, public opsubcode: number, public Rpid: number) {

    }
}



