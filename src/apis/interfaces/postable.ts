export interface IPostable {
    postMessage(message: any, options?: WindowPostMessageOptions): void;
}
