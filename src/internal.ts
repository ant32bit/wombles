import { ConsoleAPI } from './apis/console-api'

window.document.addEventListener('DOMContentLoaded', main);

async function main() {
    const api = new ConsoleAPI(window, window.parent);
    window.parent.postMessage('api:ready');
}
