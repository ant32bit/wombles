import { IEventHandler, IPostable } from "../interfaces";
import { StartupRequest, StartupResponse, TickCompletedEvent } from "../events";

type RouteMap = {
    'startup': { request: StartupRequest, response: StartupResponse },
    'start': { request: null, response: boolean },
    'pause': { request: null, response: boolean }
}

type Subscriptions = {
    'tickCompleted': { event: TickCompletedEvent }
}

export type Handler<T extends keyof RouteMap> =
    ((payload: RouteMap[T]['request']) =>
        RouteMap[T]['response'] | Promise<RouteMap[T]['response']>) | undefined;

export type HandlerMap = { [T in keyof RouteMap]: Handler<T> };

export class SubscriptionEventEnvelope {
    constructor(subscription: keyof Subscriptions, event: any) {
        this.subscription = subscription;
        this.event = event;
    }

    public subscription: keyof Subscriptions;
    public event: any
}

export class RequestEventEnvelope {
    constructor(requestId: string, route: keyof RouteMap, request: any) {
        this.requestId = requestId;
        this.route = route;
        this.request = request;
    }

    public requestId: string;
    public route: keyof RouteMap;
    public request: any;
}

export class ResponseEventEnvelope {
    constructor(requestId: string, response: any) {
        this.requestId = requestId;
        this.response = response;
    }

    public requestId: string;
    public response: any;
}

export class EventManager {

    private pending = new Map<string, (value: any) => void>();
    private subscribers = new Map<keyof Subscriptions, ((event: any) => void)[]>();
    private receiver: IPostable;

    constructor(transmitter: IEventHandler, receiver: IPostable, handlers: HandlerMap) {
        this.receiver = receiver;

        transmitter.addEventListener('message', async (event: Event) => {
            console.log(event);
            const subscriptionEvent = (event as MessageEvent<SubscriptionEventEnvelope>)?.data;
            if (subscriptionEvent && subscriptionEvent.subscription != null) {
                const subscriptions = this.subscribers.get(subscriptionEvent.subscription);
                if (!subscriptions) return;

                for (const callback of subscriptions)
                    callback(subscriptionEvent.event);

                return ;
            }

            const apiRequest = (event as MessageEvent<RequestEventEnvelope>)?.data;
            if (apiRequest && apiRequest.route != null) {
                const handler = handlers[apiRequest.route];
                if (!handler) return;

                const response = await (handler! as Handler<keyof RouteMap>)!(apiRequest.request);
                receiver.postMessage(new ResponseEventEnvelope(apiRequest.requestId, response));
                return;
            }

            const apiResponse = (event as MessageEvent<ResponseEventEnvelope>)?.data;
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
            this.receiver.postMessage(new RequestEventEnvelope(requestId, type, content));
        })
    }

    public emit<T extends keyof Subscriptions>(type: T, event: Subscriptions[T]['event']) {
        this.receiver.postMessage(new SubscriptionEventEnvelope(type, event));
    }

    public subscribe<T extends keyof Subscriptions>(type: T, callback: (event: Subscriptions[T]['event']) => void): void {
        let subscriptions = this.subscribers.get(type);
        if (subscriptions == undefined) {
            subscriptions = [];
            this.subscribers.set(type, subscriptions);
        }

        subscriptions.push(callback);
    }
}
