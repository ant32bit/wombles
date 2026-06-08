import { expect } from "chai";
import { InstructionEncoder, InvalidLineError, AdditionInstruction } from "../../../src/virtual-machine/instructions";

describe("instruction encoder", () => {
    const successTasks: [string, string][] = [
        ['has no white space',         'add$1,$2,$3'],
        ['has leading white space',    '  add $1, $2, $3'],
        ['has trailing white space',   'add $1, $2, $3   '],
        ['has excessive white spaces', '  add   $1,   $2,   $3    '],
        ['has a trailing comment',     'add $1, $2, $3 # this is a comment']
    ];

    for(const task of successTasks)
        it(`can encode when ${task[0]}`, () => {

            const encoder = new InstructionEncoder();
            const actual = encoder.encode(task[1]);
            const encoded = actual!.encode();

            expect(actual).instanceOf(AdditionInstruction);
            expect(encoded).equals(0x444B);
        });

    it ('return undefined for comment lines', () => {
        const encoder = new InstructionEncoder();
        const actual = encoder.encode(' # comment line');
        expect(actual).is.undefined
    });

    it ('throws if opcode is invalid', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode(' bad');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('invalid OPCODE');
            expect((actualError as InvalidLineError).char).equals(1);
        }
    });

    it ('throws if var is not a number', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode('add $1, $zero, $3');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('expected number');
            expect((actualError as InvalidLineError).char).equals(9);
        }
    });

    it ('throws if var is below lower bound', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode('add $1, $2, $0');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('z = 0 - must be within [1, 3]');
            expect((actualError as InvalidLineError).char).equals(13);
        }
    });

    it ('throws if var is above upper bound', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode('add $1, $16, $3');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('y = 16 - must be within [0, 15]');
            expect((actualError as InvalidLineError).char).equals(9);
        }
    });

    it ('throws if pattern doesn\'t match', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode('add $1, $2[3]');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('expected \',\'');
            expect((actualError as InvalidLineError).char).equals(10);
        }
    });

    it ('throws if pattern ends before input', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode('add $1, $2, $3, $4');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('unexpected character \',\'');
            expect((actualError as InvalidLineError).char).equals(14);
        }
    });

    it ('throws if pattern ends before input (does not show white space)', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode('add $1, $2, $3 $4');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('unexpected character \'$\'');
            expect((actualError as InvalidLineError).char).equals(15);
        }
    });

    it ('throws if input ends before pattern', () => {
        const encoder = new InstructionEncoder();
        try {
            encoder.encode('add $1, $2');
            expect.fail('should have thrown before reaching here');
        }
        catch (actualError) {
            expect(actualError).is.instanceOf(InvalidLineError);
            expect((actualError as Error).message).equals('expected \',\'');
            expect((actualError as InvalidLineError).char).equals(10);
        }
    });
});

