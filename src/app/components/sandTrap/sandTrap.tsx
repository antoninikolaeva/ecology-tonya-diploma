import * as React from 'react';
import { SandTrapTypes } from '../general-resources';
import {
	InputTemplate,
	labelTemplate,
	SelectTemplate,
	ItemList,
	NULLSTR,
	resetSelectToDefault,
	TableRow
} from '../utils';
import { SandTrapSource } from './sandTrap-resources';
import { Table } from 'react-bootstrap';
import { ErrorAlert } from '../error/error';
import { SandTrapResultData, dataModel } from '../data-model';
import { selectValueFromDiapasonOfFilteredArray } from '../grate/grate';

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
	periodRemoveSediment: number;
	sandTrapPressure: number;
	timeWaterInTrap: number;
	alpha: number;
	sandLayerHeight: number;
	aeratedIntensive: number;
	middleValueBPK5: number;
	middleVolumeWasteWater: number;
	isValidateError: boolean;
	isResult: boolean;
}

export class SandTrapComponent extends React.Component<SandTrapProps, SandTrapState> {
	private speedOfWaterFlowRef: HTMLInputElement;
	private sandTrapDeepRef: HTMLInputElement;
	private secondMinFlowRef: HTMLInputElement;
	private populationRef: HTMLInputElement;
	private dailyVolumeOfSedimentRef: HTMLInputElement;
	private periodRemoveSedimentRef: HTMLInputElement;
	private sandTrapPressureRef: HTMLInputElement;
	private timeWaterInTrapRef: HTMLInputElement;
	private sandLayerHeightRef: HTMLInputElement;
	private aeratedIntensiveRef: HTMLInputElement;
	private middleValueBPK5Ref: HTMLInputElement = undefined;
	private middleVolumeWasteWaterRef: HTMLInputElement = undefined;
	private coefficientOfSandTrapLengthRef: HTMLOptionElement[] = [];
	private alphaRef: HTMLOptionElement[] = [];
	private hydraulicFinenessSandList: ItemList[] = this.props.type === SandTrapTypes.tangential ||
		this.props.type === SandTrapTypes.vertical
		? SandTrapSource.hydraulicFinenessSandListFull.map(fineness => {
			return { value: fineness, label: `${fineness}` };
			})
		: SandTrapSource.hydraulicFinenessSandListLess.map(fineness => {
				return { value: fineness, label: `${fineness}` };
			});

	private alphaList: ItemList[] = SandTrapSource.alphaList.map(alpha => {
		return { value: alpha, label: `${alpha}` };
	});
	private amountOfSandTrapSection: number;
	private squareOneCompartmentOfSandTrap: number;
	private lengthOfSandTrap: number;
	private widthOfSandTrap: number;
	private minSpeedFlow: number;
	private maxSpeedFlow: number;
	private waterFlowPeriod: number;
	private volumeOfSandTrapSection: number;
	private dailyVolumeOfSediment: number;
	private amountOfDwellers: number;
	private deepSandTrapSection: number;
	private heightSedimentLayout: number;
	private fullSandTrapHeight: number;
	private middleDiameter: number;
	private waterFlowPeriodMaxPressure: number;
	private outputDiameter: number;
	private bunkerHeightConusPart: number;
	private squareOfEachCompartment: number;
	private diameterOfEachCompartment: number;
	private deepOfTheBunker: number;
	private heightOfTheBunker: number;
	private periodBetweenSedimentOutput: number;
	private deepOfSandTrap: number;
	private hydroMechanicWaterFlow: number;
	private outputPipePressure: number;
	private generalAirFlow: number;
	private amountOfBlockedSand = this.props.type === SandTrapTypes.horizontalCircle ||
		this.props.type === SandTrapTypes.horizontalForward ||
		this.props.type === SandTrapTypes.tangential ?
		SandTrapSource.AmountOfBlockedSand.horizontalAndTangential :
		SandTrapSource.AmountOfBlockedSand.aerated;
	
	private sandTrapResult: SandTrapResultData;

