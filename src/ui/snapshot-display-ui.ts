import { TickCompletedEvent } from '../events';
import { IElementProvider } from '../interfaces/element-provider';

export class SnapshotDisplayUI {

    private display: HTMLDivElement;
    private start: HTMLButtonElement;
    private step: HTMLButtonElement;
    private pause: HTMLButtonElement;
    private tickCounter: HTMLSpanElement;
    private programCounter: HTMLSpanElement;

    constructor(elementProvider: IElementProvider) {
        this.display = elementProvider.getElementById("snapshot-display") as HTMLDivElement;
        this.start = elementProvider.getElementById('start') as HTMLButtonElement;
        this.step = elementProvider.getElementById('step') as HTMLButtonElement;
        this.pause = elementProvider.getElementById('pause') as HTMLButtonElement;
        this.tickCounter = elementProvider.getElementById('tick-counter') as HTMLSpanElement;
        this.programCounter = elementProvider.getElementById('program-counter') as HTMLSpanElement;
    }

    public onstart(callback: () => void): void {
        this.start.onclick = (ev) => {
            ev.preventDefault();
            this.start.disabled = true;
            this.step.disabled = false;
            this.pause.disabled = false;
            callback();
        }
    }

    public onstep(callback: () => void): void {
        this.step.onclick = (ev) => {
            ev.preventDefault();
            this.start.disabled = false;
            this.step.disabled = false;
            this.pause.disabled = true;
            callback();
        }
    }

    public onpause(callback: () => void): void {
        this.pause.onclick = (ev) => {
            ev.preventDefault();
            this.start.disabled = false;
            this.step.disabled = false;
            this.pause.disabled = true;
            callback();
        }
    }

    public update(tickDetails: TickCompletedEvent): void {
        this.tickCounter.innerText = tickDetails.tick.toString();
        this.programCounter.innerText = tickDetails.processes.filter(p => p.isStarted).length.toString();
    }

    public show(show: boolean): void {
        show ? this.display.classList.remove('hidden') : this.display.classList.add('hidden');
    }
}
