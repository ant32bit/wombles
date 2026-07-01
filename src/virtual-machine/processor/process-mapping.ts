
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
        [RegisterType.Data, 0],
        [RegisterType.Interrupt, 60],
        [RegisterType.JumpBack, 92],
        [RegisterType.InstructionPointer, 124],
        [RegisterType.StackPointer, 128]
    ]);
}
