export interface IEventHandler {
    addEventListener(type: string, listener: (event: Event) => void, options?: boolean | AddEventListenerOptions): void
    removeEventListener(type: string, listener: (event: Event) => void, options?: boolean | EventListenerOptions): void
}
