import { IEventHandler, IElementProvider, IPostable } from '../interfaces';

export class VirtualMachineUI {

    public isReady: Promise<boolean>;
    public postable: IPostable;

    constructor(eventHandler: IEventHandler, elementProvider: IElementProvider) {
        let iframeReadyRes: (value: boolean) => void;

        this.isReady = new Promise<boolean>(res => {
            iframeReadyRes = res;
        });

        const startedListener = (e: Event) => {
            const s = (e as MessageEvent<string>)?.data;
            if (s === 'api:ready') {
                iframeReadyRes(true);
                eventHandler.removeEventListener('message', startedListener);
            }
        }

        eventHandler.addEventListener('message', startedListener);

        const iframe = elementProvider.createElement('iframe');
        iframe.classList.add('hidden');
        iframe.src = './internal.html';
        iframe.style = 'display: none';
        elementProvider.body.appendChild(iframe);

        this.postable = iframe.contentWindow!;
    }
}
