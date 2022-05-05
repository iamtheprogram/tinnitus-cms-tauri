export type ResdataState = {
    selected: string;
    info: { name: string; value: unknown }[];
    usage: { name: string; value: unknown }[];
    infoData: any;
    thumbnail: string;
    checks: unknown;
};

export type GeneralState = {
    auth: any;
    categories: Array<string>;
};

export type OciState = {
    config: { fingerprint: string; host: string; tenancy: string; id: string; namespace: string; prereq: string };
};

export type CombinedStates = {
    ociReducer: OciState;
    resdataReducer: ResdataState;
    progressReducer: ProgState;
    generalReducer: GeneralState;
};

export type action = {
    type: string;
    payload: any;
};
