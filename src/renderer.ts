import { ElectronRenderProcess } from "./electron/electron-renderer";

document.addEventListener("DOMContentLoaded", () => {
    var render = new ElectronRenderProcess(document, window);

    window.electron.ping("ping").then((c: string) => {
        //document.body.appendChild(new Text(c))
        render.logger?.logInformation(c);
    });
});

