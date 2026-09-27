import { TickCompletedEvent } from '../events';
import { IElementProvider } from '../interfaces';

export class MemoryRepresentationUI {

    private memoryState: IAddressState[];
    private canvas: HTMLCanvasElement;

    constructor(elementProvider: IElementProvider, memoryInitialState: Uint8Array, programSizeInBits: number) {
        const height = 1 << programSizeInBits;
        const width = memoryInitialState.length / height;

        this.canvas = elementProvider.getElementById("memory-representation") as HTMLCanvasElement;
        this.canvas.width = width;
        this.canvas.height = height;

        const xShift = programSizeInBits;
        const yMask = 0xFFFFFFFF >>> (32 - xShift);
        const xMask = 0x7FFFFFFF - yMask;
        this.memoryState = [];

        for (let address = 0; address < memoryInitialState.length; address++) {
            const x = (address & xMask) >>> xShift;
            const y = address & yMask;
            const index = (y * width + x) * 4;

            this.memoryState.push({
                value: memoryInitialState[address],
                address: 0x80000000 + address,
                index
            });
        }

        this.draw(0);
    }

    public update(tickDetails: TickCompletedEvent) {
        for (const writeLog of tickDetails.changes.writes) {
            for(let i = 0; i < writeLog.changes.length; i++) {
                var index = writeLog.address + i;
                this.memoryState[index].value = writeLog.changes[i];
                this.memoryState[index].tickLastChanged = tickDetails.tick;
            }
        }

        for (const readLog of tickDetails.changes.reads) {
            for(let i = 0; i < readLog.size; i++) {
                var index = readLog.address + i;
                this.memoryState[index].tickLastAccessed = tickDetails.tick;
            }
        }

        this.draw(tickDetails.tick);
    }

    private draw(t: number) {
        const ctx = this.canvas.getContext('2d')!;
        const imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (const state of this.memoryState) {
            const i = state.index;
            const r = state.tickLastChanged ? 255 - clamp255((t - state.tickLastChanged) * 25) : 0;
            const g = state.value;
            const b = state.tickLastAccessed ? 255 - clamp255((t - state.tickLastAccessed) * 25) : 0;

            data[i    ] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

function clamp255(v: number): number {
    if (isNaN(v))
        return 255;
    if (v < 0)
        return 0;
    if (v > 255)
        return 255;
    return v;
}

interface IAddressState {
    value: number;
    tickLastChanged?: number;
    tickLastAccessed?: number;
    address: number;
    index: number;
}
