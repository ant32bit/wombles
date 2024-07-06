export interface IKeyEventDispatcher {
    addEventListener(type: 'keyup'|'keydown', listener: (event: KeyboardEvent) => void): void;
    removeEventListener(type: 'keyup'|'keydown', listener: (event: KeyboardEvent) => void): void;
}