import { action, AlbumState } from './custom';

const initialState: AlbumState = {
    categories: [],
};

export function albumReducer(state: AlbumState = initialState, action: action): AlbumState {
    const payload = action.payload;
    switch (action.type) {
        case 'album/categories':
            return {
                ...state,
                categories: payload,
            };
        default:
            return state;
    }
}
