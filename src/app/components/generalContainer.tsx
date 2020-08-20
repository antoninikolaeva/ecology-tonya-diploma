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
import { bindActionCreators, Dispatch, AnyAction } from 'redux';

interface GeneralProps {
	generalState: GeneralState;
}

const mapStateToProps = (props: GeneralProps) => {
	return {
		secondMaxFlow: props.generalState.secondMaxFlow,
		dailyWaterFlow: props.generalState.dailyWaterFlow,
		countMode: props.generalState.countMode,
		deviceDiagram: props.generalState.deviceDiagram,
		isOpenScheme: props.generalState.isOpenScheme,
		isValidateError: props.generalState.isValidateError,
		resultMode: props.generalState.resultMode,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		changeDailyWaterFlow: bindActionCreators(changeDailyWaterFlow, dispatch),
		changeSecondMaxFlow: bindActionCreators(changeSecondMaxFlow, dispatch),
		setCountMode: bindActionCreators(setCountMode, dispatch),
		setDeviceDiagram: bindActionCreators(setDeviceDiagram, dispatch),
		setIsOpenScheme: bindActionCreators(setIsOpenScheme, dispatch),
		setIsValidateError: bindActionCreators(setIsValidateError, dispatch),
		setResultMode: bindActionCreators(setResultMode, dispatch),
	};
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromGeneral = ConnectedProps<typeof connector>;

class GeneralContainer extends React.Component<PropsFromGeneral, {}> {
	constructor(props: PropsFromGeneral) {
		super(props);
	}

	render() {
		return <GeneralComponent
			secondMaxFlow={this.props.secondMaxFlow}
			dailyWaterFlow={this.props.dailyWaterFlow}
			countMode={this.props.countMode}
			deviceDiagram={this.props.deviceDiagram}
			isOpenScheme={this.props.isOpenScheme}
			isValidateError={this.props.isValidateError}
			resultMode={this.props.resultMode}
			changeDailyWaterFlow={this.props.changeDailyWaterFlow}
			changeSecondMaxFlow={this.props.changeSecondMaxFlow}
			setCountMode={this.props.setCountMode}
			setDeviceDiagram={this.props.setDeviceDiagram}
			setIsOpenScheme={this.props.setIsOpenScheme}
			setIsValidateError={this.props.setIsValidateError}
			setResultMode={this.props.setResultMode} />;
	}
}

export const generalContainer = connector(GeneralContainer);
