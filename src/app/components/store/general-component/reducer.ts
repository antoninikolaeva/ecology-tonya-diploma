import { SerializedDiagram } from 'ontodia';
import {
	CHANGE_SECOND_MAX_FLOW,
	CHANGE_DAILY_WATER_FLOW,
	COUNT_MODE,
	DEVICE_DIAGRAM,
	IS_OPEN_SCHEME,
	IS_VALIDATE_ERROR,
	RESULT_MODE,
	GeneralActionTypes,
} from './actions';

export interface GeneralState {
	isOpenScheme: boolean;
	secondMaxFlow: number;
	dailyWaterFlow: number;
	countMode: boolean;
	deviceDiagram: SerializedDiagram;
	isValidateError: boolean;
	resultMode: boolean;
}

const initialState: GeneralState = {
	isOpenScheme: false,
	secondMaxFlow: undefined,
	dailyWaterFlow: undefined,
	countMode: false,
	deviceDiagram: undefined,
	isValidateError: false,
	resultMode: false,
};

export function generalStateReducer(state: GeneralState = initialState, action: GeneralActionTypes) {
	switch (action.type) {
		case CHANGE_SECOND_MAX_FLOW:
			return { ...state, secondMaxFlow: action.payload };
		case CHANGE_DAILY_WATER_FLOW:
			return { ...state, dailyWaterFlow: action.payload };
		case COUNT_MODE:
			return { ...state, countMode: action.payload };
		case RESULT_MODE:
			return { ...state, resultMode: action.payload };
		case IS_OPEN_SCHEME:
			return { ...state, isOpenScheme: action.payload };
		case IS_VALIDATE_ERROR:
			return { ...state, isValidateError: action.payload };
		case DEVICE_DIAGRAM:
			return { ...state, deviceDiagram: action.payload };
	}
	return state;
}