	constructor(props: SandTrapProps) {
		super(props);

		this.hydraulicFinenessSandList.unshift({ value: undefined, label: 'Выберите гидравлическую крупность песка' });

		this.alphaList.unshift({ value: undefined, label: 'Выберите соотношение ширины и глубины песколовки' });

		this.state = {
			speedOfWaterFlow: undefined,
			hydraulicFinenessSand: undefined,
			coefficientOfSandTrapLength: undefined,
			sandTrapDeep: undefined,
			secondMinFlow: undefined,
			periodRemoveSediment: undefined,
			sandTrapPressure: undefined,
			timeWaterInTrap: undefined,
			alpha: undefined,
			sandLayerHeight: undefined,
			aeratedIntensive: undefined,
			middleValueBPK5: undefined,
			middleVolumeWasteWater: undefined,
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		if (this.speedOfWaterFlowRef) { this.speedOfWaterFlowRef.value = NULLSTR; }
		if (this.sandTrapDeepRef) { this.sandTrapDeepRef.value = NULLSTR; }
		if (this.secondMinFlowRef) { this.secondMinFlowRef.value = NULLSTR; }
		if (this.populationRef) { this.populationRef.value = NULLSTR; }
		if (this.dailyVolumeOfSedimentRef) { this.dailyVolumeOfSedimentRef.value = NULLSTR; }
		if (this.periodRemoveSedimentRef) { this.periodRemoveSedimentRef.value = NULLSTR; }
		if (this.sandTrapPressureRef) { this.sandTrapPressureRef.value = NULLSTR; }
		if (this.timeWaterInTrapRef) { this.timeWaterInTrapRef.value = NULLSTR; }
		if (this.sandLayerHeightRef) { this.sandLayerHeightRef.value = NULLSTR; }
		if (this.aeratedIntensiveRef) { this.aeratedIntensiveRef.value = NULLSTR; }
		if (this.middleValueBPK5Ref) { this.middleValueBPK5Ref.value = NULLSTR; }
		if (this.middleVolumeWasteWaterRef) { this.middleVolumeWasteWaterRef.value = NULLSTR; }
		resetSelectToDefault(this.coefficientOfSandTrapLengthRef, this.hydraulicFinenessSandList);
		resetSelectToDefault(this.alphaRef, this.alphaList);
		this.setState({
			speedOfWaterFlow: undefined,
			hydraulicFinenessSand: undefined,
			coefficientOfSandTrapLength: undefined,
			sandTrapDeep: undefined,
			secondMinFlow: undefined,
			periodRemoveSediment: undefined,
			sandTrapPressure: undefined,
			timeWaterInTrap: undefined,
			alpha: undefined,
			sandLayerHeight: undefined,
			aeratedIntensive: undefined,
			middleValueBPK5: undefined,
			middleVolumeWasteWater: undefined,
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

	// Horizontal forward water move compartment
	private renderInputArea = () => {
		const { type, secondMaxFlow, dailyWaterFlow } = this.props;
		const minDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle
			? SandTrapSource.SandTrapDeep.horizontalMin
			: type === SandTrapTypes.aerated
				? SandTrapSource.SandTrapDeep.aeratedMin
				: SandTrapSource.SandTrapDeep.tangential;
		const maxDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle
			? SandTrapSource.SandTrapDeep.horizontalMax
			: type === SandTrapTypes.aerated
				? SandTrapSource.SandTrapDeep.aeratedMax
				: SandTrapSource.SandTrapDeep.tangential;
		return <div>
			{(type === SandTrapTypes.horizontalForward ||
				type === SandTrapTypes.horizontalCircle ||
				type === SandTrapTypes.aerated)
				? <InputTemplate title={`Скорость течения воды, м/c,
					диапазон[${SandTrapSource.minSpeedWaterFlow} - ${SandTrapSource.maxSpeedWaterFlow}]`}
					placeholder={'Введите скорость течения воды...'}
					range={{ minValue: SandTrapSource.minSpeedWaterFlow, maxValue: SandTrapSource.maxSpeedWaterFlow }}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.speedOfWaterFlowRef = input; }}
					onInput={(value) => { this.setState({ speedOfWaterFlow: value }); }} />
				: null}

			{type === SandTrapTypes.aerated
				? <SelectTemplate title={'α'} itemList={this.alphaList}
					onSelect={(value) => { this.setState({ alpha: value as number }); }}
					onSelectRef={(optionList) => { this.alphaRef = optionList; }} />
				: null}

			{(type === SandTrapTypes.tangential || type === SandTrapTypes.vertical)
				? <InputTemplate title={`Нагрузка на песколовку по воде при максимальном притоке, м3/(м2*ч),
					диапазон[${type === SandTrapTypes.tangential
						? SandTrapSource.sandTrapPressureMinTangential
						: SandTrapSource.sandTrapPressureMinVertical} - ${SandTrapSource.sandTrapPressureMax}]`}
					placeholder={'Введите нагрузка на песколовку...'}
					range={{
						minValue: type === SandTrapTypes.tangential
							? SandTrapSource.sandTrapPressureMinTangential
							: SandTrapSource.sandTrapPressureMinVertical, maxValue: SandTrapSource.sandTrapPressureMax
					}}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.sandTrapPressureRef = input; }}
					onInput={(value) => { this.setState({ sandTrapPressure: value }); }} />
				: null}
			{(type === SandTrapTypes.tangential && this.diameterOfEachCompartment > SandTrapSource.maxDiameterOfTangential)
				? <ErrorAlert errorMessage={`Диаметр песколовки: ${this.diameterOfEachCompartment} м,
					должна быть не более ${SandTrapSource.maxDiameterOfTangential} метров`} />
				: null}

			{type === SandTrapTypes.vertical
				? <InputTemplate title={`Продолжительность пребывания воды в песколовке, c,
					диапазон[${SandTrapSource.timeWaterInTrapMin} - ${SandTrapSource.timeWaterInTrapMax}]`}
					placeholder={'Введите продолжительность пребывания воды...'}
					range={{ minValue: SandTrapSource.timeWaterInTrapMin, maxValue: SandTrapSource.timeWaterInTrapMax }}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.timeWaterInTrapRef = input; }}
					onInput={(value) => { this.setState({ timeWaterInTrap: value }); }} />
				: null}

			{(type === SandTrapTypes.horizontalCircle) &&
				(this.waterFlowPeriodMaxPressure < SandTrapSource.minWaterFlowPeriod)
				? <ErrorAlert errorMessage={`Продолжительность протока: ${this.waterFlowPeriod},
					должна быть не менее ${SandTrapSource.minWaterFlowPeriod}`} />
				: null}

			{(type === SandTrapTypes.horizontalForward ||
				type === SandTrapTypes.horizontalCircle ||
				type === SandTrapTypes.vertical ||
				type === SandTrapTypes.aerated)
				? <SelectTemplate title={'Выбор гидравлической крупности песка, мм/с'} itemList={this.hydraulicFinenessSandList}
					onSelect={(value) => this.coefficientOfSandTrapLength(value)}
					onSelectRef={(optionList) => { this.coefficientOfSandTrapLengthRef = optionList; }} />
				: null}

			{(type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle)
				? <InputTemplate title={`Расчетная глубина песколовки, м, диапазон [${minDeep} - ${maxDeep}]`}
					placeholder={'Введите расчетная глубина песколовки...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: minDeep, maxValue: maxDeep }}
					onInputRef={(input) => { this.sandTrapDeepRef = input; }}
					onInput={(value) => { this.setState({ sandTrapDeep: value }); }} />
				: null}

			{(type === SandTrapTypes.horizontalForward)
				? <InputTemplate title={`Минимальный секундный расход сточных вод, м3/c, диапазон [0 - ${secondMaxFlow}]`}
					placeholder={'Введите минимальный секундный расход...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: 0, maxValue: secondMaxFlow }}
					onInputRef={(input) => { this.secondMinFlowRef = input; }}
					onInput={(value) => { this.setState({ secondMinFlow: value }); }} />
				: null}

			{(type === SandTrapTypes.horizontalForward) &&
				(this.minSpeedFlow > SandTrapSource.minSpeedFlowLimit && this.minSpeedFlow < SandTrapSource.maxSpeedFlowLimit) &&
				(this.maxSpeedFlow > SandTrapSource.minSpeedFlowLimit && this.maxSpeedFlow < SandTrapSource.maxSpeedFlowLimit)
				? <ErrorAlert errorMessage={`Минимальная: ${this.minSpeedFlow} и максимальная: ${this.maxSpeedFlow}\n
					скорости должны удовлетворять следующему диапазону:
					[${SandTrapSource.minSpeedFlowLimit} < Vmin(Vmax) < ${SandTrapSource.maxSpeedFlowLimit}]`} />
				: null}

			{(type === SandTrapTypes.horizontalForward) &&
				(this.waterFlowPeriod < SandTrapSource.minWaterFlowPeriod)
				? <ErrorAlert errorMessage={`Продолжительность протекания сточных вод: ${this.waterFlowPeriod},\n
					должна быть не менее ${SandTrapSource.minWaterFlowPeriod}`} />
				: null}

			<InputTemplate title={`Среднее значение БПК5, мг(О2)/л`}
				placeholder={'Введите среднее значение БПК5...'}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: 0, maxValue: Infinity }}
				onInputRef={(input) => { this.middleValueBPK5Ref = input; }}
				onInput={(value) => { this.setState({ middleValueBPK5: value }); }} />
			<InputTemplate title={`Среднегодовой объем сточных вод, м3`}
				placeholder={'Введите среднегодовой объем...'}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: dailyWaterFlow, maxValue: Infinity }}
				onInputRef={(input) => { this.middleVolumeWasteWaterRef = input; }}
				onInput={(value) => { this.setState({ middleVolumeWasteWater: value }); }} />

			{(type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle)
				? <InputTemplate title={`Интервал времени между выгрузками осадка из песколовки, сут,
					диапазон [${SandTrapSource.minPeriodRemoveSediment} - ${SandTrapSource.maxPeriodRemoveSediment}]`}
					placeholder={'Введите интервал времени...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: SandTrapSource.minPeriodRemoveSediment, maxValue: SandTrapSource.maxPeriodRemoveSediment }}
					onInputRef={(input) => { this.periodRemoveSedimentRef = input; }}
					onInput={(value) => { this.setState({ periodRemoveSediment: value }); }} />
				: null}

			{type === SandTrapTypes.aerated
				? <>
					<InputTemplate title={`Максимальная высота слоя песка в начале пескового лотка, м,
						диапазон [${SandTrapSource.sandLayerHeightMin} - ${SandTrapSource.sandLayerHeightMax}]`}
						placeholder={'Введите максимальная высота слоя...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						range={{ minValue: SandTrapSource.sandLayerHeightMin, maxValue: SandTrapSource.sandLayerHeightMax }}
						onInputRef={(input) => { this.sandLayerHeightRef = input; }}
						onInput={(value) => { this.setState({ sandLayerHeight: value }); }} />
					<InputTemplate title={`Интесивность аэрации, м3/(м2/ч),
						диапазон [${SandTrapSource.aeratedIntensiveMin} - ${SandTrapSource.aeratedIntensiveMax}]`}
						placeholder={'Введите интесивность аэрации...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						range={{ minValue: SandTrapSource.aeratedIntensiveMin, maxValue: SandTrapSource.aeratedIntensiveMax }}
						onInputRef={(input) => { this.aeratedIntensiveRef = input; }}
						onInput={(value) => { this.setState({ aeratedIntensive: value }); }} />
				</>
				: null}

			{this.renderCheckingButton()}
		</div>;
	}

	private isInputReadyToCounting = (): boolean => {
		const { type } = this.props;
		const {
			coefficientOfSandTrapLength,
			hydraulicFinenessSand,
			periodRemoveSediment,
			sandTrapDeep,
			secondMinFlow,
			speedOfWaterFlow,
			sandTrapPressure,
			timeWaterInTrap,
			alpha,
			sandLayerHeight,
			aeratedIntensive,
		} = this.state;
		const onlyForHorizontalForward = type === SandTrapTypes.horizontalForward && secondMinFlow ? true : false;
		const onlyForTangential = type === SandTrapTypes.tangential && sandTrapPressure ? true : false;
		const onlyForVertical = type === SandTrapTypes.vertical && sandTrapPressure &&
			timeWaterInTrap && hydraulicFinenessSand ? true : false;
		const onlyForAerated = type === SandTrapTypes.aerated && speedOfWaterFlow &&
			alpha && coefficientOfSandTrapLength && sandLayerHeight && aeratedIntensive ? true : false;
		const commonHorizontal = (type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle) &&
			coefficientOfSandTrapLength && hydraulicFinenessSand && periodRemoveSediment && sandTrapDeep && speedOfWaterFlow ? true : false;
		if (type === SandTrapTypes.horizontalForward) {
			return onlyForHorizontalForward && commonHorizontal;
		}
		if (type === SandTrapTypes.horizontalCircle) {
			return commonHorizontal;
		}
		if (type === SandTrapTypes.tangential) {
			return onlyForTangential;
		}
		if (type === SandTrapTypes.vertical) {
			return onlyForVertical;
		}
		if (type === SandTrapTypes.aerated) {
			return onlyForAerated;
		}
	}

	private coefficientOfSandTrapLength = (hydraulicFinenessSand: string | number) => {
		const { type } = this.props;
		const { alpha } = this.state;
		let coefficientOfSandTrapLength;
		if (type === SandTrapTypes.aerated) {
			coefficientOfSandTrapLength = (alpha === SandTrapSource.Alpha.low &&
				hydraulicFinenessSand ===  SandTrapSource.HydraulicFinenessSand.low)
			? SandTrapSource.CoefficientOfLengthAlpha.alphaLowHydroLow
			: alpha === SandTrapSource.Alpha.low && hydraulicFinenessSand ===  SandTrapSource.HydraulicFinenessSand.middle
			? SandTrapSource.CoefficientOfLengthAlpha.alphaLowHydroMiddle
			: alpha === SandTrapSource.Alpha.middle && hydraulicFinenessSand ===  SandTrapSource.HydraulicFinenessSand.low
			? SandTrapSource.CoefficientOfLengthAlpha.alphaMiddleHydroLow
			: alpha === SandTrapSource.Alpha.middle && hydraulicFinenessSand ===  SandTrapSource.HydraulicFinenessSand.middle
			? SandTrapSource.CoefficientOfLengthAlpha.alphaMiddleHydroMiddle
			: alpha === SandTrapSource.Alpha.high && hydraulicFinenessSand ===  SandTrapSource.HydraulicFinenessSand.low
			? SandTrapSource.CoefficientOfLengthAlpha.alphaHighHydroLow
			: SandTrapSource.CoefficientOfLengthAlpha.alphaHighHydroMiddle;
		} else {
			coefficientOfSandTrapLength = hydraulicFinenessSand === SandTrapSource.HydraulicFinenessSand.middle
				? SandTrapSource.CoefficientOfSandTrapLength.max
				: SandTrapSource.CoefficientOfSandTrapLength.min;
		}
		this.setState({
			hydraulicFinenessSand: (hydraulicFinenessSand as number),
			coefficientOfSandTrapLength: (coefficientOfSandTrapLength as number)
		});
	}

	private setCurrentResult = () => {
		const { type } = this.props;
		const { sandTrapDeep } = this.state;
		this.sandTrapResult = {
			complete: true,
			deviceType: type,
			amountOfSandTrapSection: {value: this.amountOfSandTrapSection, label: 'Количество отделений песколовки, шт'},
			horizontalForward: {
				widthOfSandTrap: {
					value: this.widthOfSandTrap ? Number(this.widthOfSandTrap.toFixed(3)) : undefined,
					label: 'Ширина одного отделения песколовки, м'
				},
				lengthOfSandTrap: {
					value: this.lengthOfSandTrap ? Number(this.lengthOfSandTrap.toFixed(3)) : undefined,
					label: 'Длина песколовки, м'
				},
				sandTrapDeep: {
					value: sandTrapDeep ? Number(sandTrapDeep.toFixed(3)) : undefined,
					label: 'Расчетная глубина песколовки, м'
				},
				volumeOfSandTrapSection: {
					value: this.volumeOfSandTrapSection ? Number(this.volumeOfSandTrapSection.toFixed(3)) : undefined,
					label: 'Объем бункера одного отделения песколовки, м3'
				},
				deepSandTrapSection: {
					value: this.deepSandTrapSection ? Number(this.deepSandTrapSection.toFixed(3)) : undefined,
					label: 'Глубина бункера песколовки, м'
				},
			},
			horizontalCircle: {
				lengthOfSandTrap: {
					value: this.lengthOfSandTrap ? Number(this.lengthOfSandTrap.toFixed(3)) : undefined,
					label: 'Длина песколовки, м'
				},
				middleDiameter: {
					value: this.middleDiameter ? Number(this.middleDiameter.toFixed(3)) : undefined,
					label: 'Средний диаметр, м'
				},
				outputDiameter: {
					value: this.outputDiameter ? Number(this.outputDiameter.toFixed(3)) : undefined,
					label: 'Наружный диаметр, м'
				},
				bunkerHeightConusPart: {
					value: this.bunkerHeightConusPart ? Number(this.bunkerHeightConusPart.toFixed(3)) : undefined,
					label: 'Высота конической части бункера, м'
				},
				volumeOfSandTrapSection: {
					value: this.volumeOfSandTrapSection ? Number(this.volumeOfSandTrapSection.toFixed(3)) : undefined,
					label: 'Объем бункера одного отделения песколовки, м3'
				},
			},
			tangentialOrVertical: {
				diameterOfEachCompartment: {value: this.diameterOfEachCompartment, label: 'Диаметр каждого отделения, м'},
				deepOfTheBunker: {
					value: this.deepOfTheBunker ? Number(this.deepOfTheBunker.toFixed(3)) : undefined,
					label: 'Глубина бункера, м'
				},
				heightOfTheBunker: {
					value: this.heightOfTheBunker ? Number(this.heightOfTheBunker.toFixed(3)) : undefined,
					label: 'Высота бункера, м'
				},
				periodBetweenSedimentOutput: {value: this.periodBetweenSedimentOutput, label: 'Период между выгрузками осадка из песколовок, сут'},
			},
			aerated: {
				widthOfSandTrap: {
					value: this.widthOfSandTrap ? Number(this.widthOfSandTrap.toFixed(3)) : undefined,
					label: 'Ширина одного отделения песколовки, м'
				},
				lengthOfSandTrap: {
					value: this.lengthOfSandTrap ? Number(this.lengthOfSandTrap.toFixed(3)) : undefined,
					label: 'Длина песколовки, м'
				},
				fullSandTrapHeight: {
					value: this.fullSandTrapHeight ? Number(this.fullSandTrapHeight.toFixed(3)) : undefined,
					label: 'Полная строительная высота песколовки, м'
				},
				countingDeepOfSandTrap: {
					value: this.deepOfSandTrap ? Number((this.deepOfSandTrap / 2).toFixed(3)) : undefined,
					label: 'Расчетная глубина песколовки, м'
				},
				deepOfSandTrap: {
					value: this.deepOfSandTrap ? Number(this.deepOfSandTrap.toFixed(3)) : undefined,
					label: 'Глубина песколовки, м'
				},
				hydroMechanicWaterFlow: {
					value: this.hydroMechanicWaterFlow ? Number(this.hydroMechanicWaterFlow.toFixed(3)) : undefined,
					label: 'Расход промывной воды при гидромеханическом удалении песка, л/с'
				},
				outputPipePressure: {
					value: this.outputPipePressure ? Number(this.outputPipePressure.toFixed(3)) : undefined,
					label: 'Напор в начале смывного трубопровода, м'
				},
				generalAirFlow: {
					value: this.generalAirFlow ? Number(this.generalAirFlow.toFixed(3)) : undefined,
					label: 'Общий расход воздуха для аэрирования, м3/ч'
				},
			}
		}
		dataModel.setSandTrapResult(this.sandTrapResult);
	}

	private resultCounting = () => {
		const { dailyWaterFlow, secondMaxFlow, type } = this.props;
		const {
			coefficientOfSandTrapLength,
			hydraulicFinenessSand,
			periodRemoveSediment,
			sandTrapDeep,
			secondMinFlow,
			speedOfWaterFlow,
			sandTrapPressure,
			timeWaterInTrap,
			alpha,
			sandLayerHeight,
			aeratedIntensive,
			middleValueBPK5,
			middleVolumeWasteWater
		} = this.state;
		// formula 1: n = dailyWaterFlow / 40000(15000, 10000);
		if (type === SandTrapTypes.horizontalForward || type === SandTrapTypes.aerated) {
			this.amountOfSandTrapSection = dailyWaterFlow / 40000;
		} else if (type === SandTrapTypes.horizontalCircle || type === SandTrapTypes.tangential) {
			this.amountOfSandTrapSection = dailyWaterFlow / 15000;
		} else if (type === SandTrapTypes.vertical) {
			this.amountOfSandTrapSection = dailyWaterFlow / 10000;
		}
		this.amountOfSandTrapSection = this.amountOfSandTrapSection < 2 ? 2 : Math.round(this.amountOfSandTrapSection);
		if (type === SandTrapTypes.horizontalCircle ||
			type === SandTrapTypes.horizontalForward ||
			type === SandTrapTypes.aerated) {
			// formula 2: omega = qmax / n * vs;
			this.squareOneCompartmentOfSandTrap = secondMaxFlow / (this.amountOfSandTrapSection * speedOfWaterFlow);
		}

		if (type === SandTrapTypes.aerated) {
			// formula (Aereted): H = sqrt(omega / alpha);
			this.deepOfSandTrap = Math.sqrt(this.squareOneCompartmentOfSandTrap / alpha);
			// formula (Aereted): B = alpha * H;
			this.widthOfSandTrap = Math.round(alpha * this.deepOfSandTrap);
			// formula (Aereted): Ls = 1000 * Ks * Hs * vs / u0;
			this.lengthOfSandTrap = (1000 * coefficientOfSandTrapLength * (this.deepOfSandTrap / 2) * speedOfWaterFlow) /
				hydraulicFinenessSand;
			// formula (Aereted): qh = vh * lsc * bsc;
			this.hydroMechanicWaterFlow = SandTrapSource.riseWaterSpeed *
				(this.lengthOfSandTrap - this.deepOfSandTrap) * SandTrapSource.widthSandBox;
			// formula (Aereted): H0 = 5.4*(h0 + 5.4 * vmp^2 / 2*g);
			this.outputPipePressure = 5.4 * (sandLayerHeight + (Math.pow(SandTrapSource.startPipeWaterSpeed, 2)) /
				(2 * SandTrapSource.gravityAcceleration));
			// formula (Aereted): Qair = Ja * B * L * n;
			this.generalAirFlow = aeratedIntensive * this.widthOfSandTrap * this.lengthOfSandTrap * this.amountOfSandTrapSection;
		}

		if (type === SandTrapTypes.horizontalCircle || type === SandTrapTypes.horizontalForward) {
			// formula 3: Ls = 1000 * Ks * Hs * vs / u0;
			this.lengthOfSandTrap = (1000 * coefficientOfSandTrapLength * sandTrapDeep * speedOfWaterFlow) / hydraulicFinenessSand;
		}

		if (type === SandTrapTypes.horizontalForward) {
			// formula 4: B = omega / Hs;
			this.widthOfSandTrap = this.squareOneCompartmentOfSandTrap / sandTrapDeep;
			// formula 5, 6: Vmiv(Vmax) = qmin(qmax) / B * n * Hs; Should be in the diapason [0.15-0.3]
			this.minSpeedFlow = secondMinFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
			this.maxSpeedFlow = secondMaxFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
			// formula 7: T = Ls / Vmax;
			this.waterFlowPeriod = this.lengthOfSandTrap / this.maxSpeedFlow;
		}

		// formula 10 Npeq = (Cbpk5 * Wct) / (365 * 60)
		this.amountOfDwellers = (middleValueBPK5 * middleVolumeWasteWater) / (365 * 60);
		// formula 8: Wсут = Npeq * qoc / 1000;
		this.dailyVolumeOfSediment = this.amountOfDwellers * this.amountOfBlockedSand / 1000;

		if (type === SandTrapTypes.horizontalForward ||
			type === SandTrapTypes.horizontalCircle ||
			type === SandTrapTypes.aerated) {
			// formula 9: W = Wсут * Toc / n;
			this.volumeOfSandTrapSection = this.dailyVolumeOfSediment * periodRemoveSediment / this.amountOfSandTrapSection;
		}

		if (type === SandTrapTypes.tangential || type === SandTrapTypes.vertical) {
			// formula (Tangential/Vertical): F = 3600 * qmax / n * q0;
			this.squareOfEachCompartment = (3600 * secondMaxFlow) / (this.amountOfSandTrapSection * sandTrapPressure);
			// formula (Tangential/Vertical): D = sqrt(4 * F / pi);
			this.diameterOfEachCompartment = Math.round(Math.sqrt(4 * this.squareOfEachCompartment / Math.PI));
		}
		if (type === SandTrapTypes.tangential) {
			// formula (Tangential): h1 = D / 2;
			this.deepOfTheBunker = this.diameterOfEachCompartment / 2;
			// formula (Tangential): h2 = sqrt(D^2 - h1^2);
			this.heightOfTheBunker = Math.sqrt(Math.pow(this.diameterOfEachCompartment, 2) - Math.pow(this.deepOfTheBunker, 2));

		}
		if (type === SandTrapTypes.vertical) {
			// formula (Vertical): h1 = t * v / 1000;
			this.deepOfTheBunker = (timeWaterInTrap * hydraulicFinenessSand) / 1000;
			// formula (Vertical): h2 = D * (sqrt(3)/2);
			this.heightOfTheBunker = this.diameterOfEachCompartment * (Math.sqrt(3) / 2);
		}
		if (type === SandTrapTypes.tangential || type === SandTrapTypes.vertical) {
			// formula (Tangential): Toc = (n * pi * D^2 * h2) / (12 * wсут);
			this.periodBetweenSedimentOutput = Math.ceil((this.amountOfSandTrapSection * Math.PI *
				Math.pow(this.diameterOfEachCompartment, 2) * this.heightOfTheBunker) / (12 * this.dailyVolumeOfSediment));
		}

		if (type === SandTrapTypes.horizontalCircle) {
			// formula (horizontal circle) D0 = Ls / pi;
			this.middleDiameter = this.lengthOfSandTrap / Math.PI;
			// formula (horizontal circle) T = pi * D0 / vs;
			this.waterFlowPeriodMaxPressure = Math.PI * this.middleDiameter / speedOfWaterFlow;
			// formula (horizontal circle) D =  D0 + Bж;
			const onlySecondMaxFlow = SandTrapSource.circleGutter.map(item => item.secondFlow);
			const defineMaxFlow = selectValueFromDiapasonOfFilteredArray(onlySecondMaxFlow, secondMaxFlow, 'greater');
			const widthCircleGutter = SandTrapSource.circleGutter.find(gutter => gutter.secondFlow === defineMaxFlow);
			this.outputDiameter = this.middleDiameter + widthCircleGutter.width;
			// formula (horizontal circle) hk = 12W / pi(D02 + d2(0.4) + D0d);
			this.bunkerHeightConusPart = 12 * this.volumeOfSandTrapSection / (Math.PI *
				(Math.pow(this.middleDiameter, 2) + Math.pow(SandTrapSource.diameterLowBaseOfBunker, 2) +
				this.middleDiameter * SandTrapSource.diameterLowBaseOfBunker));
		}

		if (type === SandTrapTypes.horizontalForward || type === SandTrapTypes.aerated) {
			// formula 10: hб = W / B2;
			this.deepSandTrapSection = this.volumeOfSandTrapSection / Math.pow(this.widthOfSandTrap, 2);
		}

		if (type === SandTrapTypes.horizontalForward) {
			// formula 11: hoc = Kn * Wсут / B * n * Ls;
			this.heightSedimentLayout = (SandTrapSource.coefficientDispersionOfSediment * this.dailyVolumeOfSediment) /
				(this.widthOfSandTrap * this.amountOfSandTrapSection * this.lengthOfSandTrap);
			// formula 12a: Hstr = Hs + hb + hoc + 0.5;
			this.fullSandTrapHeight = sandTrapDeep + this.deepSandTrapSection + this.heightSedimentLayout + 0.5;
		} else if (type === SandTrapTypes.horizontalCircle) {
			// formula 12b: Hstr = Hs + hk + 0.5;
			this.fullSandTrapHeight = sandTrapDeep + this.bunkerHeightConusPart + 0.5;
		} else if (type === SandTrapTypes.tangential || type === SandTrapTypes.vertical) {
			// formula 12b: Hstr = h1 + h2 + 0.5;
			this.fullSandTrapHeight = this.deepOfTheBunker + this.heightOfTheBunker + 0.5;
		}

		this.setCurrentResult();

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return renderSandTrapResult(this.sandTrapResult, {isGeneralResult: false, title: NULLSTR});
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
			</>
		);
	}

}

