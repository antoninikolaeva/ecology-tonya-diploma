import * as React from 'react';
import { SandTrapTypes } from '../general-resources';
import {
	InputTemplate,
	labelTemplate,
	SelectTemplate,
	ItemList,
	NULLSTR,
	resetSelectToDefault
} from '../utils';
import {
	HydraulicFinenessSand,
	hydraulicFinenessSandList,
	CoefficientOfSandTrapLength,
	SandTrapDeep,
	AmountOfBlockedSand,
	minPeriodRemoveSediment,
	maxPeriodRemoveSediment,
	coefficientDispersionOfSediment,
	maxSpeedWaterFlow,
	minSpeedWaterFlow,
	minSpeedFlowLimit,
	maxSpeedFlowLimit,
	minWaterFlowPeriod,
	widthCircleGutterForHorizontalCircle,
	diameterLowBaseOfBunker,
} from './sandTrap-resources';
import { SourceOfWasteWater } from '../grate/grate-resources';
import { Table } from 'react-bootstrap';
import { ErrorAlert } from '../error/error';

export interface SandTrapProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: SandTrapTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
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
	widthCircleGutter: number;
	isValidateError: boolean;
	isResultReady: boolean;
}

export class SandTrapComponent extends React.Component<SandTrapProps, SandTrapState> {
	private speedOfWaterFlowRef: HTMLInputElement;
	private sandTrapDeepRef: HTMLInputElement;
	private secondMinFlowRef: HTMLInputElement;
	private populationRef: HTMLInputElement;
	private dailyVolumeOfSedimentRef: HTMLInputElement;
	private periodRemoveSedimentRef: HTMLInputElement;
	private coefficientOfSandTrapLengthRef: HTMLOptionElement[] = [];
	private sourceWaterListRef: HTMLOptionElement[] = [];
	private widthCircleGutterRef: HTMLOptionElement[] = [];
	private hydraulicFinenessSandList: ItemList[] = hydraulicFinenessSandList.map(fineness => {
		return { value: fineness, label: `${fineness}` };
	});
	private selectSourceWaterList: ItemList[] = [
		{ value: undefined, label: 'Выберите источник сточных вод' },
		{ value: SourceOfWasteWater.manufacture, label: 'Производсвенный сток' },
		{ value: SourceOfWasteWater.city, label: 'Городской сток' },
	];
	private widthCircleGutterList: ItemList[] = widthCircleGutterForHorizontalCircle.map(width => {
		return { value: width, label: `${width}` };
	})
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
	private middleDiameter: number;
	private waterFlowPeriodMaxPressure: number;
	private outputDiameter: number;
	private bunkerHeightConusPart: number;
	private amountOfBlockedSand = this.props.type === SandTrapTypes.horizontalCircle ||
	this.props.type === SandTrapTypes.horizontalForward ||
	this.props.type === SandTrapTypes.tangential ?
		AmountOfBlockedSand.horizontalAndTangential :
		AmountOfBlockedSand.aerated;

	constructor(props: SandTrapProps) {
		super(props);

		this.hydraulicFinenessSandList.unshift({value: undefined, label: 'Выберите гидровлическую крупность песка'});
		this.widthCircleGutterList.unshift({value: undefined, label: 'Выберите ширину кольцевого желоба'});

		this.state = {
			speedOfWaterFlow: undefined,
			hydraulicFinenessSand: undefined,
			coefficientOfSandTrapLength: undefined,
			sandTrapDeep: undefined,
			secondMinFlow: undefined,
			sourceWaterList: undefined,
			population: undefined,
			periodRemoveSediment: undefined,
			widthCircleGutter: undefined,
			isValidateError: false,
			isResultReady: false,
		};
	}

