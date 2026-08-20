export interface IElementProvider {
    body: HTMLElement;
    getElementById(elementId: string): HTMLElement | null;
    createElement(tagName: 'a', options?: ElementCreationOptions): HTMLAnchorElement;
    createElement(tagName: 'div', options?: ElementCreationOptions): HTMLDivElement;
    createElement(tagName: 'iframe', options?: ElementCreationOptions): HTMLIFrameElement;
    createElement(tagName: 'input', options?: ElementCreationOptions): HTMLInputElement;
    createElement(tagName: 'pre', options?: ElementCreationOptions): HTMLPreElement;
}