export function renderSandTrapResult(
	sandTrapResult: SandTrapResultData,
	generalResultConfig: {
		isGeneralResult: boolean;
		title: string;
	},
) {
	if (!sandTrapResult) {
		return null;
	}
	const horizontalForward = sandTrapResult.horizontalForward;
	const horizontalCircle = sandTrapResult.horizontalCircle;
	const tangentialOrVertical = sandTrapResult.tangentialOrVertical;
	const aerated = sandTrapResult.aerated;
	const deviceType = sandTrapResult.deviceType === SandTrapTypes.horizontalForward
		? 'Горизонтальные с прямолинейным движением воды'
		: sandTrapResult.deviceType === SandTrapTypes.horizontalCircle
			? 'Горизонтальные с круговым движением воды'
			: sandTrapResult.deviceType === SandTrapTypes.vertical
				? 'Вертикальные'
				: sandTrapResult.deviceType === SandTrapTypes.tangential
					? 'Тангенциальные'
					: 'Аэрируемые';
	return (
		<div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					{generalResultConfig.isGeneralResult
						? <>
							<tr>
								<td className={'input-label left-title-column'}>{generalResultConfig.title}</td>
								<td className={'right-title-column'}></td>
							</tr>
							<TableRow value={deviceType} label={'Тип'} />
						</>
						: null}
					<TableRow value={sandTrapResult.amountOfSandTrapSection.value} label={sandTrapResult.amountOfSandTrapSection.label} />
					{sandTrapResult.deviceType === SandTrapTypes.horizontalForward
						? <>
							<TableRow value={horizontalForward.widthOfSandTrap.value} label={horizontalForward.widthOfSandTrap.label} />
							<TableRow value={horizontalForward.lengthOfSandTrap.value} label={horizontalForward.lengthOfSandTrap.label} />
							<TableRow value={horizontalForward.sandTrapDeep.value} label={horizontalForward.sandTrapDeep.label} />
							<TableRow value={horizontalForward.volumeOfSandTrapSection.value} label={horizontalForward.volumeOfSandTrapSection.label} />
							<TableRow value={horizontalForward.deepSandTrapSection.value} label={horizontalForward.deepSandTrapSection.label} />
						</>
						: null}
					{sandTrapResult.deviceType === SandTrapTypes.horizontalCircle
						? <>
							<TableRow value={horizontalCircle.lengthOfSandTrap.value} label={horizontalCircle.lengthOfSandTrap.label} />
							<TableRow value={horizontalCircle.middleDiameter.value} label={horizontalCircle.middleDiameter.label} />
							<TableRow value={horizontalCircle.outputDiameter.value} label={horizontalCircle.outputDiameter.label} />
							<TableRow value={horizontalCircle.bunkerHeightConusPart.value} label={horizontalCircle.bunkerHeightConusPart.label} />
							<TableRow value={horizontalCircle.volumeOfSandTrapSection.value} label={horizontalCircle.volumeOfSandTrapSection.label} />
						</>
						: null}
					{sandTrapResult.deviceType === SandTrapTypes.vertical || sandTrapResult.deviceType === SandTrapTypes.tangential
						? <>
							<TableRow
								value={tangentialOrVertical.diameterOfEachCompartment.value}
								label={tangentialOrVertical.diameterOfEachCompartment.label} />
							<TableRow value={tangentialOrVertical.deepOfTheBunker.value} label={tangentialOrVertical.deepOfTheBunker.label} />
							<TableRow value={tangentialOrVertical.heightOfTheBunker.value} label={tangentialOrVertical.heightOfTheBunker.label} />
							<TableRow
								value={tangentialOrVertical.periodBetweenSedimentOutput.value}
								label={tangentialOrVertical.periodBetweenSedimentOutput.label} />
						</>
						: null}
					{sandTrapResult.deviceType === SandTrapTypes.aerated
						? <>
							<TableRow value={aerated.widthOfSandTrap.value} label={aerated.widthOfSandTrap.label} />
							<TableRow value={aerated.lengthOfSandTrap.value} label={aerated.lengthOfSandTrap.label} />
							<TableRow value={aerated.fullSandTrapHeight.value} label={aerated.fullSandTrapHeight.label} />
							<TableRow value={aerated.countingDeepOfSandTrap.value} label={aerated.countingDeepOfSandTrap.label} />
							<TableRow value={aerated.deepOfSandTrap.value} label={aerated.deepOfSandTrap.label} />
							<TableRow value={aerated.hydroMechanicWaterFlow.value} label={aerated.hydroMechanicWaterFlow.label} />
							<TableRow value={aerated.outputPipePressure.value} label={aerated.outputPipePressure.label} />
							<TableRow value={aerated.generalAirFlow.value} label={aerated.generalAirFlow.label} />
						</>
						: null}
				</tbody>
			</Table>
		</div>
	);
}
