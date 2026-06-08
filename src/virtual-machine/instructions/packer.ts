
// 0 0000  4 0100  8 1000  C 1100
// 1 0001  5 0101  9 1001  D 1101
// 2 0010  6 0110  A 1010  E 1110
// 3 0011  7 0111  B 1011  F 1111

export function pack(head: number, pack: number[], args: number[]): number {
    let packedArgs: number = 0;

    for (let i = 0; i < args.length; i++) {
        packedArgs <<= pack[i + 1];
        packedArgs += args[i];
    }

    return head + packedArgs;
}

export function unpack(value: number, pack: number[]): number[] {
    const components: number[] = [];
    let packed = value;
    for (let i = pack.length - 1; i >= 0; i--) {
        const size = pack[i];
        const mask = (1 << size) - 1;
        components.unshift(packed & mask);
        packed = packed >>> size;
    }
    return components;
}
