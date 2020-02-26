import * as React from 'react';
import { SandTrapTypes } from '../general-resources';
import { InputTemplate, labelTemplate, SelectTemplate, ItemList } from '../utils';
import {
	HydraulicFinenessSand,
	hydraulicFinenessSandList,
	CoefficientOfSandTrapLength,
	SandTrapDeep,
	minSpeedFlowLimit,
	maxSpeedFlowLimit,
	minWaterFlowPeriod,
	AmountOfBlockedSand,
	minPeriodRemoveSediment,
	maxPeriodRemoveSediment,
	coefficientDispersionOfSediment,
	maxSpeedWaterFlow,
	minSpeedWaterFlow,
} from './sandTrap-resources';
import { ErrorAlert } from '../error/error';
import { SourceOfWasteWater } from '../grate/grate-resources';
import { Table } from 'react-bootstrap';

export interface SandTrapProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: SandTrapTypes;
}

export interface SandTrapState {
	speedOfWaterFlow: number;
	hydraulicFinenessSand: number;
	coefficientOfSandTrapLength: number;
	sandTrapDeep: number;
	secondMinFlow: number;
	sourceWaterList: SourceOfWasteWater;
	population: number;
	periodRemoveSediment: number;
	isValidateError: boolean;
	isResultReady: boolean;
}

export class SandTrapComponent extends React.Component<SandTrapProps, SandTrapState> {
	private speedOfWaterFlowRef: HTMLInputElement;
	private sandTrapDeepRef: HTMLInputElement;
	private secondMinFlowRef: HTMLInputElement;
	private populationRef: HTMLInputElement;
	private dailyVolumeOfSedimentRef: HTMLInputElement;
	private coefficientOfSandTrapLengthRef: HTMLOptionElement[] = [];
	private sourceWaterListRef: HTMLOptionElement[] = [];
	private amountOfSandTrapSection: number;
	private squareOneCompartmentOfSandTrap: number;
	private lengthOfSandTrap: number;
	private widthOfSandTrap: number;
	private minSpeedFlow: number;
	private maxSpeedFlow: number;
	private waterFlowPeriod: number;
	private volumeOfSandTrapSection: number;
	private dailyVolumeOfSediment: number;
	private deepSandTrapSection: number;
	private heightSedimentLayout: number;
	private fullSandTrapHeight: number;
	private amountOfBlockedSand = this.props.type === SandTrapTypes.horizontalCircle ||
	this.props.type === SandTrapTypes.horizontalForward ||
	this.props.type === SandTrapTypes.tangential ?
		AmountOfBlockedSand.horizontalAndTangential :
		AmountOfBlockedSand.aerated;

	constructor(props: SandTrapProps) {
		super(props);

		this.state = {
			speedOfWaterFlow: undefined,
			hydraulicFinenessSand: undefined,
			coefficientOfSandTrapLength: undefined,
			sandTrapDeep: undefined,
			secondMinFlow: undefined,
			sourceWaterList: undefined,
			population: undefined,
			periodRemoveSediment: undefined,
			isValidateError: false,
			isResultReady: false,
		};
	}

