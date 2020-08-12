import { SerializedDiagram } from 'ontodia';
import {
	CHANGE_DAILY_WATER_FLOW,
	CHANGE_SECOND_MAX_FLOW,
	COUNT_MODE,
	DEVICE_DIAGRAM,
	IS_OPEN_SCHEME,
	IS_VALIDATE_ERROR,
	RESULT_MODE,
} from './constants';

export const changeSecondMaxFlow = (value: number) => ({
	type: CHANGE_SECOND_MAX_FLOW,
	payload: value,
});

export const changeDailyWaterFlow = (value: number) => ({
	type: CHANGE_DAILY_WATER_FLOW,
	payload: value,
});

export const setCountMode = (mode: boolean) => ({
	type: COUNT_MODE,
	payload: mode,
});

export const setResultMode = (mode: boolean) => ({
	type: RESULT_MODE,
	payload: mode,
});

export const setIsOpenScheme = (flag: boolean) => ({
	type: IS_OPEN_SCHEME,
	payload: flag,
});

export const setIsValidateError = (flag: boolean) => ({
	type: IS_VALIDATE_ERROR,
	payload: flag,
});

export const setDeviceDiagram = (diagram: SerializedDiagram) => ({
	type: DEVICE_DIAGRAM,
	payload: diagram,
});
