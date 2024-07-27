import { IElementProvider } from "../models/descriptors";

export enum LogLevel {
    trace = 1,
    debug = 2,
    info = 3,
    warn = 4,
    error = 5,
    fatal = 6
}

export interface ILogger {
    logTrace(message: string): void;
    logDebug(message: string): void;
    logInformation(message: string): void;
    logWarning(message: string): void;
    logError(message: string): void;
    logFatal(message: string): void;
    log(level: LogLevel, message: string): void;
}

export class Logger implements ILogger {
    public static MaxLogs: number = 100;
    private static LevelClass: string[] = ["level-undefined", "level-trace", "level-debug", "level-info", "level-warn", "level-error", "level-fatal"];
    
    private logWindow: HTMLDivElement;
    private logContainer: HTMLUListElement;

    constructor(private elementProvider: IElementProvider) {
        const logsElement = this.elementProvider.getElementById('logs');
        if (logsElement == null) {
            throw new ReferenceError("no logs element");
        }
        
        let logContainer = logsElement.children[0] as HTMLUListElement;
        
        if (!logContainer || logContainer.id != 'logs-container') {
            logContainer = this.elementProvider.createElement("ul") as HTMLUListElement;
            logContainer.id = 'logs-container';
            logsElement.appendChild(logContainer);
        }

        this.logWindow = logsElement as HTMLDivElement;
        this.logContainer = logContainer;
    }

    logTrace = (message: string) => this.log(LogLevel.trace, message);
    logDebug = (message: string) => this.log(LogLevel.debug, message);
    logInformation = (message: string) => this.log(LogLevel.info, message);
    logWarning = (message: string) => this.log(LogLevel.warn, message);
    logError = (message: string) => this.log(LogLevel.error, message);
    logFatal = (message: string) => this.log(LogLevel.fatal, message);

    public log(level: LogLevel, message: string): void {
        if (this.logContainer == null)
            return;

        if (this.logContainer.children.length == Logger.MaxLogs)
        {
            const earliest = this.logContainer.firstChild;
            this.logContainer.removeChild(earliest!);
        }

        const logMessage = this.elementProvider.createTextNode(message);
        const logContent = this.elementProvider.createElement("span");
        logContent.classList.add("log-content");
        logContent.append(logMessage);
        const logCloser = this.elementProvider.createElement("div");
        logCloser.classList.add("log-close");
        const log = this.elementProvider.createElement("li");
        log.classList.add("log", Logger.LevelClass[level]);
        log.appendChild(logContent);
        log.appendChild(logCloser);
        logCloser.addEventListener("click", (ev: MouseEvent) => {this.logContainer.removeChild(log);});
        this.logContainer.appendChild(log);
        this.logWindow!.scrollTop = this.logWindow!.scrollHeight;
    }
}

export class NullLogger implements ILogger {

    logTrace: (message: string) => void;
    logDebug: (message: string) => void;
    logInformation: (message: string) => void;
    logWarning: (message: string) => void;
    logError: (message: string) => void;
    logFatal: (message: string) => void;

    constructor() {
        var devnull = (message: string) => {};

        this.logTrace = devnull;
        this.logDebug = devnull;
        this.logInformation = devnull;
        this.logWarning = devnull;
        this.logError = devnull;
        this.logFatal = devnull;
    }

    public log(level: LogLevel, message: string): void {

    }
}

export class ConsoleLogger implements ILogger {

    logTrace = (message: string) => this.log(LogLevel.trace, message);
    logDebug = (message: string) => this.log(LogLevel.debug, message);
    logInformation = (message: string) => this.log(LogLevel.info, message);
    logWarning = (message: string) => this.log(LogLevel.warn, message);
    logError = (message: string) => this.log(LogLevel.error, message);
    logFatal = (message: string) => this.log(LogLevel.fatal, message);

    public log(level: LogLevel, message: string): void {
        if (level == LogLevel.error || level == LogLevel.fatal) {
            console.error(message);
            return;
        }

        if (level == LogLevel.warn) {
            console.warn(message);
            return;
        }

        console.log(message);
    }
}