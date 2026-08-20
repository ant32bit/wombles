import { expect } from "chai";
import { Logger } from "../../../src/virtual-machine/memory/logger";

describe("logger", () => {
    it("can produce write logs", () => {
        const logger = new Logger();

        logger.startSession();
        logger.logWrite(5, 10);
        logger.logWrite(20, 20);
        logger.logWrite(6, 30);

        const logs = logger.popLogs();

        expect(logs.writes).to.deep.equal([
            {
                address: 5,
                changes: new Uint8Array([10, 30])
            },
            {
                address: 20,
                changes: new Uint8Array([20])
            }
        ]);
    });

    it ("can produce read logs", () => {
        const logger = new Logger();

        logger.startSession();
        logger.logRead(5);
        logger.logRead(20);
        logger.logRead(6);

        const logs = logger.popLogs();
        expect(logs.reads).to.deep.equal([
            { address: 5, size: 2 },
            { address: 20, size: 1 }
        ]);
    });
})
