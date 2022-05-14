import { action, GeneralState } from './custom';

const initialState: GeneralState = {
    auth: null,
    categories: [],
};

export function generalReducer(state: GeneralState = initialState, action: action): GeneralState {
    const payload = action.payload;
    switch (action.type) {
        case 'general/auth':
            return {
                ...state,
                auth: payload,
            };
        case 'general/categories':
            return {
                ...state,
                categories: payload,
            };
        default:
            return state;
    }
}
