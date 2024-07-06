export interface IElectronAPI {
    ping: (data: string) => Promise<string>;
}

