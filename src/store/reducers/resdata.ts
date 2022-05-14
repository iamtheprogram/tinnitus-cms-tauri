import { ResdataState } from './custom';

const initialState: ResdataState = {
    selected: '',
    info: [],
    usage: [],
    infoData: {},
    thumbnail: '',
    checks: {},
};

export function resdataReducer(
    state: ResdataState = initialState,
    action: { type: string; payload: unknown },
): ResdataState {
    switch (action.type) {
        case 'resdata/selected': {
            return {
                ...state,
                selected: action.payload as string,
            };
        }
        case 'resdata/info': {
            return {
                ...state,
                info: action.payload as { name: string; value: unknown }[],
            };
        }
        case 'resdata/usage': {
            return {
                ...state,
                usage: action.payload as { name: string; value: unknown }[],
            };
        }
        case 'resdata/infodata': {
            return {
                ...state,
                infoData: action.payload,
            };
        }
        case 'resdata/checks': {
            return {
                ...state,
                checks: action.payload,
            };
        }
        case 'resdata/thumbnail': {
            return {
                ...state,
                thumbnail: action.payload as string,
            };
        }
        default:
            return state;
    }
}
