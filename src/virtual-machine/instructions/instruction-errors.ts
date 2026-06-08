export class InvalidComponentError extends Error {
    constructor(opcode: string, pattern: string, v: string, bound: [number, number]) {
        super(`${opcode} ${pattern}: ${v} must be [${bound[0]},${bound[1]}]`)
    }
}

export class InvalidLineError extends Error {

    public char: number;
    public line: string;

    constructor(char: number, line: string, message: string) {
        super(message);
        this.char = char;
        this.line = line;
    }
}
