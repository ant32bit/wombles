import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "./electron/electron-api";

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}

class ElectronAPI implements IElectronAPI {
    ping = async (data: string) => {
        const result = await ipcRenderer.invoke('ping', data);
        return result;
    }
}

contextBridge.exposeInMainWorld('electron', new ElectronAPI());
