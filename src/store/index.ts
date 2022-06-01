import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { albumReducer } from './reducers/album';
import { generalReducer } from './reducers/general';
import { ociReducer } from './reducers/oci';
import { presetReducer } from './reducers/preset';
import { resdataReducer } from './reducers/resdata';
import { sampleReducer } from './reducers/sample';

export const rootReducer = combineReducers({
    ociReducer: ociReducer,
    resdataReducer: resdataReducer,
    generalReducer: generalReducer,
    albumReducer: albumReducer,
    sampleReducer: sampleReducer,
    presetReducer: presetReducer,
});

const persistConfig = {
    key: 'root',
    storage: sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => {
    const store = createStore(persistedReducer);
    const persistor = persistStore(store);
    return { store, persistor };
};
