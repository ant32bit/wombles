import { IElementProvider } from '../interfaces/element-provider';

export class SnapshotDisplayUI {

    private display: HTMLDivElement;

    constructor(elementProvider: IElementProvider) {
        this.display = elementProvider.getElementById("snapshot-display") as HTMLDivElement;
    }

    public show(show: boolean) {
        show ? this.display.classList.remove('hidden') : this.display.classList.add('hidden');
    }
}

interface IAddressState {
    value: number;
    tickLastChanged: number;
    tickLastAccessed: number;
    address: number;
    x: number;
    y: number;
}
