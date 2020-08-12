import { combineReducers } from 'redux';
import { generalStateReducer } from './general-component/reducer';

export const rootReducer = combineReducers({generalState: generalStateReducer});
