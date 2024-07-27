import { Processor, Memory } from './hardware-sim';


export class Womble {
    private address: number;
    private processor: Processor;

    constructor(address: number) {
        this.processor = new Processor;
        this.address = address;
    }

    
}

