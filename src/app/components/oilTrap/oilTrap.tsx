import * as React from 'react';
import { OilTrapTypes } from '../general-resources';
import { labelTemplate } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, OilTrapResultData } from '../data-model';

export interface OilTrapProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: OilTrapTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface OilTrapState {
	isValidateError: boolean;
	isResult: boolean;
}

export class OilTrapComponent extends React.Component<OilTrapProps, OilTrapState> {
	constructor(props: OilTrapProps) {
		super(props);

		this.state = {
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		this.setState({
			isValidateError: false,
			isResult: false,
		});
	}

	private setOilTrapResult = () => {
		const oilTrapResult: OilTrapResultData = {
		};
		dataModel.setOilTrapResult(oilTrapResult);
	}

	private renderBaseData = () => {
		const { secondMaxFlow, dailyWaterFlow } = this.props;
		return <div>
			<div className={'input-data-title'}>Входные данные</div>
			{labelTemplate('Секундный максимальный расход', secondMaxFlow)}
			{labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
		</div>;
	}

	private renderInputArea = () => {
		const { type } = this.props;
		return (
			<>
				{this.renderCheckingButton()}
			</>
		);
	}

	private isInputReadyToCounting = (): boolean => {
		return true;
	}

	private resultCounting = () => {
		const { secondMaxFlow, type } = this.props;
		this.setOilTrapResult();

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return (
			<div className={'table-result'}>
				<Table bordered hover>
					<tbody>
					</tbody>
				</Table>
			</div>
		);
	}

	// Отрисовка кнопки расчета
	private renderCheckingButton = () => {
		const isNotReadyToCount = !this.isInputReadyToCounting();
		return isNotReadyToCount ? <button className={'btn btn-primary'} disabled>
			Показать результаты данной выборки
			</button> :
			<button className={'btn btn-primary'} onClick={() => this.resultCounting()}>
				Показать результаты данной выборки
			</button>;
	}

	// Отрисовка кнопки очистки
	private resetData = () => {
		return <button className={'btn btn-danger'}
			title={'Очистить входные данные'}
			onClick={() => this.clearPage()}>
			<i className={'far fa-trash-alt'}></i>
		</button>;
	}

	private renderToolbar = () => {
		return <div className={'device-count-toolbar'}>
			<button className={'btn btn-primary'} title={'Изменить схему'}
				onClick={this.returnToScheme}>
				<i className={'fas fa-reply'}></i>
			</button>
			{this.resetData()}
			<button className={'merge-result btn btn-success'}
				onClick={this.goToResult}
				title={'Cводная схема очитныех сооружений'}>
				<i className={'fas fa-trophy'}></i>
			</button>
		</div>;
	}

	private returnToScheme = () => {
		this.props.onCountMode(false);
	}

	private goToResult = () => {
		this.props.onCountMode(false);
		this.props.onResultMode(true);
	}

	render() {
		const { type } = this.props;
		return (
			<>
				<div className={'title-container'}>
					{type === OilTrapTypes.horizontal ?
						<div className={'count-title'}>Горизонтальные</div> :
						<div className={'count-title'}>Радиальные</div>}
					{this.renderToolbar()}
				</div>
				<div className={'device-container'}>
					<div className={'device-input'}>
						{this.renderBaseData()}
						{this.renderInputArea()}
					</div>
					<div className={'device-result'}>
						<div className={'input-data-title'}>Результаты расчета</div>
						{this.renderResult()}
					</div>
				</div>
			</>
		);
	}
}
