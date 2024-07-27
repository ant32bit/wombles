import { Memory } from "./memory";

const N_REGISTERS: number = 16;

const SYSCALL_R: number = 7;
const FP_REG: number = 11;
const IP_REG: number = 12;
const SP_REG: number = 13;
const LR_REG: number = 14;
const PC_REG: number = 15;

const N_FLAG: number = 0; // Negative
const Z_FLAG: number = 1; // Zero
const C_FLAG: number = 2; // Carry
const V_FLAG: number = 3; // oVerflow

/// masks of relevant bits for determine instruction format
const formats: [number, number, (instruction: number) => IInstruction][] = [
    [ 1, 0x0FC000F0, 0x00000090, [4,6,1,1,4,4,4,4,4]],
    [ 2, 0x0F8000F0, 0x00800090, [4,5,1,1,1,4,4,4,4,4]],
    [ 3, 0x0FB00FF0, 0x01000090, [4,5,1,2,4,4,8,4]],
    [0x0FFFFFF0, 0x012FFF10, (x: number) => new BranchAndExchangeInstruction(x)],
    [ 5, 0x0E400F90, 0x00000090, [4,3,1,1,1,1,1,4,4,5,1,1,1,4]],
    [ 6, 0x0E400090, 0x00400090, [4,3,1,1,1,1,1,4,4,4,1,1,1,1,4]],
    [0x0C000000, 0x00000000, (x: number) => new DataProcessingInstruction(x)],
    [ 8, 0x0E000010, 0x06000010, [4,28]],
    [ 7, 0x0C000000, 0x04000000, [4,2,1,1,1,1,1,1,4,4,12]],
    [ 9, 0x0E000000, 0x08000000, [4,3,1,1,1,1,1,4,16]],
    [10, 0x0E000000, 0x0A000000, [4,3,1,28]],
    [11, 0x0E000000, 0x0C000000, [4,3,1,1,1,1,1,4,4,4,8]],
    [12, 0x0F000010, 0x0E000000, [4,4,4,4,4,4,3,1,4]],
    [13, 0x0F000010, 0x0E000010, [4,4,3,1,4,4,4,3,1,4]],
    [14, 0x0F000000, 0x0F000000, [4,4,28]],
];
            // var components = unpack(value, packSizes);
            // switch(index) {
            //     case 0:
            //         return [opcodes[components[3]], components];
            //     case 1:
            //         return [['mul','mla'][components[2]], components];
            //     case 2:
            //         return [['mull','mlal'][components[3]], components];
            //     case 3:
            //         return ['swp', components];
            //     case 4: 
            //         return ['bx', components];
            //     case 5:
            //     case 6:
            //         if (components[11] === 0 && components[12] === 1) {
            //             return [['strh', 'ldrh'][components[6]], components];
            //         }
            //         else if (components[6] === 1 && components[11] === 1) {
            //             return [['ldrsb', 'ldrsh'][components[12]], components];
            //         }
            //         break;
            //     case 7:
            //         return [['str','ldr'][components[7]], components];
            //     case 8:
            //         return ['noop', components];
            //     case 9: 
            //         return [['stm', 'ldm'][components[6]], components];
            //     case 10:
            //         return [['b', 'bl'][components[2]], components];
            //     case 11:
            //         return [['stc', 'ldc'][components[6]], components];
            //     case 12:
            //         return ['cpd', components];
            //     case 13:
            //         return [['mrc', 'mcr'][components[3]], components];
            //     case 14:
            //         return ['swi', components];
            // }

export class Processor {
    private registers: number[];
    private cspr: boolean[];
    
    constructor() {
        this.registers = [];
        for (let i = 0; i < N_REGISTERS; i++) {
            this.registers.push(0);
        }

        this.cspr = [];
        for (let i = 0; i < 4; i++) {
            this.cspr.push(false);
        }
    }

    public run(memory: Memory) {
        let pointer = this.registers[PC_REG];
        const value = memory.getDword(pointer);
        let instruction: IInstruction | undefined = undefined;
        for (const [mask, code, createFn] of formats) {
            if ((value & mask) === code) {
                instruction = createFn(value);
            }
        }
        
        if (instruction == undefined)
            throw new SyntaxError();

        // run instruction;

        this.registers[PC_REG] += 4;
    }

    private runDataProcessingInstruction(instruction: number) {

    }
}