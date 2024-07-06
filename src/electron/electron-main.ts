import { App, app, BrowserWindow, IpcMain, ipcMain } from "electron";
import * as path from "path";

export class ElectronMainProcess {
    window: BrowserWindow | null = null;
    app: App = app;
    ipc: IpcMain = ipcMain;

    private _events: {[key:string]: {enabled: boolean, listeners: (() => void)[]}} = {
        "started": {enabled: false, listeners: []},
        "stopped": {enabled: false, listeners: []}
    };

    init() {
        app.on('ready', this.start);
        app.on('window-all-closed', this.stop);
    }

    start = () => {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "../bridge.js")
            }
        });

        this.window.loadFile('index.html');
        this.window.on('closed', () => {
            this.window = null;
        });

        this._events["started"].enabled = true;
        this._events["stopped"].enabled = false;

        for (const listener of this._events["started"].listeners) {
            listener();
        }
    }

    stop = () => {
        this._events["started"].enabled = false;
        this._events["stopped"].enabled = true;
        
        for (const listener of this._events["stopped"].listeners) {
            listener();
        }
        
        app.quit();
    }

    addListener(channel: "started" | "stopped", listener: () => void) {
        const event = this._events[channel];
        event.listeners.push(listener);
        if (event.enabled)
            listener();
    }

    removeListener(channel: "started" | "stopped", listener: () => void) {
        const event = this._events[channel];
        event.listeners = [...event.listeners.filter(x => x !== listener)]
        if (event.enabled)
            listener();
    }
}