	private clearPage = () => {
		if (this.speedOfWaterFlowRef) { this.speedOfWaterFlowRef.value = NULLSTR; }
		if (this.sandTrapDeepRef) { this.sandTrapDeepRef.value = NULLSTR; }
		if (this.secondMinFlowRef) { this.secondMinFlowRef.value = NULLSTR; }
		if (this.populationRef) { this.populationRef.value = NULLSTR; }
		if (this.dailyVolumeOfSedimentRef) { this.dailyVolumeOfSedimentRef.value = NULLSTR; }
		if (this.periodRemoveSedimentRef) { this.periodRemoveSedimentRef.value = NULLSTR; }
		resetSelectToDefault(this.coefficientOfSandTrapLengthRef, this.hydraulicFinenessSandList);
		resetSelectToDefault(this.sourceWaterListRef, this.selectSourceWaterList);
		resetSelectToDefault(this.widthCircleGutterRef, this.widthCircleGutterList);
		this.setState({
			speedOfWaterFlow: undefined,
			hydraulicFinenessSand: undefined,
			coefficientOfSandTrapLength: undefined,
			sandTrapDeep: undefined,
			secondMinFlow: undefined,
			sourceWaterList: undefined,
			population: undefined,
			periodRemoveSediment: undefined,
			widthCircleGutter: undefined,
			isValidateError: false,
			isResultReady: false,
		});
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
	private renderInputArea = () => {
		const {type, secondMaxFlow} = this.props;
		const {sourceWaterList} = this.state;
		const minDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle ?
			SandTrapDeep.horizontalMin : type === SandTrapTypes.aerated ? SandTrapDeep.aeratedMin : SandTrapDeep.tangential;
		const maxDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle ?
			SandTrapDeep.horizontalMax : type === SandTrapTypes.aerated ? SandTrapDeep.aeratedMax : SandTrapDeep.tangential;
		return <div>
			<InputTemplate title={`Скорость течения воды, м/c, диапазон[${minSpeedWaterFlow} - ${maxSpeedWaterFlow}]`}
				placeholder={''}
				range={{ minValue: minSpeedWaterFlow, maxValue: maxSpeedWaterFlow }}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				onInputRef={(input) => { this.speedOfWaterFlowRef = input; }}
				onInput={(value) => { this.setState({speedOfWaterFlow: value}); }} />

			{(type === SandTrapTypes.horizontalCircle) &&
			(this.waterFlowPeriodMaxPressure < minWaterFlowPeriod)
				? <ErrorAlert errorMessage={`Продолжительность протока: ${this.waterFlowPeriod}, должна быть не менее ${minWaterFlowPeriod}`} />
				: null}
			{type === SandTrapTypes.horizontalCircle
				? <SelectTemplate title={'Ширина кольцевого желоба песколовки, м'} itemList={this.widthCircleGutterList}
					onSelect={(value) => { this.setState({widthCircleGutter: value as number}); }}
					onSelectRef={(optionList) => { this.widthCircleGutterRef = optionList; }} />
				: null}

			<SelectTemplate title={'Выбор гидровлической крупности песка, мм/с'} itemList={this.hydraulicFinenessSandList}
				onSelect={(value) => this.coefficientOfSandTrapLength(value)}
				onSelectRef={(optionList) => { this.coefficientOfSandTrapLengthRef = optionList; }} />

			<InputTemplate title={`Глубина песколовки, м, диапазон [${minDeep} - ${maxDeep}]`}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: minDeep, maxValue: maxDeep }}
				onInputRef={(input) => { this.sandTrapDeepRef = input; }}
				onInput={(value) => { this.setState({sandTrapDeep: value}); }} />

