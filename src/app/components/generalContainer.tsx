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

	componentWillReceiveProps(nextProps: any, nextContext: any) {
		console.log(nextProps);
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
