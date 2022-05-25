import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import { albumReducer } from './reducers/album';
import { generalReducer } from './reducers/general';
import { ociReducer } from './reducers/oci';
import { resdataReducer } from './reducers/resdata';

export const rootReducer = combineReducers({
    ociReducer: ociReducer,
    resdataReducer: resdataReducer,
    generalReducer: generalReducer,
    albumReducer: albumReducer,
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
