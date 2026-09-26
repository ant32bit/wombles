import { RegisterType } from "../virtual-machine/processor/process-mapping";

export class GetProcessRequest {
    public processId: number;

    constructor(processId: number) {
        this.processId = processId;
    }
}

export type ProcessSnapshot = { processId: number, code: string, registers: number[], stack: number[] }

export class GetProcessResponse {
    public static ProcessNotFound: GetProcessResponse = new GetProcessResponse(undefined);

    public processSnapshot: ProcessSnapshot | undefined;

    constructor(processSnapshot?: ProcessSnapshot) {
        this.processSnapshot = processSnapshot;
    }
}
