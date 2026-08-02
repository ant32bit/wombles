import { InternalAPI } from './apis/internal-api'

window.document.addEventListener('DOMContentLoaded', main);

async function createInternal(): Promise<HTMLIFrameElement> {
    let iframeReadyRes: (value: boolean) => void;
    const iframeReady = new Promise<boolean>(res => {
        iframeReadyRes = res;
    });

    const startedListener = (e: Event) => {
        const s = (e as MessageEvent<string>)?.data;
        if (s === 'api:ready') {
            iframeReadyRes(true);
            window.removeEventListener('message', startedListener);
        }
    }

    window.addEventListener('message', startedListener);

    const iframe = document.createElement('iframe');
    iframe.src = './internal.html';
    iframe.style = 'display: none';
    document.body.appendChild(iframe);

    await iframeReady;

    return iframe;
}

async function main() {

    const iframe = await createInternal();
    const api = new InternalAPI(window, iframe.contentWindow!);

    api.startup(
        `
        # init the instruction start and curr instruction to $12, $13
        gip $12
        cpr $12, $13

        # set the jumpback register $7 to -10
        cpr $0, $7
        set $7[0], 128
        set $7[3], 10

        # set the instructions size register $8 to 892
        cpr $0, $8
        set $8[2], 3
        set $8[3], 124

        # create a process and set the pid to $9 and the ip to $10
        pcr $1, $2, $3
        cpr $2, $9
        cpr $3, $10

        # set current source byte and current destination byte to $14 and $11
        cpr $13, $14
        cpr $10, $11

        # copy the instruction from source to dest
        cpm $14, $11
        imp $14, 1
        imp $11, 1
        cpm $14, $11

        # move current to next instruction
        imp $13, 2
        imp $10, 2

        # loop while current source is less that instruction space
        sub $13, $12, $1
        cpr $2, $7
        blt $1, $8, $2

        # start the process
        pst $9

        # go back to start
        sip $12
        `
    );
}
