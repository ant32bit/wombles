import { InstructionEncoder, InstructionDecoder, IInstruction, InvalidLineError, NoOpInstruction } from '.';

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

export function decompile(instructions: number[]): string {
    const lines: string[] = [];

    let zeros: number = 0;
    for (const rawInstruction of instructions) {
        if (rawInstruction === 0) {
            zeros++;
            continue;
        }

        while (zeros > 0) {
            lines.push('nop #0000');
            zeros--;
        }

        const comment = ' #' + rawInstruction.toString(16).toUpperCase().padStart(4, '0');
        const instruction = InstructionDecoder.decode(rawInstruction)?.decode() || 'nop';
        lines.push(instruction + comment);
    }

    return lines.join('\n');
}
