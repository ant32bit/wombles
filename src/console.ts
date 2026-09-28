import { InternalAPI } from './apis/internal-api';
import { MemoryRepresentationUI, ProcessesDisplayUI, SnapshotDisplayUI, StartVMFormUI, VirtualMachineUI } from './ui';

window.document.addEventListener('DOMContentLoaded', main);

async function main() {

    const form = new StartVMFormUI(document);
    const vm = new VirtualMachineUI(window, document);
    const display = new SnapshotDisplayUI(document);
    let memory: MemoryRepresentationUI | null = null;

    await vm.isReady;

    const api = new InternalAPI(window, vm.postable);
    form.setSubmitHandler(async (ev) => {
        var initial = await api.startup(ev.initialWomble, ev.memorySizeInBits, ev.programSizeInBits, ev.processLifetime, ev.cpmMutationRate, ev.impMissRate);
        memory = new MemoryRepresentationUI(document, initial, ev.programSizeInBits);
        display.show(true);
    });

    const processes = new ProcessesDisplayUI(document, api.getProcessSnapshot.bind(api));

    api.addTickListener((event) => {
        display.update(event);
        memory?.update(event);
        processes.update(event);
    });

    display.onstart(() => {
        api.start();
        processes.show(false);
    });

    display.onstep(() => {
        api
            .step()
            .then(() => processes.show(true));
    });

    display.onpause(() => {
        api
            .pause()
            .then(() => processes.show(true));
    });

    form.enable(true);
}
