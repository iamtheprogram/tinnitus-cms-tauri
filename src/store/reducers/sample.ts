import { action, SampleState } from './custom';

const initialState: SampleState = {
    categories: [],
};

export function albumReducer(state: SampleState = initialState, action: action): SampleState {
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
