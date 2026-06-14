
// System Operations
export { NoOpInstruction } from "./nop";
export { ExitInstruction } from "./end";

// System Memory Operations
export { MemoryRequestInstruction } from "./mrq";
export { MemoryFreeInstruction } from "./mfr";

// System Process Operations
export { ProcessCreateInstruction } from "./pcr";
export { ProcessStartInstruction } from "./pst";

// Interrupt Operations
export { ExecuteInterruptInstruction } from "./exi"
export { BeginInterruptInstruction } from "./bei";
export { EndOfInterruptInstruction } from "./eoi";

// Instruction Pointer Operations
export { GetInstructionPointerInstruction } from "./gip";
export { SetInstructionPointerInstruction } from "./sip";

// Stack Operations
export { StackPushInstruction } from "./psh";
export { StackPopInstruction } from "./pop";

// Memory Operations
export { LoadFromMemoryInstruction } from "./lfm";
export { StoreToMemoryInstruction } from "./stm";
export { CopyMemoryInstruction } from "./cpm";
export { IncrementMemoryPointerInstruction } from "./imp";
export { ImmediateSetMemoryInstruction } from "./ism";

// Ternary Operations
export { CopyRegisterInstruction } from "./cpr";
export { AdditionInstruction } from "./add";
export { SubtractionInstruction } from "./sub";
export { MultiplicationInstruction } from "./mul";
export { DivisionInstruction } from "./div";
export { ModulusInstruction } from "./mod";
export { LogicalAndInstruction } from "./and";
export { LogicalOrInstruction } from "./ior";
export { LogicalExclusiveOrInstruction } from "./xor";
export { LogicalNotInstruction } from "./not";
export { BinaryAndInstruction } from "./bnd";
export { BinaryOrInstruction } from "./bor";
export { BinaryExclusiveOrInstruction } from "./bxr";
export { BinaryNotInstruction } from "./bnt";
export { LeftShiftInstruction } from "./lsh";
export { RightShiftInstruction } from "./rsh";

// Branching Operations
export { BranchEqualInstruction } from "./beq";
export { BranchNotEqualInstruction } from "./bne";
export { BranchGreaterOrEqualInstruction } from "./bge";
export { BranchLessOrEqualInstruction } from "./ble";
export { BranchGreaterThanInstruction } from "./bgt";
export { BranchLessThanInstruction } from "./blt";
export { BranchIfTrueInstruction } from "./bit";
export { BranchIfFalseInstruction } from "./bif";

// Test Operations
export { TestEqualInstruction } from "./teq";
export { TestNotEqualInstruction } from "./tne";
export { TestGreaterOrEqualInstruction } from "./tge";
export { TestLessOrEqualInstruction } from "./tle";
export { TestGreaterThanInstruction } from "./tgt";
export { TestLessThanInstruction } from "./tlt";
export { TestIfTrueInstruction } from "./tit";
export { TestIfFalseInstruction } from "./tif";

// Set Register Operation
export { ImmediateSetRegisterInstruction } from "./set";
