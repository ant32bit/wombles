

export type CommandDelegate = () => boolean;

export class ChainOfCommand {

    private chain?: ICommandChainLink;

    constructor(chain: CommandDelegate[]) {
        let prev: ICommandChainLink | undefined;
        for (const command of chain) {
            const link: ICommandChainLink = { command };
            if (!prev)
                this.chain = link;
            else
                prev.next = link;

            prev = link;
        }

        if (prev)
            prev.next = this.chain;
    }

    public run(): Promise<void> {
        return new Promise<void>(
            ((resolve: (value: void | PromiseLike<void>) => void) =>
                this.executeLink(this.chain, resolve)).bind(this));
    }

    public executeLink(link: ICommandChainLink | undefined, resolve: () => void): void {
        if (!link)
            return resolve();

        const go = link.command();
        const next = go ? link.next : undefined;

        if (!next)
            return resolve();

        setTimeout((() => this.executeLink(next, resolve)).bind(this), 0);
    }
}

interface ICommandChainLink {
    command: CommandDelegate;
    next?: ICommandChainLink;
}
