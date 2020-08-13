import { SerializedDiagram } from 'ontodia';

export const CHANGE_SECOND_MAX_FLOW = 'CHANGE_SECOND_MAX_FLOW';
export const CHANGE_DAILY_WATER_FLOW = 'CHANGE_DAILY_WATER_FLOW';
export const IS_OPEN_SCHEME = 'IS_OPEN_SCHEME';
export const IS_VALIDATE_ERROR = 'IS_VALIDATE_ERROR';
export const COUNT_MODE = 'COUNT_MODE';
export const RESULT_MODE = 'RESULT_MODE';
export const DEVICE_DIAGRAM = 'DEVICE_DIAGRAM';

interface IChangeSecondMaxFlow {
	type: typeof CHANGE_SECOND_MAX_FLOW;
	payload: number;
}

interface IChangeDailyWaterFlow {
	type: typeof CHANGE_DAILY_WATER_FLOW;
	payload: number;
}

interface IIsOpenScheme {
	type: typeof IS_OPEN_SCHEME;
	payload: boolean;
}

interface IIsValidateError {
	type: typeof IS_VALIDATE_ERROR;
	payload: boolean;
}

interface ICountMode {
	type: typeof COUNT_MODE;
	payload: boolean;
}

interface IResultMode {
	type: typeof RESULT_MODE;
	payload: boolean;
}

interface IDeviceDiagram {
	type: typeof DEVICE_DIAGRAM;
	payload: SerializedDiagram;
}

export type GeneralActionTypes = IChangeDailyWaterFlow | IChangeSecondMaxFlow |
	IIsOpenScheme | IIsValidateError | ICountMode | IResultMode | IDeviceDiagram;

export const changeSecondMaxFlow = (value: number): GeneralActionTypes => ({
	type: CHANGE_SECOND_MAX_FLOW,
	payload: value,
});

export const changeDailyWaterFlow = (value: number): GeneralActionTypes => ({
	type: CHANGE_DAILY_WATER_FLOW,
	payload: value,
});

export const setCountMode = (mode: boolean): GeneralActionTypes => ({
	type: COUNT_MODE,
	payload: mode,
});

export const setResultMode = (mode: boolean): GeneralActionTypes => ({
	type: RESULT_MODE,
	payload: mode,
});

export const setIsOpenScheme = (flag: boolean): GeneralActionTypes => ({
	type: IS_OPEN_SCHEME,
	payload: flag,
});

export const setIsValidateError = (flag: boolean): GeneralActionTypes => ({
	type: IS_VALIDATE_ERROR,
	payload: flag,
});

export const setDeviceDiagram = (diagram: SerializedDiagram): GeneralActionTypes => ({
	type: DEVICE_DIAGRAM,
	payload: diagram,
});
