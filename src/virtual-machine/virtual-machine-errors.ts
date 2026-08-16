export class CannotAddProcessError extends Error {
    constructor() {
        super('Could not add process to VM');
    }
}