	private renderBaseData = () => {
		const {secondMaxFlow, dailyWaterFlow} = this.props;
		return <div>
			<div className={'input-data-title'}>Входные данные</div>
			{labelTemplate('Секундный максимальный расход', secondMaxFlow)}
			{labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
		</div>;
	}

	// Horizontal forward water move compartment
	private horizontalForwardWaterMove = () => {
		const {type, secondMaxFlow} = this.props;
		const {sourceWaterList} = this.state;
		const minDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle ?
			SandTrapDeep.horizontalMin : type === SandTrapTypes.aerated ? SandTrapDeep.aeratedMin : SandTrapDeep.tangential;
		const maxDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle ?
			SandTrapDeep.horizontalMax : type === SandTrapTypes.aerated ? SandTrapDeep.aeratedMax : SandTrapDeep.tangential;
		const hydraulicFinenessSand: ItemList[] = hydraulicFinenessSandList.map(fineness => {
			return { value: fineness, label: `${fineness}` };
		});
		hydraulicFinenessSand.unshift({value: undefined, label: 'Выберите гидровлическую крупность песка'});
		const selectSourceWaterList: ItemList[] = [
			{ value: undefined, label: 'Выберите источник сточных вод' },
			{ value: SourceOfWasteWater.manufacture, label: 'Производсвенный сток' },
			{ value: SourceOfWasteWater.city, label: 'Городской сток' },
		];
		this.defineAmountOfSandTrapSection();
		return <div>
			<InputTemplate title={`Скорость течения воды, м/c, диапазон[${minSpeedWaterFlow} - ${maxSpeedWaterFlow}]`}
				placeholder={''}
				range={{ minValue: minSpeedWaterFlow, maxValue: maxSpeedWaterFlow }}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				onInputRef={(input) => { this.speedOfWaterFlowRef = input; }}
				onInput={(value) => { this.setState({speedOfWaterFlow: value}); }} />
			<SelectTemplate title={'Выбор гидровлической крупности песка, мм/с'} itemList={hydraulicFinenessSand}
				onSelect={(value) => this.coefficientOfSandTrapLength(value)}
				onSelectRef={(optionList) => { this.coefficientOfSandTrapLengthRef = optionList; }} />
			<InputTemplate title={`Глубина песколовки, м/c, диапазон [${minDeep} - ${maxDeep}]`}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: minDeep, maxValue: maxDeep }}
				onInputRef={(input) => { this.sandTrapDeepRef = input; }}
				onInput={(value) => { this.setState({sandTrapDeep: value}); }} />
			<InputTemplate title={`Минимальный секундный расход сточных вод, м3/c, диапазон [0 - ${secondMaxFlow}]`}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: 0, maxValue: secondMaxFlow }}
				onInputRef={(input) => { this.secondMinFlowRef = input; }}
				onInput={(value) => { this.setState({secondMinFlow: value}); }} />
			<SelectTemplate title={'Выбор источника сточных вод'} itemList={selectSourceWaterList}
				onSelect={(value) => this.selectSourceWaterList(value)}
				onSelectRef={(optionList) => { this.sourceWaterListRef = optionList; }} />
			{sourceWaterList === SourceOfWasteWater.city ?
				<InputTemplate title={`Население, чел.`}
					placeholder={''}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.populationRef = input; }}
					onInput={(value) => { this.setState({population: value}); }} /> :
			sourceWaterList === SourceOfWasteWater.manufacture ?
				<InputTemplate title={`Суточный объем осадка, накапливающийся в песколовках, м3/сут.`}
					placeholder={''}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.dailyVolumeOfSedimentRef = input; }}
					onInput={(value) => { this.dailyVolumeOfSediment = value; }} /> :
					null}
			<InputTemplate title={`Интервал времени между выгрузками осадка из песколовки, сут,
				диапазон [${minPeriodRemoveSediment} - ${maxPeriodRemoveSediment}]`}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: minPeriodRemoveSediment, maxValue: maxPeriodRemoveSediment }}
				onInputRef={(input) => { this.sandTrapDeepRef = input; }}
				onInput={(value) => { this.setState({periodRemoveSediment: value}); }} />
			{this.renderCheckingButton()}
		</div>;
	}

	private defineAmountOfSandTrapSection = () => {
		const { dailyWaterFlow } = this.props;
		this.amountOfSandTrapSection = dailyWaterFlow / 40000;
		this.amountOfSandTrapSection = this.amountOfSandTrapSection < 2 ? 2 : Math.round(this.amountOfSandTrapSection);
	}

	private coefficientOfSandTrapLength = (hydraulicFinenessSand: string | number) => {
		const coefficientOfSandTrapLength = hydraulicFinenessSand === HydraulicFinenessSand.middle ?
			CoefficientOfSandTrapLength.middle :
			CoefficientOfSandTrapLength.high;
		this.setState({hydraulicFinenessSand: (hydraulicFinenessSand as number),
			coefficientOfSandTrapLength: (coefficientOfSandTrapLength as number)});
	}

	private selectSourceWaterList = (sourceWaterList: string | number) => {
		if (this.populationRef) { this.populationRef.value = ''; }
		if (this.dailyVolumeOfSedimentRef) { this.dailyVolumeOfSedimentRef.value = ''; }
		this.dailyVolumeOfSediment = undefined;
		this.setState({sourceWaterList: sourceWaterList as SourceOfWasteWater, population: undefined});
	}

	private resultCounting = () => {
		const {dailyWaterFlow, secondMaxFlow} = this.props;
		const {
			coefficientOfSandTrapLength,
			hydraulicFinenessSand,
			periodRemoveSediment,
			population,
			sandTrapDeep,
			secondMinFlow,
			speedOfWaterFlow
		} = this.state;
		// formula 1: n = dailyWaterFlow / 40000;
		this.amountOfSandTrapSection = dailyWaterFlow / 40000;
		this.amountOfSandTrapSection = this.amountOfSandTrapSection < 2 ? 2 : Math.round(this.amountOfSandTrapSection);
		// formula 2: omega = qmax / n * vs;
		this.squareOneCompartmentOfSandTrap = secondMaxFlow / (this.amountOfSandTrapSection * speedOfWaterFlow);
		// formula 3: Ls = 1000 * Ks * Hs * vs / u0;
		this.lengthOfSandTrap = 1000 * coefficientOfSandTrapLength * sandTrapDeep * speedOfWaterFlow / hydraulicFinenessSand;
		// formula 4: B = omega / Hs;
		this.widthOfSandTrap = this.squareOneCompartmentOfSandTrap / sandTrapDeep;
		// formula 5, 6: Vmiv(Vmax) = qmin(qmax) / B * n * Hs;
		this.minSpeedFlow = secondMinFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
		this.maxSpeedFlow = secondMaxFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
		// formula 7: T = Ls / Vmax;
		this.waterFlowPeriod = this.lengthOfSandTrap / this.maxSpeedFlow;
		// formula 8: Wсут = Np * qoc / 1000;
		if (population) {
			this.dailyVolumeOfSediment = population * this.amountOfBlockedSand / 1000;
		}
		// formula 9: W = Wсут * Toc / n;
		this.volumeOfSandTrapSection = this.dailyVolumeOfSediment * periodRemoveSediment / this.amountOfSandTrapSection;
		// formula 10: hб = W / B2;
		this.deepSandTrapSection = this.volumeOfSandTrapSection / Math.pow(this.widthOfSandTrap, 2);
		// formula 11: hoc = Kn * Wсут / B * n * Ls;
		this.heightSedimentLayout = (coefficientDispersionOfSediment * this.dailyVolumeOfSediment) /
			(this.widthOfSandTrap * this.amountOfSandTrapSection * this.lengthOfSandTrap);
		// formula 12: Hstr = Hs + hoc + 0.5;
		this.fullSandTrapHeight = sandTrapDeep + this.heightSedimentLayout + 0.5;

		if (this.amountOfSandTrapSection && this.squareOneCompartmentOfSandTrap &&
			this.lengthOfSandTrap && this.widthOfSandTrap && this.minSpeedFlow &&
			this.maxSpeedFlow && this.waterFlowPeriod && this.dailyVolumeOfSediment &&
			this.volumeOfSandTrapSection && this.deepSandTrapSection && this.heightSedimentLayout &&
			this.fullSandTrapHeight) {
			this.setState({isResultReady: true});
		}
	}

	private renderResult = () => {
		if (!this.state.isResultReady) {
			return;
		}
		return <div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					<tr><td>Необходимая площадь живого сечения одного отделения песколовки, м2</td>
						<td>{this.squareOneCompartmentOfSandTrap ? this.squareOneCompartmentOfSandTrap.toFixed(3) : undefined}</td></tr>
					<tr><td>Длина песколовки, м</td>
						<td>{this.lengthOfSandTrap ? this.lengthOfSandTrap.toFixed(3) : undefined}</td></tr>
					<tr><td>Ширина одного отделения песколовки, м</td>
						<td>{this.widthOfSandTrap ? this.widthOfSandTrap.toFixed(3) : undefined}</td></tr>
					<tr><td>Скорость течения сточных вод в песколовке при минимальном притоке, м/с</td>
						<td>{this.minSpeedFlow ? this.minSpeedFlow.toFixed(3) : undefined}</td></tr>
					<tr><td>Скорость течения сточных вод в песколовке при максимальном притоке, м/с</td>
						<td>{this.maxSpeedFlow ? this.maxSpeedFlow.toFixed(3) : undefined}</td></tr>
					<tr><td>Продолжительность протекания сточных вод, с</td>
						<td>{this.waterFlowPeriod ? this.waterFlowPeriod.toFixed(3) : undefined}</td></tr>
					<tr><td>Суточный объем осадка накапливаемого в песколовках, м3/сут.</td>
						<td>{this.dailyVolumeOfSediment ? this.dailyVolumeOfSediment.toFixed(3) : undefined}</td></tr>
					<tr><td>Объем бункера одного отделения песколовки, м3</td>
						<td>{this.volumeOfSandTrapSection ? this.volumeOfSandTrapSection.toFixed(3) : undefined}</td></tr>
					<tr><td>Глубина бункера песколовки, м</td>
						<td>{this.deepSandTrapSection ? this.deepSandTrapSection.toFixed(3) : undefined}</td></tr>
					<tr><td>Высота слоя осадка на дне песколовки, м</td>
						<td>{this.heightSedimentLayout ? this.heightSedimentLayout.toFixed(3) : undefined}</td></tr>
					<tr><td>Полная строительная высота песколовки, м</td>
						<td>{this.fullSandTrapHeight ? this.fullSandTrapHeight.toFixed(3) : undefined}</td></tr>
				</tbody>
			</Table>
		</div>;
	}

	private isCheckResultDataExisted = (): boolean => {
		const {
			coefficientOfSandTrapLength,
			hydraulicFinenessSand,
			periodRemoveSediment,
			population,
			sandTrapDeep,
			secondMinFlow,
			speedOfWaterFlow
		} = this.state;
		if (coefficientOfSandTrapLength &&
			hydraulicFinenessSand &&
			periodRemoveSediment &&
			(population || this.dailyVolumeOfSediment) &&
			sandTrapDeep &&
			secondMinFlow &&
			speedOfWaterFlow) {
				return true;
			} else {
				return false;
			}
	}

	// Отрисовка кнопки расчета
	private renderCheckingButton = () => {
		const isNotReadyToCount = !this.isCheckResultDataExisted();
		return isNotReadyToCount ? <button className={'btn btn-primary'} disabled>
				Показать результаты данной выборки
			</button> :
			<button className={'btn btn-primary'} onClick={() => this.resultCounting()}>
				Показать результаты данной выборки
			</button>;
	}

	render() {
		const {type} = this.props;
		return <div>
			<div className={'title-container'}>
			{type === SandTrapTypes.horizontalForward ?
				<div className={'count-title'}>Горизонтальные с прямолинейным движением воды</div> :
				type === SandTrapTypes.horizontalCircle ?
					<div className={'count-title'}>Горизонтальные с круговым движением воды</div> :
					type === SandTrapTypes.vertical ?
						<div className={'count-title'}>Вертикальные</div> :
						type === SandTrapTypes.tangential ?
							<div className={'count-title'}>Тангенциальные</div> :
							<div className={'count-title'}>Аэрируемые</div>}
			</div>
			<div className={'device-container'}>
				<div className={'device-input'}>
					{this.renderBaseData()}
					{this.horizontalForwardWaterMove()}
				</div>
				<div className={'device-result'}>
					<div className={'input-data-title'}>Результаты расчета</div>
						{this.renderResult()}
				</div>
			</div>
		</div>;
	}
}
