import { action, GeneralState } from './custom';

const initialState: GeneralState = {
    auth: null,
};

export function generalReducer(state: GeneralState = initialState, action: action): GeneralState {
    const payload = action.payload;
    switch (action.type) {
        case 'general/auth':
            return {
                ...state,
                auth: payload,
            };
        default:
            return state;
    }
}
