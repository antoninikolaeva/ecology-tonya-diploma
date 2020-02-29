import * as React from 'react';

import { SumpTypes } from '../general-resources';
import { labelTemplate, InputTemplate, NULLSTR } from '../utils';
import { Table } from 'react-bootstrap';
import { SumpSource } from './sump-resources';

export interface SumpProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: SumpTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface SumpState {
	baseConcentrate: number;
	finalConcentrate: number;
	workingDeepSumpPart: number;
	isValidateError: boolean;
	isResult: boolean;
}

export class SumpComponent extends React.Component<SumpProps, SumpState> {
	private baseConcentrateRef: HTMLInputElement;
	private finalConcentrateRef: HTMLInputElement;
	private workingDeepSumpPartRef: HTMLInputElement;

	private highLightEffect: number;
	private hydraulicHugest: number;

	constructor(props: SumpProps) {
		super(props);

		this.state = {
			baseConcentrate: undefined,
			finalConcentrate: undefined,
			workingDeepSumpPart: undefined,
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		if (this.baseConcentrateRef) { this.baseConcentrateRef.value = NULLSTR; }
		if (this.finalConcentrateRef) { this.finalConcentrateRef.value = NULLSTR; }
		if (this.workingDeepSumpPartRef) { this.workingDeepSumpPartRef.value = NULLSTR; }
		this.setState({
			baseConcentrate: undefined,
			finalConcentrate: undefined,
			workingDeepSumpPart: undefined,
			isValidateError: false,
			isResult: false,
		});
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
		const {baseConcentrate} = this.state;
		return (
			<>
				<InputTemplate title={`Начальная концентрация взвешенных веществ в сточной воде, мг/л,
					диапазон[${SumpSource.minConcentrate} - ${SumpSource.maxConcentrate}]`}
					range={{ minValue: SumpSource.minConcentrate, maxValue: SumpSource.maxConcentrate }}
					placeholder={'Введите начальную концентрацию взвешенных веществ...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseConcentrateRef = input; }}
					onInput={(value) => { this.setState({ baseConcentrate: value }); }} />

				{baseConcentrate
				?	<InputTemplate title={`Допустимая конечная концентрация взвешенных веществ в осветленной воде, мг/л,
						диапазон[0 - ${baseConcentrate}]`}
						range={{ minValue: 0, maxValue: baseConcentrate }}
						placeholder={'Введите допустимую конечную концентрацию взвешенных веществ...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalConcentrateRef = input; }}
						onInput={(value) => { this.setState({ finalConcentrate: value }); }} />
				: null}

				<InputTemplate title={`Рабочая глубина отстойной части, мг/л,
					диапазон[${SumpSource.WorkingDeep.min} - ${SumpSource.WorkingDeep.max}]`}
					range={{ minValue: SumpSource.WorkingDeep.min, maxValue: SumpSource.WorkingDeep.max }}
					placeholder={'Введите рабочую глубину отстойной части...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.workingDeepSumpPartRef = input; }}
					onInput={(value) => { this.setState({ workingDeepSumpPart: value }); }} />

				{this.renderCheckingButton()}
			</>
		);
	}

	private isInputReadyToCounting = (): boolean => {
		const { type } = this.props;
		return true;
	}

	private resultCounting = () => {
		const { dailyWaterFlow, secondMaxFlow, type } = this.props;
		const { baseConcentrate, finalConcentrate, workingDeepSumpPart } = this.state;
		// Common formula 1: Э = 100 * (Cen - Cex) / Cen
		this.highLightEffect = 100 * (baseConcentrate - finalConcentrate) / baseConcentrate;
		// Formula horizontal 1: u0 = (1000 * Hset * Kset) / (tset * (Kset * Hset / h1));
		const periodOfSettling = this.findPeriodOfSettling();
		const exponentValue = this.selectExponentValue();
		this.hydraulicHugest = (1000 * workingDeepSumpPart * SumpSource.CoefficientUsingVolume.horizontal) / (periodOfSettling *
			Math.pow(SumpSource.CoefficientUsingVolume.horizontal * workingDeepSumpPart / SumpSource.layerHeight, exponentValue));
		console.log(this.hydraulicHugest);
		this.setState({ isResult: true });
	}

	private selectValueFromDiapason = (array: number [], valueToCompare: number): number => {
		let value;
		for (let index = 0; index < array.length; index++) {
			if (valueToCompare > array[index] && valueToCompare < array[index + 1]) {
				if (((array[index + 1] + array[index]) / 2) > valueToCompare) {
					value = array[index];
				} else {
					value = array[index + 1];
				}
			} else if (valueToCompare > array[index]) {
				if (index === array.length - 1) {
					value = array[index];
					break;
				}
				continue;
			} else if (valueToCompare < array[index]) {
				value = array[index];
				break;
			}
		}
		return value;
	}

	private findPeriodOfSettling = (): number => {
		const {baseConcentrate, } = this.state;
		const highLightEffect = this.selectValueFromDiapason(SumpSource.highLightEffectFixedValues, this.highLightEffect);
		const concentrate = this.selectValueFromDiapason(SumpSource.concentrateFixedValues, baseConcentrate);
		const periodValue = SumpSource.periodOfSettling.find(period =>
			highLightEffect === period.highLightEffect && concentrate === period.concentrate);
		return periodValue.period;
	}

	private selectExponentValue = () => {
		const {baseConcentrate} = this.state;
		const exponentConstMin = 56.781;
		const exponentMinValue = -0.987;
		const exponentConstMiddle = 13.97;
		const exponentMiddleValue = -0.692;
		const exponentConstMax = 86.258;
		const exponentMaxValue = -1.147;
		if (this.highLightEffect < SumpSource.HighLightEffectDiapason.low) {
			return exponentConstMin * Math.pow(baseConcentrate, exponentMinValue);
		} else if (this.highLightEffect > SumpSource.HighLightEffectDiapason.low &&
			this.highLightEffect < SumpSource.HighLightEffectDiapason.high) {
				return exponentConstMiddle * Math.pow(baseConcentrate, exponentMiddleValue);
		} else {
			return exponentConstMax * Math.pow(baseConcentrate, exponentMaxValue);
		}
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		const { type } = this.props;
		return (
			<div className={'table-result'}>
				<Table bordered hover>
					<tbody>
						<tr><td>Необходимый эффект осветления в отстойниках, %</td>
							<td>{this.highLightEffect ? this.highLightEffect.toFixed(3) : undefined}</td></tr>
						<tr><td>Гидравлическая крупность, мм/с</td>
							<td>{this.hydraulicHugest ? this.hydraulicHugest.toFixed(3) : undefined}</td></tr>
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
					{type === SumpTypes.horizontal ?
						<div className={'count-title'}>Горизонтальные</div> :
						type === SumpTypes.radial ?
							<div className={'count-title'}>Радиальные</div> :
							type === SumpTypes.vertical ?
								<div className={'count-title'}>Вертикальные</div> :
								<div className={'count-title'}>Вертикальные отстойники с нисходяще-восходящим потоком</div>}
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