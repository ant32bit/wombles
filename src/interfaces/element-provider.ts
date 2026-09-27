export interface IElementProvider {
    body: HTMLElement;
    getElementById(elementId: string): HTMLElement | null;
    createElement(tagName: 'a', options?: ElementCreationOptions): HTMLAnchorElement;
    createElement(tagName: 'div', options?: ElementCreationOptions): HTMLDivElement;
    createElement(tagName: 'i', options?: ElementCreationOptions): HTMLElement;
    createElement(tagName: 'iframe', options?: ElementCreationOptions): HTMLIFrameElement;
    createElement(tagName: 'input', options?: ElementCreationOptions): HTMLInputElement;
    createElement(tagName: 'li', options?: ElementCreationOptions): HTMLLIElement;
    createElement(tagName: 'pre', options?: ElementCreationOptions): HTMLPreElement;
    createElement(tagName: 'span', options?: ElementCreationOptions): HTMLSpanElement;
}
