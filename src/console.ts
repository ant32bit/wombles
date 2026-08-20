import { InternalAPI } from './apis/internal-api';
import { MemoryRepresentationUI, SnapshotDisplayUI, StartVMFormUI, VirtualMachineUI } from './ui';

window.document.addEventListener('DOMContentLoaded', main);

async function main() {

    const form = new StartVMFormUI(document);
    const vm = new VirtualMachineUI(window, document);
    const display = new SnapshotDisplayUI(document);
    let memory: MemoryRepresentationUI | null = null;

    await vm.isReady;

    const api = new InternalAPI(window, vm.postable);
    form.setSubmitHandler(async (ev) => {
        var initial = await api.startup(ev.initialWomble, ev.memorySizeInBits, ev.programSizeInBits);
        memory = new MemoryRepresentationUI(document, initial, ev.programSizeInBits);
        display.show(true);
    });

    api.addTickListener((event) => {
        display.update(event);
        memory?.update(event);
    });

    display.onstart(() => { api.start(); });
    display.onpause(() => { api.pause(); });

    form.enable(true);
}
