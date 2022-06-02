import { action, AlbumState } from './custom';
import { Category } from '@src/types/general';

const initialState: AlbumState = {
    categories: new Array<Category>(),
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
