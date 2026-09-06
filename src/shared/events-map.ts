export interface NetEvents {
    'fivex:ready': [];
    'fivex:notify': [message: string];
}

export interface NetProcs {
}

export type EventArgs<K> = K extends keyof NetEvents ? NetEvents[K] : any[];

export type EventName = keyof NetEvents | (string & {});

export type ProcName = keyof NetProcs | (string & {});
export type ProcArgs<K> = K extends keyof NetProcs ? NetProcs[K]['args'] : any[];
export type ProcReturn<K> = K extends keyof NetProcs ? NetProcs[K]['return'] : any;