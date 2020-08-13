import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { GeneralComponent } from './general';
import { GeneralState } from './store/general-component/reducer';
import {
	changeDailyWaterFlow,
	changeSecondMaxFlow,
	setCountMode,
	setDeviceDiagram,
	setIsOpenScheme,
	setIsValidateError,
	setResultMode,
} from './store/general-component/actions';

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

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromGeneral = ConnectedProps<typeof connector>;

class GeneralContainer extends React.Component<PropsFromGeneral, {}> {
	constructor(props: PropsFromGeneral) {
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

export const generalContainer = connector(GeneralContainer);
