import { IDeviceSettings, IElementProvider } from "../models";
import { Rect } from "../models/locators";

export class Viewport {

    private _canvas: HTMLCanvasElement | null = null;

    private _ratio: number = 1;
    private _width: number = 0;
    private _height: number = 0;

    public get canvas(): HTMLCanvasElement | null { return this._canvas; }
    public get width(): number { return this._width; }
    public get height(): number { return this._height; }

    constructor(private elementProvider: IElementProvider, private deviceSettings: IDeviceSettings) {
        this._loadCanvas();
    }

    public getVisibleRect(): Rect {
        this._loadCanvas();
        const width = this._width / this._ratio;
        const height = this._height / this._ratio;
        return new Rect(0, 0, width, height);
    }

    private _loadCanvas(): void {
        if (this._canvas == null)
            this._canvas = this.elementProvider.getElementById('viewport') as HTMLCanvasElement;
        
        if (this._canvas != null) {
            this._ratio = this.deviceSettings.devicePixelRatio;
            this._width = this._canvas.clientWidth;
            this._height = this._canvas.clientHeight;
        }
    }
}


