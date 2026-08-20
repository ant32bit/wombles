export type ReadLog = { address: number, size: number };
export type WriteLog = { address: number, changes: Uint8Array };
export type Logs = { reads: ReadLog[], writes: WriteLog[] };
