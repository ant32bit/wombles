import { InternalAPI } from './apis/internal-api';
import { SnapshotDisplayUI, StartVMFormUI, VirtualMachineUI } from './ui';

window.document.addEventListener('DOMContentLoaded', main);

async function main() {

    const form = new StartVMFormUI(document);
    const vm = new VirtualMachineUI(window, document);
    const display = new SnapshotDisplayUI(document);

    await vm.isReady;

    const api = new InternalAPI(window, vm.postable);
    form.setSubmitHandler(async (ev) => {
        var initial = await api.startup(ev.initialWomble, ev.memorySizeInBits, ev.programSizeInBits);
        console.log(initial);
        display.show(true);
    });

    form.enable(true);


}
