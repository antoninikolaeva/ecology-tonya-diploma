import * as React from 'react';
import { connect } from 'react-redux';
import { GeneralComponent } from './general';
import { GeneralState, ActionType } from './store/general-component/reducer';
import {
	changeDailyWaterFlow,
	changeSecondMaxFlow,
	setCountMode,
	setDeviceDiagram,
	setIsOpenScheme,
	setIsValidateError,
	setResultMode,
} from './store/general-component/actions';

interface GeneralDispatchBehavior {
	changeDailyWaterFlow(): ActionType;
	changeSecondMaxFlow(): ActionType;
	setCountMode(): ActionType;
	setDeviceDiagram(): ActionType;
	setIsOpenScheme(): ActionType;
	setIsValidateError(): ActionType;
	setResultMode(): ActionType;
}

export type GeneralProps = GeneralState & GeneralDispatchBehavior;

class GeneralContainer extends React.Component<GeneralProps, {}> {
	constructor(props: GeneralProps) {
		super(props);
	}

	render() {
		const {
			secondMaxFlow,
			dailyWaterFlow,
			countMode,
			deviceDiagram,
			isOpenScheme,
			isValidateError,
			resultMode,
			changeDailyWaterFlow,
			changeSecondMaxFlow,
			setCountMode,
			setDeviceDiagram,
			setIsOpenScheme,
			setIsValidateError,
			setResultMode,
		} = this.props;
		return <GeneralComponent
			secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			countMode={countMode}
			deviceDiagram={deviceDiagram}
			isOpenScheme={isOpenScheme}
			isValidateError={isValidateError}
			resultMode={resultMode}
			changeDailyWaterFlow={changeDailyWaterFlow}
			changeSecondMaxFlow={changeSecondMaxFlow}
			setCountMode={setCountMode}
			setDeviceDiagram={setDeviceDiagram}
			setIsOpenScheme={setIsOpenScheme}
			setIsValidateError={setIsValidateError}
			setResultMode={setResultMode} />;
	}
}

const mapStateToProps = (state: GeneralState) => {
	return {
		secondMaxFlow: state.secondMaxFlow,
		dailyWaterFlow: state.dailyWaterFlow,
		countMode: state.countMode,
		deviceDiagram: state.deviceDiagram,
		isOpenScheme: state.isOpenScheme,
		isValidateError: state.isValidateError,
		resultMode: state.resultMode,
	};
};

const mapDispatchToProps = {
	changeDailyWaterFlow,
	changeSecondMaxFlow,
	setCountMode,
	setDeviceDiagram,
	setIsOpenScheme,
	setIsValidateError,
	setResultMode,
};

export const generalContainer = connect(mapStateToProps, mapDispatchToProps)(GeneralContainer);
