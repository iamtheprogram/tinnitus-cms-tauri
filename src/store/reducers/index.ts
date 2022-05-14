import { combineReducers } from '@reduxjs/toolkit';
import { resdataReducer } from './resdata';
import { generalReducer } from './general';
import { ociReducer } from './oci';

export const rootReducer = combineReducers({
    ociReducer: ociReducer,
    resdataReducer: resdataReducer,
    generalReducer: generalReducer,
});
