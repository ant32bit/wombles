
export enum RegisterType {
    Data,
    Interrupt,
    JumpBack,
    StackPointer,
    InstructionPointer
}

export abstract class ProcessMapping {

    public static INSTRUCTIONS_OFFSET: number = 132;

    public static REGISTERS_OFFSETS: Map<RegisterType, number> = new Map([
        [RegisterType.Data, 0], // size = 15 * 4 = 60
        [RegisterType.Interrupt, 60], // size = 8 * 4 = 32
        [RegisterType.JumpBack, 92], // size = 8 * 4 = 32
        [RegisterType.InstructionPointer, 124], // size = 4
        [RegisterType.StackPointer, 128] // size = 4
    ]);
}
