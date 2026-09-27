import { IElementProvider } from '../interfaces'

export type StartVMFormSubmittedEvent = {
    initialWomble: string,
    memorySizeInBits: number,
    programSizeInBits: number
};

export type SubmitHandler = (event: StartVMFormSubmittedEvent) => void;

export class StartVMFormUI {

    private submitButton: HTMLInputElement;
    private submitHandler?: SubmitHandler;
    private form: HTMLFormElement;

    constructor(elementProvider: IElementProvider) {
        this.submitButton = elementProvider.getElementById("submit") as HTMLInputElement;

        const form = elementProvider.getElementById("start-params") as HTMLFormElement;
        form.onsubmit = ((event: SubmitEvent) => {
            event.preventDefault();
            this.enable(false);

            if (form.classList.contains('hidden'))
                return;

            if (!this.submitHandler)
                return;

            this.show(false);

            const data = new FormData(event.target as HTMLFormElement);
            const initialWomble = data.get('initial-womble')!.toString();
            const memorySizeInBits = parseInt(data.get('memory-size')!.toString());
            const programSizeInBits = parseInt(data.get('process-size')!.toString());

            this.submitHandler({initialWomble, memorySizeInBits, programSizeInBits});
        }).bind(this);

        this.form = form;

        var code = elementProvider.getElementById("code") as HTMLTextAreaElement;
        code.value = defaultCode;
    }

    public enable(enable: boolean): void {
        this.submitButton.disabled = !enable;
    }

    public show(show: boolean): void {
        show ? this.form.classList.remove('hidden') : this.form.classList.add('hidden');
    }

    public setSubmitHandler(handler: SubmitHandler) {
        this.submitHandler = handler;
    }
}

const defaultCode = `
# init the instruction start and curr instruction to $12, $13
gip $12
cpr $12, $13

# set the jumpback register $7 to -10
cpr $0, $7
set $7[3], 10
sub $0, $7, $1
cpr $1, $7

# set the instructions size register $8 to 892
cpr $0, $8
set $8[3], 48

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
cpr $7, $2
blt $1, $8, $2

# start the process
pst $9

# go back to start
sip $12
`;
