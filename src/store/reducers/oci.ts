import { action, OciState } from './custom';

const initialState: OciState = {
    config: {
        prereq: '',
    },
};

export function ociReducer(state: OciState = initialState, action: action): OciState {
    const payload = action.payload;
    switch (action.type) {
        case 'oci/config':
            return {
                ...state,
                config: payload,
            };

        default:
            return state;
    }
}
