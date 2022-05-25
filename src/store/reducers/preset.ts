import { action, PresetState } from './custom';

const initialState: PresetState = {
    categories: [],
};

export function albumReducer(state: PresetState = initialState, action: action): PresetState {
    const payload = action.payload;
    switch (action.type) {
        case 'preset/categories':
            return {
                ...state,
                categories: payload,
            };
        default:
            return state;
    }
}
