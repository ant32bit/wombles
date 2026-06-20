
interface IHeapReservation {
    ownerId: number | null;
    start: number;
    size: number;
    prev: IHeapReservation | null;
    next: IHeapReservation | null;
}

export class HeapAllocation {

    public address: number;
    public size: number;
    private root: IHeapReservation;
    public reservations: {[ownerId: string]: IHeapReservation[]};

    constructor(address: number, size: number) {
        this.address = address;
        this.size = size;
        this.reservations = {};
        this.root = {
            ownerId: null,
            start: (address >>> 0) & 0x7FFFFFFF,
            size: size,
            prev: null,
            next: null
        };
    }

    public reserve(ownerId: number, size: number): number | null {

        let reservation: IHeapReservation | null = null;

        this.traverse(((r: IHeapReservation) => {
            reservation = this.insertReservation(r, size);
            return reservation != null;
        }).bind(this));

        if (reservation == null)
            return null;

        const r = reservation as IHeapReservation;
        r.ownerId = ownerId;
        (this.reservations[ownerId] ??= []).push(reservation);
        return (r.start | 0x80000000 >>> 0);
    }

    public unreserve(ownerId: number, address: number): boolean {
        if (!(ownerId in this.reservations))
            return false;

        const start = (address >>> 0) & 0x7FFFFFFF

        const index = this.reservations[ownerId].findIndex(r => r.start == start);
        if (index == -1)
            return false;

        const reservation = this.reservations[ownerId].splice(index, 1)[0];
        this.deleteReservation(reservation);

        if (this.reservations[ownerId].length == 0)
            delete this.reservations[ownerId];

        return true;
    }

    public unreserveAll(ownerId: number): void {
        if (ownerId in this.reservations) {
            this.reservations[ownerId].forEach(this.deleteReservation);
            delete this.reservations[ownerId];
        }
    }

    public hasReservations(): boolean {
        return this.root.next != null;
    }

    private insertReservation(at: IHeapReservation, size: number): IHeapReservation | null {
        if (at.ownerId != null)
            return null;

        if (at.size < size)
            return null;

        if (at.prev == null) {
            const root = at;
            at = {
                ownerId: at.ownerId,
                start: at.start,
                size: at.size,
                prev: root,
                next: root.next
            }

            root.size = 0;
            root.next = at;
        }

        at.size -= size;

        const prev: IHeapReservation = at.prev!;
        const next: IHeapReservation | null = at.size > 0 ? at : null;
        const curr: IHeapReservation = {
            ownerId: null,
            start: at.start,
            size,
            prev,
            next
        }

        if (next != null) {
            next.start += size;
            next.prev = curr;
        }

        prev.next = curr;

        return curr;
    }

    private deleteReservation(at: IHeapReservation): void {

        if (at.prev == null)
            return;

        let curr: IHeapReservation = at;
        curr.ownerId = null;

        const prev: IHeapReservation = curr.prev!;
        const next: IHeapReservation | null = curr.next;

        if (next != null && next.ownerId == null) {
            next.start = curr.start;
            next.size += curr.size;
            next.prev = prev;
            curr = next;
        }

        if (prev.ownerId == null) {
            prev.size += curr.size;
            prev.next = curr.next;
        }
    }

    public dump(): [number, number, number][] {

        const reservations: [number, number, number][] = [];

        this.traverse(r => {
            reservations.push([r.ownerId ?? 0, r.start, r.size]);
        });

        return reservations;
    }

    private traverse(callback: (reservation: IHeapReservation) => boolean | void) {
        let node: IHeapReservation | null = this.root;
        while (node != null) {
            const done = callback(node);
            if (done ?? false) return;
            node = node.next;
        }
    }
}
