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
};

export type AlbumState = {
    categories: Array<{
        name: string;
        id: string;
        description: string;
        color: string;
    }>;
};

export type SampleState = {
    categories: Array<{
        name: string;
        id: string;
        description: string;
        color: string;
    }>;
};

export type PresetState = {
    categories: Array<{
        name: string;
        id: string;
        description: string;
        color: string;
    }>;
};

export type OciState = {
    config: { prereq: string };
};

export type CombinedStates = {
    ociReducer: OciState;
    resdataReducer: ResdataState;
    progressReducer: ProgState;
    generalReducer: GeneralState;
    albumReducer: AlbumState;
    sampleReducer: SampleState;
    presetReducer: PresetState;
};

export type action = {
    type: string;
    payload: any;
};
