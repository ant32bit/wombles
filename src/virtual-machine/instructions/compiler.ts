import { InstructionEncoder, IInstruction, InvalidLineError, NoOpInstruction } from '.';

export function compile(code: string): number[] {
    const instructions: IInstruction[] = [];
    const errors: string[] = [];

    let lineNumber = 0;
    const lines = code.split('\n');
    for (const rawLine of lines) {
        lineNumber++;
        const commentIndex = rawLine.indexOf('#');
        const line = (commentIndex < 0 ? rawLine : rawLine.substring(0, commentIndex)).trimEnd();
        if (line === '')
            continue;

        let instruction = new NoOpInstruction();
        try {
            const rawInstruction = InstructionEncoder.encode(line);
            if (rawInstruction != undefined)
                instruction = rawInstruction;
        }
        catch (error) {
            if (error instanceof InvalidLineError)
                errors.push(`ERROR at (${lineNumber}, ${error.char}) ${error.message}`);
        }

        instructions.push(instruction);
    }

    if (errors.length > 0)
        throw new Error(errors.join('\n'));

    return instructions.map(instruction => instruction.encode());
}
