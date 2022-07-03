import { action, SampleState } from './custom';
import { Category } from '@src/types/general';

const initialState: SampleState = {
    categories: new Array<Category>(),
};

export function sampleReducer(state: SampleState = initialState, action: action): SampleState {
    const payload = action.payload;
    switch (action.type) {
        case 'sample/categories':
            return {
                ...state,
                categories: payload,
            };
        default:
            return state;
    }
}
