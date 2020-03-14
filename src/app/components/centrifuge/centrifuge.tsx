import * as React from 'react';
import { CentrifugeTypes } from '../general-resources';
import { labelTemplate } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, CentrifugeResultData } from '../data-model';

export interface CentrifugeProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: CentrifugeTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface CentrifugeState {
	isValidateError: boolean;
	isResult: boolean;
}

export class CentrifugeComponent extends React.Component<CentrifugeProps, CentrifugeState> {
	constructor(props: CentrifugeProps) {
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

	private setCentrifugeResult = () => {
		const centrifugeResult: CentrifugeResultData = {
		};
		dataModel.setCentrifugeResult(centrifugeResult);
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
		this.setCentrifugeResult();

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
				title={'Cводная схема очитных сооружений'}>
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
					{type === CentrifugeTypes.opened
						? <div className={'count-title'}>Открытые гидроциклоны</div>
						: type === CentrifugeTypes.pressure
							? <div className={'count-title'}>Напорные гидроциклоны</div>
							: type === CentrifugeTypes.continuous
								? <div className={'count-title'}>Центрифуги непрерывного действия</div>
								: <div className={'count-title'}>Центрифуги периодического действия</div>}
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
