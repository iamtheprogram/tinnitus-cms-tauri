import { action, PresetState } from './custom';
import { Category } from '@src/types/general';

const initialState: PresetState = {
    categories: new Array<Category>(),
};

export function presetReducer(state: PresetState = initialState, action: action): PresetState {
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
