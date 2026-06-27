import { IInstruction } from "./instruction";
import { unpack } from "./packer";
import * as Instructions from "./instructions-set";

interface IInstructionDefinition {
    MASK: number;
    PACK: number[];
    HEAD: number;
    PARSE(components: number[]): IInstruction;
}

type MaskSet = [mask: number, IInstructionDefinition[]];

const masks: MaskSet[] = (() => {
    const maskSets: {[mask: string]: MaskSet} = {};

    for(const type of Object.values(Instructions)) {
        if (maskSets[type.MASK] == null)
            maskSets[type.MASK] = [type.MASK, []];

        const maskSet = maskSets[type.MASK];
        maskSet[1].push(type)
    }

    return Object.keys(maskSets).sort().map(mask => maskSets[mask]);
})();

export function decode(instruction: number): IInstruction | undefined {

    for(const maskSet of masks) {
        const checkVal = instruction & maskSet[0];

        for(const instructionDefinition of maskSet[1]) {
            if (checkVal !== instructionDefinition.HEAD)
                continue;

            try {
                return instructionDefinition.PARSE(unpack(instruction, [16, ...instructionDefinition.PACK]).splice(1));
            }
            catch {
                // could not create
            }
        }
    }

    return undefined;
}
