import { IEventHandler, IPostable } from "./interfaces";
import { StartupRequest, StartupResponse } from "./events";

type RouteMap = {
    'startup': { request: StartupRequest, response: StartupResponse }
}

export type Handler<T extends keyof RouteMap> =
    ((payload: RouteMap[T]['request']) =>
        RouteMap[T]['response'] | Promise<RouteMap[T]['response']>) | undefined;

export type HandlerMap = { [T in keyof RouteMap]: Handler<T> };

export class ApiRequestEvent {
    constructor(requestId: string, route: keyof RouteMap, request: any) {
        this.requestId = requestId;
        this.route = route;
        this.request = request;
    }

    public requestId: string;
    public route: keyof RouteMap;
    public request: any;
}

export class ApiResponseEvent {
    constructor(requestId: string, response: any) {
        this.requestId = requestId;
        this.response = response;
    }

    public requestId: string;
    public response: any;
}

export class EventManager {

    private pending = new Map<string, (value: any) => void>();
    private receiver: IPostable;

    constructor(transmitter: IEventHandler, receiver: IPostable, handlers: HandlerMap) {
        this.receiver = receiver;

        transmitter.addEventListener('message', async (event: Event) => {
            const apiRequest = (event as MessageEvent<ApiRequestEvent>)?.data;
            if (apiRequest && apiRequest.route != null) {
                const handler = handlers[apiRequest.route];
                if (!handler) return;

                const response = await (handler! as Handler<keyof RouteMap>)!(apiRequest.request);
                receiver.postMessage(new ApiResponseEvent(apiRequest.requestId, response));
                return;
            }

            const apiResponse = (event as MessageEvent<ApiResponseEvent>)?.data;
            if (apiResponse && apiResponse.requestId != null) {
                const resolve = this.pending.get(apiResponse.requestId);
                if (!resolve) return;

                resolve(apiResponse.response);
                this.pending.delete(apiResponse.requestId);
                return;
            }
        });
    }

    public request<T extends keyof RouteMap>(type: T, content: RouteMap[T]['request']): Promise<RouteMap[T]['response']> {
        return new Promise(res => {
            const requestId = crypto.randomUUID();
            this.pending.set(requestId, res as any);
            this.receiver.postMessage(new ApiRequestEvent(requestId, type, content));
        })
    }
}
