import { ILogger, Logger, Viewport } from "../engine";
import { IDeviceSettings, IElementProvider } from "../models/descriptors";

export class ElectronRenderProcess {
    public viewport: Viewport | null = null;
    public logger: ILogger | null = null;

    constructor (document: IElementProvider, window: IDeviceSettings) {
        if (this.viewport == null)
            this.viewport = new Viewport(document, window);
        
        if (this.logger == null)
            this.logger = new Logger(document);
    }
}