import { RegisterType } from '../virtual-machine/processor/process-mapping';
import { IElementProvider } from '../interfaces';
import { CurrentlyLoadedProcess, TickCompletedEvent } from '../events/tick-completed-event';
import { ProcessSnapshot } from '../events';

const registerDefinition: {[key: string]: [string, (index: number) => string]} = (() => {
    const r: {[key: string]: [string, (index: number) => string]} = {};
    r[RegisterType.Data.toString()] = ['data-register', i => '$' + i.toString()];
    r[RegisterType.Interrupt.toString()] = ['interrupt-register', i => 'I' + i.toString()];
    r[RegisterType.JumpBack.toString()] = ['jumpback-register', i => 'J' + i.toString()];
    r[RegisterType.InstructionPointer.toString()] = ['instruction-pointer', _ => 'IP'];
    r[RegisterType.StackPointer.toString()] = ['stack-pointer', _ => 'SP'];
    return r;
})();

interface IRegister {
    type: RegisterType;
    index: number;
    hexEl: HTMLSpanElement;
    decEl: HTMLSpanElement;
}

export type ProcessSnapshotProvider = (processId: number) => Promise<ProcessSnapshot | undefined> | ProcessSnapshot | undefined;

export class ProcessesDisplayUI {

    private main: HTMLDivElement;
    private processesList: HTMLUListElement;
    private registersList: HTMLUListElement;
    private code: HTMLPreElement;

    private registers: IRegister[];
    private currentlyLoadedProcessses: CurrentlyLoadedProcess[];
    private selectedProcessId?: number;

    private processSnapshotProvider: ProcessSnapshotProvider;
    private elementProvider: IElementProvider;

    constructor(elementProvider: IElementProvider, processSnapshotProvider: ProcessSnapshotProvider) {
        this.main = elementProvider.getElementById('processes-display') as HTMLDivElement;
        this.processesList = elementProvider.getElementById('processes-list') as HTMLUListElement;
        this.registersList = elementProvider.getElementById('process-registers') as HTMLUListElement;
        this.code = elementProvider.getElementById('code-display') as HTMLPreElement;

        this.elementProvider = elementProvider;
        this.processSnapshotProvider = processSnapshotProvider;

        this.registers = []
        this.currentlyLoadedProcessses = [];

        const createIRegister: (type: RegisterType, index: number) => IRegister = (type, index) => {
            const r = registerDefinition[type.toString()];

            const titleSpan = elementProvider.createElement('span');
            titleSpan.classList.add(r[0], 'title');
            titleSpan.innerText = r[1](index);

            const hexEl = elementProvider.createElement('span');
            hexEl.classList.add('hex-value');

            const decEl = elementProvider.createElement('span');
            decEl.classList.add('dec-value');

            const li = elementProvider.createElement('li');
            li.appendChild(titleSpan);
            li.appendChild(hexEl);
            li.appendChild(decEl);

            this.registersList.appendChild(li);

            return { type, index, hexEl, decEl }
        }

        for (let i = 1; i <= 15; i++) {
            this.registers.push(createIRegister(RegisterType.Data, i));
        }

        for (let i = 0; i < 8; i++) {
            this.registers.push(createIRegister(RegisterType.Interrupt, i));
        }

        for (let i = 0; i < 8; i++) {
            this.registers.push(createIRegister(RegisterType.JumpBack, i));
        }

        this.registers.push(createIRegister(RegisterType.InstructionPointer, 0));
        this.registers.push(createIRegister(RegisterType.StackPointer, 0));
    }

    public update(tickDetails: TickCompletedEvent): void {
        this.currentlyLoadedProcessses = tickDetails.processes;
    }

    public async show(show: boolean): Promise<void> {

        if (!show) {
            this.main.classList.add('hidden');
            return;
        }

        const nodes = this.currentlyLoadedProcessses.map(this.createProcessElement.bind(this));
        this.processesList.replaceChildren(...nodes);
        this.setSelectedProcessId(this.selectedProcessId);

        this.main.classList.remove('hidden');
    }

    private async setSelectedProcessId(processId: number| undefined) {
        this.registersList.classList.add('hidden');
        this.code.classList.add('hidden');

        this.selectedProcessId = undefined;

        if (processId == undefined)
            return;

        const processSnapshot = await this.processSnapshotProvider(processId);
        if (processSnapshot == undefined)
            return;

        const processIdData = processId.toString();
        for (const element of this.processesList.children) {
            if ((element as HTMLElement)?.dataset.processId || "0" === processIdData)
                element.classList.add('selected');
            else
                element.classList.remove('selected');
        }

        for (let i = 0; i < processSnapshot.registers.length; i++) {
            const register = this.registers[i];
            const value = processSnapshot.registers[i];
            register.decEl.innerText = value.toString();
            register.hexEl.innerText = '0x' + (value >>> 0).toString(16).toUpperCase().padStart(8, '0');
        }

        this.selectedProcessId = processId;
        this.code.innerText = processSnapshot.code;

        this.code.classList.remove('hidden');
        this.registersList.classList.remove('hidden');
    }

    private createProcessElement(process: CurrentlyLoadedProcess): HTMLLIElement {
        const icon = this.elementProvider.createElement('i');
        icon.classList.add('fa-solid', process.isStarted ? 'fa-circle-play' : 'fa-circle-stop');

        const span = this.elementProvider.createElement('span');
        span.classList.add('process-id');
        span.innerText = '0x' + process.processId.toString(16).padStart(8, '0');

        const processNode = this.elementProvider.createElement('li');
        processNode.dataset.processId = process.processId.toString();
        processNode.dataset.address = process.address.toString(16);
        processNode.appendChild(icon);
        processNode.appendChild(span);
        processNode.onclick = (ev => {
            ev.preventDefault();
            let target: HTMLElement = ev.target as HTMLElement;
            while (target.tagName != 'LI') {
                if (target.tagName === 'BODY')
                    // we've gone too far
                    return;

                target = target.parentNode as HTMLElement;
            }

            const processId = parseInt(target.dataset.processId || "0");
            this.setSelectedProcessId(processId);
        });

        return processNode;
    }
}

