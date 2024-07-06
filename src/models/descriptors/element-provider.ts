
export interface IElementProvider {
    getElementById(id: string): HTMLElement | null;
    getElementsByTagName(type: 'link'): HTMLCollectionOf<HTMLLinkElement>;
    createElement(type: 'canvas'): HTMLCanvasElement;
    createElement(type: 'li'): HTMLLIElement;
    createElement(type: 'ul'): HTMLUListElement;
    createElement(type: 'div'): HTMLDivElement;
    createElement(type: 'span'): HTMLSpanElement;
    createTextNode(text: string): Text;
}