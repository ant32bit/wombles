import { IInstruction } from "./instruction";
import { InvalidLineError } from "./instruction-errors";
import * as Instructions from "./instructions-set";

interface IInstructionDefinition {
    OPCODE: string;
    PATTERN: string;
    BOUNDS: {[v: string]: [number, number]};
    PACK: number[];
    BUILD(variables: {x: number | null, y: number | null, z: number | null}): IInstruction;
}

const instructionSet: {[opCode: string]: IInstructionDefinition} =
    Object.fromEntries(Object.values(Instructions).map(type => [type.OPCODE, type]));

export function encode(line: string): IInstruction | undefined {
    let nChar = 0;
    let parsingLine = line

    function removeLeadingWhitespace() {
        let trimLen = parsingLine.length;
        parsingLine = parsingLine.trimStart();
        trimLen -= parsingLine.length;
        nChar += trimLen;
    }

    var commentIndex = parsingLine.indexOf('#');
    if (commentIndex >= 0)
        parsingLine = parsingLine.substring(0, commentIndex);

    parsingLine = parsingLine.trimEnd();

    if (parsingLine === '')
        return undefined;

    removeLeadingWhitespace();

    const opcode = parsingLine.substring(0, 3).toLowerCase();
    const instructionDefinition: IInstructionDefinition = instructionSet[opcode];
    if (instructionDefinition == null)
        throw new InvalidLineError(nChar, line, "invalid OPCODE");

    parsingLine = parsingLine.substring(3);
    nChar += 3;

    removeLeadingWhitespace();

    const pattern = instructionDefinition.PATTERN.split('');
    let patternPointer = 0;

    const chars = parsingLine.split('');
    let charsPointer = 0;

    const vars: {x: number | null, y: number | null, z: number | null} = { x: null, y: null, z: null }

    while (charsPointer < chars.length && patternPointer < pattern.length) {

        if (['x', 'y', 'z'].includes(pattern[patternPointer])) {
            const currVar: 'x' | 'y' | 'z' = pattern[patternPointer] as 'x' | 'y' | 'z';
            let currValue: string = '';

            var numberStartIndex = nChar + charsPointer;

            while(charsPointer < chars.length && chars[charsPointer] >= '0' && chars[charsPointer] <= '9') {
                currValue += chars[charsPointer];
                charsPointer++;
            }

            if (currValue == '') {
                throw new InvalidLineError(nChar + charsPointer, line, "expected number");
            }

            const value = parseInt(currValue);

            var bound = instructionDefinition.BOUNDS[currVar];
            if (value < bound[0] || value > bound[1])
                throw new InvalidLineError(numberStartIndex, line, `${currVar} = ${value} - must be within [${bound[0]}, ${bound[1]}]`);

            vars[currVar] = value;
            patternPointer++;
        }
        else if (pattern[patternPointer] == ' ') {
            while(charsPointer < chars.length && [' ', '\t', '\n'].includes(chars[charsPointer])) {
                charsPointer++;
            }
            patternPointer++;
        }
        else if (pattern[patternPointer] == chars[charsPointer]) {
            patternPointer++;
            charsPointer++;
        }
        else {
            throw new InvalidLineError(nChar + charsPointer, line, `expected '${pattern[patternPointer]}'`);
        }
    }

    if (charsPointer != chars.length) {
        while(charsPointer < chars.length && [' ', '\t', '\n'].includes(chars[charsPointer])) {
            charsPointer++;
        }
        throw new InvalidLineError(nChar + charsPointer, line, `unexpected character '${chars[charsPointer]}'`);
    }

    if (patternPointer != pattern.length) {
        throw new InvalidLineError(nChar + charsPointer, line, `expected '${pattern[patternPointer]}'`);
    }

    return instructionDefinition.BUILD(vars);
}
