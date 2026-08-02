export interface IElementProvider {
    body: HTMLElement;
    getElementById(elementId: string): HTMLElement | null;
    createElement(tagName: 'iframe', options?: ElementCreationOptions): HTMLIFrameElement;
}
