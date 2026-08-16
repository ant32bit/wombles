import { ConsoleAPI, VirtualMachinePointer } from './apis/console-api'

window.document.addEventListener('DOMContentLoaded', main);
const vmPointer: VirtualMachinePointer = window as any as VirtualMachinePointer

async function main() {
    const api = new ConsoleAPI(window, window.parent, vmPointer);
    window.parent.postMessage('api:ready');
}
