import { ElectronMainProcess } from './electron/electron-main';

const main = new ElectronMainProcess();
main.addListener("started", () => {
    main.window?.webContents.openDevTools();
});
main.init();

main.ipc.handle("ping", (e: Electron.IpcMainInvokeEvent, data: string) => {
    return `pong (from ${data})`;
});