			{(type === SandTrapTypes.horizontalForward)
				? <InputTemplate title={`Минимальный секундный расход сточных вод, м3/c, диапазон [0 - ${secondMaxFlow}]`}
					placeholder={''}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: 0, maxValue: secondMaxFlow }}
					onInputRef={(input) => { this.secondMinFlowRef = input; }}
					onInput={(value) => { this.setState({secondMinFlow: value}); }} />
				: null}

			{(type === SandTrapTypes.horizontalForward) &&
			(this.minSpeedFlow > minSpeedFlowLimit && this.minSpeedFlow < maxSpeedFlowLimit) &&
			(this.maxSpeedFlow > minSpeedFlowLimit && this.maxSpeedFlow < maxSpeedFlowLimit)
				? <ErrorAlert errorMessage={`Минимальная: ${this.minSpeedFlow} и максимальная: ${this.maxSpeedFlow}\n
					скорости должны удовлетворять следующему диапазону: [${minSpeedFlowLimit} < Vmin(Vmax) < ${maxSpeedFlowLimit}]`} />
				: null}

			{(type === SandTrapTypes.horizontalForward) &&
			(this.waterFlowPeriod < minWaterFlowPeriod)
				? <ErrorAlert errorMessage={`Продолжительность протекания сточных вод: ${this.waterFlowPeriod},\n
					должна быть не менее ${minWaterFlowPeriod}`} />
				: null}

			<SelectTemplate title={'Выбор источника сточных вод'} itemList={this.selectSourceWaterList}
				onSelect={(value) => this.selectSourceWaterListCount(value)}
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
				onInputRef={(input) => { this.periodRemoveSedimentRef = input; }}
				onInput={(value) => { this.setState({periodRemoveSediment: value}); }} />

			{this.renderCheckingButton()}
		</div>;
	}

	private coefficientOfSandTrapLength = (hydraulicFinenessSand: string | number) => {
		const coefficientOfSandTrapLength = hydraulicFinenessSand === HydraulicFinenessSand.middle ?
			CoefficientOfSandTrapLength.middle :
			CoefficientOfSandTrapLength.high;
		this.setState({hydraulicFinenessSand: (hydraulicFinenessSand as number),
			coefficientOfSandTrapLength: (coefficientOfSandTrapLength as number)});
	}

	private selectSourceWaterListCount = (sourceWaterList: string | number) => {
		if (this.populationRef) { this.populationRef.value = NULLSTR; }
		if (this.dailyVolumeOfSedimentRef) { this.dailyVolumeOfSedimentRef.value = NULLSTR; }
		this.dailyVolumeOfSediment = undefined;
		this.setState({sourceWaterList: sourceWaterList as SourceOfWasteWater, population: undefined});
	}

	private resultCounting = () => {
		const {dailyWaterFlow, secondMaxFlow, type} = this.props;
		const {
			coefficientOfSandTrapLength,
			hydraulicFinenessSand,
			periodRemoveSediment,
			population,
			sandTrapDeep,
			secondMinFlow,
			speedOfWaterFlow,
			widthCircleGutter
		} = this.state;
		// formula 1: n = dailyWaterFlow / 40000(15000);
		if (type === SandTrapTypes.horizontalForward) {
			this.amountOfSandTrapSection = dailyWaterFlow / 40000;
		} else if (type === SandTrapTypes.horizontalCircle) {
			this.amountOfSandTrapSection = dailyWaterFlow / 15000;
		}
		this.amountOfSandTrapSection = this.amountOfSandTrapSection < 2 ? 2 : Math.round(this.amountOfSandTrapSection);
		// formula 2: omega = qmax / n * vs;
		this.squareOneCompartmentOfSandTrap = secondMaxFlow / (this.amountOfSandTrapSection * speedOfWaterFlow);
		// formula 3: Ls = 1000 * Ks * Hs * vs / u0;
		this.lengthOfSandTrap = 1000 * coefficientOfSandTrapLength * sandTrapDeep * speedOfWaterFlow / hydraulicFinenessSand;
		if (type === SandTrapTypes.horizontalForward) {
			// formula 4: B = omega / Hs;
			this.widthOfSandTrap = this.squareOneCompartmentOfSandTrap / sandTrapDeep;
			// formula 5, 6: Vmiv(Vmax) = qmin(qmax) / B * n * Hs; Should be in the diapason [0.15-0.3]
			this.minSpeedFlow = secondMinFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
			this.maxSpeedFlow = secondMaxFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
			// formula 7: T = Ls / Vmax;
			this.waterFlowPeriod = this.lengthOfSandTrap / this.maxSpeedFlow;
		}
		// formula 8: Wсут = Np * qoc / 1000;
		if (population) {
			this.dailyVolumeOfSediment = population * this.amountOfBlockedSand / 1000;
		}
		// formula 9: W = Wсут * Toc / n;
		this.volumeOfSandTrapSection = this.dailyVolumeOfSediment * periodRemoveSediment / this.amountOfSandTrapSection;
		if (type === SandTrapTypes.horizontalCircle) {
			// formula (horizontal circle) D0 = Ls / pi;
			this.middleDiameter = this.lengthOfSandTrap / Math.PI;
			// formula (horizontal circle) T = pi * D0 / vs;
			this.waterFlowPeriodMaxPressure = Math.PI * this.middleDiameter / speedOfWaterFlow;
			// formula (horizontal circle) D =  D0 + Bж;
			this.outputDiameter = this.middleDiameter + widthCircleGutter;
			// formula (horizontal circle) hk = 12W / pi(D02 + d2(0.4) + D0d);
			this.bunkerHeightConusPart = 12 * this.volumeOfSandTrapSection / Math.PI *
				(Math.pow(this.middleDiameter, 2) + diameterLowBaseOfBunker + this.middleDiameter * diameterLowBaseOfBunker);
		}
		if (type === SandTrapTypes.horizontalForward) {
			// formula 10: hб = W / B2;
			this.deepSandTrapSection = this.volumeOfSandTrapSection / Math.pow(this.widthOfSandTrap, 2);
			// formula 11: hoc = Kn * Wсут / B * n * Ls;
			this.heightSedimentLayout = (coefficientDispersionOfSediment * this.dailyVolumeOfSediment) /
				(this.widthOfSandTrap * this.amountOfSandTrapSection * this.lengthOfSandTrap);
			// formula 12a: Hstr = Hs + hoc + 0.5;
			this.fullSandTrapHeight = sandTrapDeep + this.heightSedimentLayout + 0.5;
		} else if (type === SandTrapTypes.horizontalCircle) {
			// formula 12b: Hstr = Hs + hk + 0.5;
			this.fullSandTrapHeight = sandTrapDeep + this.bunkerHeightConusPart + 0.5;
		}

		if (type === SandTrapTypes.horizontalForward && this.amountOfSandTrapSection && this.squareOneCompartmentOfSandTrap &&
			this.lengthOfSandTrap && this.widthOfSandTrap && this.minSpeedFlow && this.maxSpeedFlow &&
			this.dailyVolumeOfSediment && this.volumeOfSandTrapSection && this.deepSandTrapSection &&
			this.heightSedimentLayout && this.fullSandTrapHeight) {
			this.setState({isResultReady: true});
		}
		if (type === SandTrapTypes.horizontalCircle && this.amountOfSandTrapSection && this.squareOneCompartmentOfSandTrap &&
			this.lengthOfSandTrap && this.dailyVolumeOfSediment && this.volumeOfSandTrapSection &&
			this.middleDiameter && this.waterFlowPeriodMaxPressure && this.outputDiameter &&
			this.bunkerHeightConusPart && this.fullSandTrapHeight) {
			this.setState({isResultReady: true});
		}
	}

	private isInputReadyToCounting = (): boolean => {
		const {type} = this.props;
		const {
			coefficientOfSandTrapLength,
			hydraulicFinenessSand,
			periodRemoveSediment,
			population,
			sandTrapDeep,
			secondMinFlow,
			speedOfWaterFlow,
			widthCircleGutter,
		} = this.state;
		const onlyForHorizontalForward = type === SandTrapTypes.horizontalForward && secondMinFlow ? true : false;
		const onlyForHorizontalCircle = type === SandTrapTypes.horizontalCircle && widthCircleGutter ? true : false;
		const commonHorizontal = (type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle) &&
			coefficientOfSandTrapLength && hydraulicFinenessSand && periodRemoveSediment &&
			(population || this.dailyVolumeOfSediment) && sandTrapDeep && speedOfWaterFlow ? true : false;
		if (type === SandTrapTypes.horizontalForward) {
			return onlyForHorizontalForward && commonHorizontal;
		}
		if (type === SandTrapTypes.horizontalCircle) {
			return onlyForHorizontalCircle && commonHorizontal;
		}
	}

	private renderResult = () => {
		if (!this.state.isResultReady) {
			return;
		}
		const { type } = this.props;
		return <div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					<tr><td>Необходимая площадь живого сечения одного отделения песколовки, м2</td>
						<td>{this.squareOneCompartmentOfSandTrap ? this.squareOneCompartmentOfSandTrap.toFixed(3) : undefined}</td></tr>
					<tr><td>Длина песколовки, м</td>
						<td>{this.lengthOfSandTrap ? this.lengthOfSandTrap.toFixed(3) : undefined}</td></tr>
					{type === SandTrapTypes.horizontalForward
					? <>
						<tr><td>Ширина одного отделения песколовки, м</td>
							<td>{this.widthOfSandTrap ? this.widthOfSandTrap.toFixed(3) : undefined}</td></tr>
						<tr><td>Скорость течения сточных вод в песколовке при минимальном притоке, м/с</td>
							<td>{this.minSpeedFlow ? this.minSpeedFlow.toFixed(3) : undefined}</td></tr>
						<tr><td>Скорость течения сточных вод в песколовке при максимальном притоке, м/с</td>
							<td>{this.maxSpeedFlow ? this.maxSpeedFlow.toFixed(3) : undefined}</td></tr>
						<tr><td>Продолжительность протекания сточных вод, с</td>
							<td>{this.waterFlowPeriod ? this.waterFlowPeriod.toFixed(3) : undefined}</td></tr>
						<tr><td>Глубина бункера песколовки, м</td>
							<td>{this.deepSandTrapSection ? this.deepSandTrapSection.toFixed(3) : undefined}</td></tr>
						<tr><td>Высота слоя осадка на дне песколовки, м</td>
							<td>{this.heightSedimentLayout ? this.heightSedimentLayout.toFixed(3) : undefined}</td></tr>
					</>
					: null}

					{type === SandTrapTypes.horizontalCircle
					? <>
						<tr><td>Средний диаметр, м</td>
							<td>{this.middleDiameter ? this.middleDiameter.toFixed(3) : undefined}</td></tr>
						<tr><td>Продолжительность протекания, с</td>
							<td>{this.waterFlowPeriodMaxPressure ? this.waterFlowPeriodMaxPressure.toFixed(3) : undefined}</td></tr>
						<tr><td>Наружный диаметр, м</td>
							<td>{this.outputDiameter ? this.outputDiameter.toFixed(3) : undefined}</td></tr>
						<tr><td>Высота конической части бункера, м</td>
							<td>{this.bunkerHeightConusPart ? this.bunkerHeightConusPart.toFixed(3) : undefined}</td></tr>
					</>
					: null}

					<tr><td>Суточный объем осадка накапливаемого в песколовках, м3/сут.</td>
						<td>{this.dailyVolumeOfSediment ? this.dailyVolumeOfSediment.toFixed(3) : undefined}</td></tr>
					<tr><td>Объем бункера одного отделения песколовки, м3</td>
						<td>{this.volumeOfSandTrapSection ? this.volumeOfSandTrapSection.toFixed(3) : undefined}</td></tr>
					<tr><td>Полная строительная высота песколовки, м</td>
						<td>{this.fullSandTrapHeight ? this.fullSandTrapHeight.toFixed(3) : undefined}</td></tr>
				</tbody>
			</Table>
		</div>;
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
		</div>;
	}
}
