import { combineReducers } from 'redux';
import { blogState } from './general-component/reducer';

export const rootReducer = combineReducers({blogState: blogState});
