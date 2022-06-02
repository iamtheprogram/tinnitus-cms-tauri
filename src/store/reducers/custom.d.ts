import { Category } from '@src/types/general';

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
    categories: Category[];
};

export type SampleState = {
    categories: Category[];
};

export type PresetState = {
    categories: Category[];
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
