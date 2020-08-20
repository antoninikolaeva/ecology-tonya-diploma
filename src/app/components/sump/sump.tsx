import * as React from 'react';

import { SumpTypes, KindOfDevices } from '../general-resources';
import { resetSelectToDefault, ItemList, NULLSTR } from '../utils/utils';
import { InputTemplate } from '../utils/input-template';
import { SelectTemplate } from '../utils/select-template';
import { TableRow } from '../utils/table-row';
import { Table } from 'react-bootstrap';
import { SumpSource } from './sump-resources';
import { ErrorAlert } from '../error/error';
import { GrateSource } from '../grate/grate-resources';
import { SumpResultData, dataModel } from '../data-model';
import { renderCheckingButton, renderToolbar, renderBaseData } from '../grate/grate';

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
	workingThreadSpeed: number;
	widthSection: number;
	borderHeight: number;
	sedimentWet: number;
	alpha: number;
	typeOfClean: string;
	isValidateError: boolean;
	isResult: boolean;
	showChangeScheme: boolean;
	showOpenResult: boolean;
}

export class SumpComponent extends React.Component<SumpProps, SumpState> {
	private baseConcentrateRef: HTMLInputElement;
	private finalConcentrateRef: HTMLInputElement;
	private workingDeepSumpPartRef: HTMLInputElement;
	private workingThreadSpeedRef: HTMLInputElement;
	private widthSectionRef: HTMLInputElement;
	private borderHeightRef: HTMLInputElement;
	private sedimentWetRef: HTMLInputElement;
	private alphaRef: HTMLInputElement;
	private amountOfSectionRef: HTMLInputElement;
	private sumpDiametersRef: HTMLOptionElement[] = [];
	private typeOfCleanListRef: HTMLOptionElement[] = [];

	private highLightEffect: number;
	private hydraulicHugest: number;
	private summaWidthAllSection: number;
	private amountOfSection: number;
	private checkWorkingThreadSpeed: number;
	private sumpLength: number;
	private fullSumpHeight: number;
	private sedimentAmountDaily: number;
	private oneSumpVolume: number;
	private sedimentCleanPeriod: number;
	private diameterCentralPipe: number;
	private sumpDiameter: number;
	private diameterOfTrumpet: number;
	private diameterOfReflectorShield: number;
	private gapHeightTrumpetAndShield: number;
	private commonHeightCylinderSump: number;
	private conePartOfSump: number;
	private sumpDiametersList: ItemList[] = [
		{ value: undefined, label: 'Выберите диаметр отстойника' },
		{ value: SumpSource.SumpDiameters.min, label: `${SumpSource.SumpDiameters.min}` },
		{ value: SumpSource.SumpDiameters.middle, label: `${SumpSource.SumpDiameters.middle}` },
		{ value: SumpSource.SumpDiameters.max, label: `${SumpSource.SumpDiameters.max}` },
	];
	private typeOfCleanList: ItemList[] = [
		{value: undefined, label: 'Выберите способ удаления осадка' },
		{value: SumpSource.PeriodBetweenClean.hydrostatic, label: 'Гидростатическое давление' },
		{value: SumpSource.PeriodBetweenClean.mechanic, label: 'Механически' },
	];
	private diameterRingBorder: number;
	private heightRingBorder: number;

	private sumpResult: SumpResultData;

	constructor(props: SumpProps) {
		super(props);

		this.state = {
			baseConcentrate: undefined,
			finalConcentrate: undefined,
			workingDeepSumpPart: undefined,
			workingThreadSpeed: undefined,
			widthSection: undefined,
			borderHeight: undefined,
			sedimentWet: undefined,
			alpha: undefined,
			typeOfClean: NULLSTR,
			isValidateError: false,
			isResult: false,
			showChangeScheme: false,
			showOpenResult: false,
		};
	}

	private clearPage = () => {
		if (this.baseConcentrateRef) { this.baseConcentrateRef.value = NULLSTR; }
		if (this.finalConcentrateRef) { this.finalConcentrateRef.value = NULLSTR; }
		if (this.workingDeepSumpPartRef) { this.workingDeepSumpPartRef.value = NULLSTR; }
		if (this.workingThreadSpeedRef) { this.workingThreadSpeedRef.value = NULLSTR; }
		if (this.widthSectionRef) { this.widthSectionRef.value = NULLSTR; }
		if (this.borderHeightRef) { this.borderHeightRef.value = NULLSTR; }
		if (this.sedimentWetRef) { this.sedimentWetRef.value = NULLSTR; }
		if (this.amountOfSectionRef) { this.amountOfSectionRef.value = NULLSTR; }
		if (this.alphaRef) { this.alphaRef.value = NULLSTR; }
		resetSelectToDefault(this.sumpDiametersRef, this.sumpDiametersList);
		resetSelectToDefault(this.typeOfCleanListRef, this.typeOfCleanList);
		this.setState({
			baseConcentrate: undefined,
			finalConcentrate: undefined,
			workingDeepSumpPart: undefined,
			workingThreadSpeed: undefined,
			widthSection: undefined,
			borderHeight: undefined,
			sedimentWet: undefined,
			alpha: undefined,
			isValidateError: false,
			isResult: false,
			showChangeScheme: false,
			showOpenResult: false,
		});
	}

	private renderInputArea = () => {
		const { type } = this.props;
		const { baseConcentrate, workingDeepSumpPart, finalConcentrate, typeOfClean, } = this.state;
		return (
			<>
				{type === SumpTypes.radial || type === SumpTypes.vertical
					? <InputTemplate title={`Количество отделений отстойника, шт, диапазон [2 - n]`}
						range={{ minValue: 2, maxValue: Infinity }}
						placeholder={'Введите количество отделений отстойника...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.amountOfSectionRef = input; }}
						onInput={(value) => { this.amountOfSection = value; }} />
					: null}

				<InputTemplate title={`Начальная концентрация взвешенных веществ в сточной воде, мг/л,
					диапазон [${SumpSource.minConcentrate} - ${SumpSource.maxConcentrate}]`}
					range={{ minValue: SumpSource.minConcentrate, maxValue: SumpSource.maxConcentrate }}
					placeholder={'Введите начальную концентрацию взвешенных веществ...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseConcentrateRef = input; }}
					onInput={(value) => { this.setState({ baseConcentrate: value }); }} />

				{baseConcentrate
					? <InputTemplate title={`Допустимая конечная концентрация взвешенных веществ в осветленной воде, мг/л,
						диапазон [0 - ${baseConcentrate}]`}
						range={{ minValue: 0, maxValue: baseConcentrate }}
						placeholder={'Введите допустимую конечную концентрацию взвешенных веществ...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalConcentrateRef = input; }}
						onInput={(value) => { this.setState({ finalConcentrate: value }); }} />
					: null}

				{baseConcentrate && finalConcentrate
					? <InputTemplate title={`Рабочая глубина отстойной части, мг/л,
						диапазон [${type === SumpTypes.horizontal || type === SumpTypes.radial
							? SumpSource.WorkingDeep.min_horizontal_radial
							: SumpSource.WorkingDeep.min_vertical_up_down}
							-
							${type === SumpTypes.horizontal
							? SumpSource.WorkingDeep.max_horizontal
							: type === SumpTypes.radial
								? SumpSource.WorkingDeep.max_radial
								: SumpSource.WorkingDeep.max_vertical_up_down}]`}
						range={{
							minValue: type === SumpTypes.horizontal || type === SumpTypes.radial
								? SumpSource.WorkingDeep.min_horizontal_radial
								: SumpSource.WorkingDeep.min_vertical_up_down,
							maxValue: type === SumpTypes.horizontal
								? SumpSource.WorkingDeep.max_horizontal
								: type === SumpTypes.radial
									? SumpSource.WorkingDeep.max_radial
									: SumpSource.WorkingDeep.max_vertical_up_down
						}}
						placeholder={'Введите рабочую глубину отстойной части...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.workingDeepSumpPartRef = input; }}
						onInput={(value) => {
							if (type === SumpTypes.verticalUpDownFlow) {
								this.countingHydraulicHugest(SumpSource.CoefficientUsingVolume.downUpFlow, value);
							}
							this.setState({ workingDeepSumpPart: value });
						}} />
					: null}

				{type === SumpTypes.horizontal &&
				this.checkWorkingThreadSpeed <= SumpSource.WorkingThreadSpeed.min ||
				this.checkWorkingThreadSpeed >= SumpSource.WorkingThreadSpeed.middle
					? <ErrorAlert errorMessage={`Проверка скорости рабочего потока : ${this.checkWorkingThreadSpeed.toFixed(2)},
					должна быть в пределах диапазона ${SumpSource.WorkingThreadSpeed.min} - ${SumpSource.WorkingThreadSpeed.middle}.
					Для урегулирования скорости измените рабочую глубину отстойника.`} />
					: null}

				{type === SumpTypes.horizontal && workingDeepSumpPart
					? <InputTemplate title={`Ширина секции, м,
							диапазон [${(SumpSource.WidthSectionCoefficient.min * workingDeepSumpPart)} -
							${(SumpSource.WidthSectionCoefficient.max * workingDeepSumpPart)}], рекомендуется величина, кратная 3`}
							range={{
								minValue: (SumpSource.WidthSectionCoefficient.min * workingDeepSumpPart),
								maxValue: (SumpSource.WidthSectionCoefficient.max * workingDeepSumpPart)
							}}
							placeholder={'Введите ширину секции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.widthSectionRef = input; }}
							onInput={(value) => { this.setState({ widthSection: value }); }} />
					: null}

				{!(type === SumpTypes.verticalUpDownFlow) && baseConcentrate && workingDeepSumpPart && finalConcentrate
					? <InputTemplate title={`Скорость рабочего потока, мм/с,
						диапазон [${type === SumpTypes.horizontal || type === SumpTypes.radial
							? SumpSource.WorkingThreadSpeed.min
							: type === SumpTypes.vertical
								? SumpSource.minWorkingThreadSpeedGeneralPipe
								: (SumpSource.WorkingThreadSpeed.downUpMin * (this.hydraulicHugest ? this.hydraulicHugest : 0)).toFixed(2)}
							-
							${type === SumpTypes.horizontal || type === SumpTypes.radial
							? SumpSource.WorkingThreadSpeed.middle
							: type === SumpTypes.vertical
								? SumpSource.WorkingThreadSpeed.max
								: (SumpSource.WorkingThreadSpeed.downUpMax * (this.hydraulicHugest ? this.hydraulicHugest : 0)).toFixed(2)}]`}
						range={{
							minValue: type === SumpTypes.horizontal || type === SumpTypes.radial
								? SumpSource.WorkingThreadSpeed.min
								: type === SumpTypes.vertical
									? SumpSource.minWorkingThreadSpeedGeneralPipe
									: Number((SumpSource.WorkingThreadSpeed.downUpMin * (this.hydraulicHugest ? this.hydraulicHugest : 0)).toFixed(2)),
							maxValue: type === SumpTypes.horizontal || type === SumpTypes.radial
								? SumpSource.WorkingThreadSpeed.middle
								: type === SumpTypes.vertical
									? SumpSource.WorkingThreadSpeed.max
									: Number((SumpSource.WorkingThreadSpeed.downUpMax * (this.hydraulicHugest ? this.hydraulicHugest : 0)).toFixed(2))
						}}
						placeholder={'Введите скорость рабочего потока...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.workingThreadSpeedRef = input; }}
						onInput={(value) => { this.setState({ workingThreadSpeed: value }); }} />
					: null}

				{type === SumpTypes.radial && this.checkWorkingThreadSpeed >= SumpSource.WorkingThreadSpeed.middle
					? <ErrorAlert errorMessage={`Проверка скорости рабочего потока : ${this.checkWorkingThreadSpeed.toFixed(2)},
					должна быть меньше табличной скорости потока : ${SumpSource.WorkingThreadSpeed.middle}.
					Для урегулирования скорости измените количество отделений отстойников.`} />
					: null}

				<InputTemplate title={`Влажность осадка, %,
					диапазон [${SumpSource.SedimentWet.min} - ${SumpSource.SedimentWet.max}]`}
					range={{ minValue: SumpSource.SedimentWet.min, maxValue: SumpSource.SedimentWet.max }}
					placeholder={'Введите влажность осадка...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.sedimentWetRef = input; }}
					onInput={(value) => { this.setState({ sedimentWet: value }); }} />

				{this.amountOfSection <= SumpSource.minAmountOfSection
					? <ErrorAlert errorMessage={`Количество отделений отстойника: ${this.amountOfSection.toFixed(2)},
					должно быть не менее ${SumpSource.minAmountOfSection}`} />
					: null}

				{type === SumpTypes.horizontal || type === SumpTypes.radial
					? <InputTemplate title={`Высота борта над слоем воды, м,
							диапазон [${SumpSource.BorderHeight.min} - ${SumpSource.BorderHeight.max}]`}
							range={{ minValue: SumpSource.BorderHeight.min, maxValue: SumpSource.BorderHeight.max }}
							placeholder={'Введите высоту борта над слоем воды...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.borderHeightRef = input; }}
							onInput={(value) => { this.setState({ borderHeight: value }); }} />
					: null}

				{type === SumpTypes.verticalUpDownFlow
				? <SelectTemplate title={'Диаметр отстойника, м'} itemList={this.sumpDiametersList}
						onSelect={(value) => { this.sumpDiameter = value as number; }}
						onSelectRef={(optionList) => { this.sumpDiametersRef = optionList; }} />
				: null}

				{!(type === SumpTypes.radial)
					? <InputTemplate title={`Угол наклона стенок приямника, град,
					диапазон [${SumpSource.Alpha.min}
					-
					${type === SumpTypes.horizontal
							? `${SumpSource.Alpha.middle}`
							: type === SumpTypes.vertical
								? `${SumpSource.Alpha.max}`
								: `${SumpSource.Alpha.max}`}]`}
						range={{ minValue: SumpSource.Alpha.min, maxValue: SumpSource.Alpha.max }}
						placeholder={'Введите угол наклона стенок приямника...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.alphaRef = input; }}
						onInput={(value) => { this.setState({ alpha: value }); }} />
					: null}

				{type === SumpTypes.horizontal
					? <>
						<SelectTemplate title={'Способ удаления осадка из отстойника'} itemList={this.typeOfCleanList}
							onSelect={(value) => { this.setState({typeOfClean: value as string}); }}
							onSelectRef={(optionList) => { this.typeOfCleanListRef = optionList; }} />
						{typeOfClean &&
						((typeOfClean === SumpSource.PeriodBetweenClean.hydrostatic &&
							this.sedimentCleanPeriod >= SumpSource.PeriodBetweenCleanValues.hydrostatic) ||
							(typeOfClean === SumpSource.PeriodBetweenClean.mechanic &&
								this.sedimentCleanPeriod >= SumpSource.PeriodBetweenCleanValues.mechanic))
							? <ErrorAlert errorMessage={`Период между выгрузками осадка : ${this.sedimentCleanPeriod.toFixed(2)},
									должнен быть не более ${typeOfClean === SumpSource.PeriodBetweenClean.hydrostatic
										? SumpSource.PeriodBetweenCleanValues.hydrostatic
										: SumpSource.PeriodBetweenCleanValues.mechanic}`} />
							: null}
					</>
					: null}

				{renderCheckingButton(
					this.clearPage,
					this.isInputReadyToCounting,
					this.resultCounting,
				)}
			</>
		);
	}

	private isInputReadyToCounting = (): boolean => {
		const { type } = this.props;
		const {
			baseConcentrate, finalConcentrate, workingDeepSumpPart, workingThreadSpeed,
			widthSection, borderHeight, sedimentWet, alpha,
		} = this.state;
		const onlyVerticalUpDown = (type === SumpTypes.verticalUpDownFlow && alpha) ? true : false;
		const onlyRadial = (type === SumpTypes.radial && workingThreadSpeed) ? true : false;
		const onlyVertical = (type === SumpTypes.vertical && workingThreadSpeed && alpha) ? true : false;
		const onlyHorizontal = (type === SumpTypes.horizontal && borderHeight && widthSection && workingThreadSpeed && alpha) ? true : false;
		const commonInputs = (baseConcentrate && finalConcentrate && workingDeepSumpPart && sedimentWet) ? true : false;
		return (commonInputs && onlyHorizontal) || (commonInputs && onlyVertical) ||
			(commonInputs && onlyVerticalUpDown) || (commonInputs && onlyRadial);
	}

	private countingHydraulicHugest = (Kset: number, workingDeepSumpPartValue?: number) => {
		const { baseConcentrate, workingDeepSumpPart, finalConcentrate, } = this.state;
		if (baseConcentrate && finalConcentrate) {
			// Common formula 1: Э = 100 * (Cen - Cex) / Cen
			this.highLightEffect = 100 * (baseConcentrate - finalConcentrate) / baseConcentrate;
			const periodOfSettling = findPeriodOfSettling(baseConcentrate, this.highLightEffect);
			const exponentValue = selectExponentValue(baseConcentrate, this.highLightEffect);
			// Сommon formula 2: u0 = (1000 * Hset * Kset) / (tset * (Kset * Hset / h1));
			const Hset = workingDeepSumpPart ? workingDeepSumpPart : workingDeepSumpPartValue;
			if (Hset) {
				this.hydraulicHugest = (1000 * Hset * Kset) / (periodOfSettling *
					Math.pow(Kset * Hset / SumpSource.layerHeight, exponentValue));
			}
		}
	}

	private setSumpResult = () => {
		const {type} = this.props;
		const {} = this.state;
		this.sumpResult = {
			type: KindOfDevices.sump,
			complete: true,
			deviceType: type,
			highLightEffect: {
				value: this.highLightEffect ? Number(this.highLightEffect.toFixed(1)) : undefined,
				label: 'Необходимый эффект осветления в отстойниках, %'
			},
			amountOfSection: {value: this.amountOfSection, label: 'Количество отделений отстойника, шт'},
			fullSumpHeight: {
				value: this.fullSumpHeight ? Number(this.fullSumpHeight.toFixed(2)) : undefined,
				label: 'Общая высота отстойника, м'
			},
			sedimentAmountDaily: {
				value: this.sedimentAmountDaily ? Number(this.sedimentAmountDaily.toFixed(2)) : undefined,
				label: 'Количество осадка выделяемого при отстаивании за сутки, м³/сут'
			},
			horizontal: {
				sumpLength: {
					value: this.sumpLength ? Number(this.sumpLength.toFixed(2)) : undefined,
					label: 'Длина отстойника, м'
				},
				oneSumpVolume: {
					value: this.oneSumpVolume ? Number(this.oneSumpVolume.toFixed(2)) : undefined,
					label: 'Вместимость приямника одного отстойника для сбора осадка, м³'
				},
				sedimentCleanPeriod: {
					value: this.sedimentCleanPeriod ? Number(this.sedimentCleanPeriod.toFixed(2)) : undefined,
					label: 'Период между выгрузками осадка из отстойника, ч'
				},
			},
			vertical: {
				gapHeightTrumpetAndShield: {
					value: this.gapHeightTrumpetAndShield ? Number(this.gapHeightTrumpetAndShield.toFixed(2)) : undefined,
					label: 'Высота щели между низом центральной трубы и поверхностью отражательного щита, м'
				},
				commonHeightCylinderSump: {
					value: this.commonHeightCylinderSump ? Number(this.commonHeightCylinderSump.toFixed(2)) : undefined,
					label: 'Общая высота цилиндрической части отстойника, м'
				},
				conePartOfSump: {
					value: this.conePartOfSump ? Number(this.conePartOfSump.toFixed(2)) : undefined,
					label: 'Высота конусной часть отстойника, м'
				},
				sumpDiameter: {
					value: this.sumpDiameter ? Number(this.sumpDiameter.toFixed(2)) : undefined,
					label: 'Диаметр отстойника, м'
				},
				diameterCentralPipe: {
					value: this.diameterCentralPipe ? Number(this.diameterCentralPipe.toFixed(2)) : undefined,
					label: 'Диаметр центральной трубы, м'
				},
				diameterOfTrumpet: {
					value: this.diameterOfTrumpet ? Number(this.diameterOfTrumpet.toFixed(2)) : undefined,
					label: 'Диаметр раструба, м'
				},
				diameterOfReflectorShield: {
					value: this.diameterOfReflectorShield ? Number(this.diameterOfReflectorShield.toFixed(2)) : undefined,
					label: 'Диаметр отражательного щита, м'
				},
			},
			verticalUpDownFlow: {
				commonHeightCylinderSump: {
					value: this.commonHeightCylinderSump ? Number(this.commonHeightCylinderSump.toFixed(2)) : undefined,
					label: 'Общая высота цилиндрической части отстойника, м'
				},
				conePartOfSump: {
					value: this.conePartOfSump ? Number(this.conePartOfSump.toFixed(2)) : undefined,
					label: 'Высота конусной часть отстойника, м'
				},
				sumpDiameter: {
					value: this.sumpDiameter ? Number(this.sumpDiameter.toFixed(2)) : undefined,
					label: 'Диаметр отстойника, м'},
				diameterRingBorder: {
					value: this.diameterRingBorder ? Number(this.diameterRingBorder.toFixed(2)) : undefined,
					label: 'Диаметр кольцевой перегородки, м'
				},
				heightRingBorder: {
					value: this.heightRingBorder ? Number(this.heightRingBorder.toFixed(2)) : undefined,
					label: 'Высота кольцевой перегородки, м'
				},
			},
			radial: {
				sumpDiameter: {
					value: this.sumpDiameter ? Number(this.sumpDiameter.toFixed(2)) : undefined,
					label: 'Диаметр отстойника, м'
				},
			}
		};
		dataModel.setSumpResult(this.sumpResult);
	}

	private resultCounting = () => {
		const { dailyWaterFlow, secondMaxFlow, type } = this.props;
		const {
			baseConcentrate, finalConcentrate, workingDeepSumpPart, workingThreadSpeed,
			widthSection, borderHeight, sedimentWet, alpha,
		} = this.state;
		const Kset = type === SumpTypes.horizontal
			? SumpSource.CoefficientUsingVolume.horizontal
			: type === SumpTypes.vertical
				? SumpSource.CoefficientUsingVolume.vertical
				: type === SumpTypes.verticalUpDownFlow
					? SumpSource.CoefficientUsingVolume.downUpFlow
					: SumpSource.CoefficientUsingVolume.radial;
		// Сommon formula 2: u0 = (1000 * Hset * Kset) / (tset * (Kset * Hset / h1));
		this.countingHydraulicHugest(Kset);
		// Сommon formula 3: Summa(B) = 1000 * qmax / vw * Hset;
		this.summaWidthAllSection = (1000 * secondMaxFlow) / (workingThreadSpeed * workingDeepSumpPart);
		// Сommon formula 4: n = Summa(B) / Bset;
		if (type === SumpTypes.verticalUpDownFlow) {
			const amount = Math.ceil((1000 * secondMaxFlow) /
			(0.707 * Kset * Math.pow(this.sumpDiameter, 2) * this.hydraulicHugest));
			this.amountOfSection = amount < 2 ? 2 : amount;
		} else if (type === SumpTypes.horizontal) {
			const amount = Math.ceil(this.summaWidthAllSection / widthSection);
			this.amountOfSection = amount < 2 ? 2 : amount;
		}
		// turbulentCoefficient
		const turbulentCoefficient = selectTurbulentCoefficient(workingThreadSpeed);
		// Formula horizontal 4: Qmud = Q * (Cen - Cex) / ((100 - pmud)* gamma * 10^4);
		this.sedimentAmountDaily = (dailyWaterFlow * (baseConcentrate - finalConcentrate)) /
			((100 - sedimentWet) * SumpSource.sedimentDensity);

		if (type === SumpTypes.horizontal) {
			// Formula horizontal 1: vw = 1000 * qmax / (Hset * Bset * n); should be (5 - 10) else change Hset
			this.checkWorkingThreadSpeed = 1000 * secondMaxFlow / (workingDeepSumpPart * widthSection * this.amountOfSection);
			// Formula horizontal 2: Lset = (vw * Hset) / (Kset * (u0 - vtb));
			this.sumpLength = (this.checkWorkingThreadSpeed * workingDeepSumpPart) /
				(SumpSource.CoefficientUsingVolume.horizontal * (this.hydraulicHugest - turbulentCoefficient));
			// Formula horizontal 5: Wmud = 1/6 * (Bset - 0.5)*(Bset^2 + 0.5 * Bset + 0.25) * tg(alpha);
			this.oneSumpVolume = 1 / 6 * (widthSection - 0.5) * (Math.pow(widthSection, 2) + 0.5 * widthSection + 0.25) *
				Math.tan(GrateSource.transferRadiansToDegrees(alpha));
			// Formula horizontal 6: T = (24 * n * Wmud) / Qmud;
			this.sedimentCleanPeriod = (24 * this.amountOfSection * this.oneSumpVolume) / this.sedimentAmountDaily;
		}

		if (type === SumpTypes.vertical) {
			// Formula vertical 1: den = sqrt(4 * qmax / (pi * n * ven));
			const diameter = Math.sqrt((4 * secondMaxFlow) / (Math.PI * this.amountOfSection * workingThreadSpeed));
			this.diameterCentralPipe = selectValueAliqout05(diameter);
			// Formula vertical 2: Dset = sqrt(4000 * qmax / pi * n * Kset(u0 - vtb)) + den^2);
			this.sumpDiameter = Math.round(Math.sqrt((4000 * secondMaxFlow) /
				(Math.PI * this.amountOfSection * Kset * this.hydraulicHugest) +
				Math.pow(this.diameterCentralPipe, 2)));
			// Formula vertical 3: dp = 1.35 * den;
			this.diameterOfTrumpet = 1.35 * this.diameterCentralPipe;
			// Formula vertical 4: dщ = 1,3 * dp;
			this.diameterOfReflectorShield = 1.3 * this.diameterOfTrumpet;
			// Formula vertical 5: H1 = qmax / pi * n * dp * vщ;
			this.gapHeightTrumpetAndShield = secondMaxFlow /
				(Math.PI * this.amountOfSection * this.diameterOfTrumpet * SumpSource.speedInGap);
			// Formula vertical 6: Hц = Hset + H1 + H2 + H3;
			this.commonHeightCylinderSump = workingDeepSumpPart + this.gapHeightTrumpetAndShield +
				SumpSource.heightOfNeutralLayer + SumpSource.BorderHeight.max;
		}

		if (type === SumpTypes.verticalUpDownFlow) {
			// Formula vertical 1: Dn = Dset * sqrt(0.5);
			this.diameterRingBorder = this.sumpDiameter * Math.sqrt(0.5);
			// Formula vertical 2: Hn = 2 * Hset / 3;
			this.heightRingBorder = (2 * workingDeepSumpPart) / 3;
			// Formula vertical 3: Hц = Hset + H2 + H3;
			this.commonHeightCylinderSump = workingDeepSumpPart + SumpSource.heightOfNeutralLayer + SumpSource.BorderHeight.max;
		}

		if (type === SumpTypes.radial) {
			// Formula radial 1: Dset = sqrt(4000 * qmax / pi * n * Kset(u0 - vtb));
			this.sumpDiameter = Math.round(Math.sqrt((4000 * secondMaxFlow) /
				(Math.PI * this.amountOfSection * Kset * (this.hydraulicHugest - turbulentCoefficient))));
			// Formula radial 2: v = (2 * qmax) / pi * n * Dset * Hset;
			this.checkWorkingThreadSpeed = (2 * secondMaxFlow) /
				(Math.PI * this.amountOfSection * this.sumpDiameter * workingDeepSumpPart);
		}

		if (type === SumpTypes.vertical || type === SumpTypes.verticalUpDownFlow) {
			// Formula vertical/verticalUpDownFlow 7: Hk = 0.5 * Dset * tan(alpha);
			this.conePartOfSump = 0.5 * this.sumpDiameter * Math.tan(GrateSource.transferRadiansToDegrees(alpha));
			// Formula vertical/verticalUpDownFlow 8: H = Hц + Hk;
			this.fullSumpHeight = this.commonHeightCylinderSump + this.conePartOfSump;
		}

		if (type === SumpTypes.horizontal || type === SumpTypes.radial) {
			// Formula horizontal/radial 3: H = Hset + H1 + H2;
			this.fullSumpHeight = workingDeepSumpPart + borderHeight + SumpSource.heightOfNeutralLayer;
		}

		this.setSumpResult();

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return renderSumpResult(this.sumpResult, false);
	}

	private returnToScheme = () => {
		this.props.onCountMode(false);
	}

	private goToResult = () => {
		this.props.onCountMode(false);
		this.props.onResultMode(true);
	}

	private openChangeScheme = () => {
		this.setState({showChangeScheme: true});
	}

	private closeChangeScheme = () => {
		this.setState({showChangeScheme: false});
	}

	private openShowResult = () => {
		this.setState({showOpenResult: true});
	}

	private closeShowResult = () => {
		this.setState({showOpenResult: false});
	}

	render() {
		const { type, secondMaxFlow, dailyWaterFlow } = this.props;
		const { showChangeScheme, showOpenResult } = this.state;
		return (
			<>
				<div className={'title-container'}>
					{type === SumpTypes.horizontal ?
						<div className={'count-title'}>Горизонтальные</div> :
						type === SumpTypes.radial ?
							<div className={'count-title'}>Радиальные</div> :
							type === SumpTypes.vertical ?
								<div className={'count-title'}>Вертикальные с впуском через центральную трубу</div> :
								<div className={'count-title'}>Вертикальные с нисходяще-восходящим потоком</div>}
					{renderToolbar(
						this.returnToScheme,
						this.goToResult,
						this.openChangeScheme,
						this.closeChangeScheme,
						this.openShowResult,
						this.closeShowResult,
						showChangeScheme,
						showOpenResult,
					)}
				</div>
				<div className={'device-container'}>
					<div className={'device-input'}>
						{renderBaseData(secondMaxFlow, dailyWaterFlow)}
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

export function selectValueFromDiapason(array: number[], valueToCompare: number): number {
	let value;
	for (let index = 0; index < array.length; index++) {
		if (valueToCompare >= array[index] && valueToCompare <= array[index + 1]) {
			if (((array[index + 1] + array[index]) / 2) > valueToCompare) {
				value = array[index];
				break;
			} else {
				value = array[index + 1];
				break;
			}
		} else if (valueToCompare >= array[index]) {
			if (index === array.length - 1) {
				value = array[index];
				break;
			}
			continue;
		} else if (valueToCompare <= array[index]) {
			value = array[index];
			break;
		}
	}
	return value;
}

function findPeriodOfSettling(baseConcentrate: number, highLightEffect: number): number {
	const highLightEffectValue = selectValueFromDiapason(SumpSource.highLightEffectFixedValues, highLightEffect);
	const concentrate = selectValueFromDiapason(SumpSource.concentrateFixedValues, baseConcentrate);
	const periodValue = SumpSource.periodOfSettling.find(period =>
		highLightEffectValue === period.highLightEffect && concentrate === period.concentrate);
	return periodValue.period;
}

function selectExponentValue(baseConcentrate: number, highLightEffect: number) {
	const exponentConstMin = 56.781;
	const exponentMinValue = -0.987;
	const exponentConstMiddle = 13.97;
	const exponentMiddleValue = -0.692;
	const exponentConstMax = 86.258;
	const exponentMaxValue = -1.147;
	if (highLightEffect <= SumpSource.HighLightEffectDiapason.low) {
		return exponentConstMin * Math.pow(baseConcentrate, exponentMinValue);
	} else if (highLightEffect > SumpSource.HighLightEffectDiapason.low &&
		highLightEffect < SumpSource.HighLightEffectDiapason.high) {
		return exponentConstMiddle * Math.pow(baseConcentrate, exponentMiddleValue);
	} else {
		return exponentConstMax * Math.pow(baseConcentrate, exponentMaxValue);
	}
}

function selectTurbulentCoefficient(workingThreadSpeed: number): number {
	const source = SumpSource.WorkingThreadSpeed;
	const array = [source.min, source.middle, source.max];
	const workingThreadSpeedRound = selectValueFromDiapason(array, workingThreadSpeed);
	if (workingThreadSpeedRound === source.min) {
		return SumpSource.TurbulentCoefficient.min;
	} else if (workingThreadSpeedRound === source.middle) {
		return SumpSource.TurbulentCoefficient.middle;
	} else if (workingThreadSpeedRound === source.max) {
		return SumpSource.TurbulentCoefficient.max;
	}
}

export function selectValueAliqout05(value: number) {
	if (value < 0.5) {
		return 0.5;
	} else {
		if (Math.round(value) === Math.ceil(value)) {
			return Math.ceil(value);
		} else {
			return Math.round(value) + 0.5;
		}
	}
}

export function renderSumpResult(
	sumpResult: SumpResultData,
	isGeneralResult: boolean,
) {
	if (!sumpResult) {
		return null;
	}
	const horizontal = sumpResult.horizontal;
	const vertical = sumpResult.vertical;
	const verticalUpDownFlow = sumpResult.verticalUpDownFlow;
	const radial = sumpResult.radial;
	const deviceType = sumpResult.deviceType === SumpTypes.horizontal
		? 'Горизонтальные'
		: sumpResult.deviceType === SumpTypes.radial
			? 'Радиальные'
			: sumpResult.deviceType === SumpTypes.vertical
				? 'Вертикальные с впуском через центральную трубу'
				: 'Вертикальные с нисходяще-восходящим потоком';
	return (
		<div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					{isGeneralResult
						? <TableRow value={deviceType} label={'Тип'} />
						: null}
					<TableRow value={sumpResult.highLightEffect.value} label={sumpResult.highLightEffect.label} />
					<TableRow value={sumpResult.amountOfSection.value} label={sumpResult.amountOfSection.label} />
					{sumpResult.deviceType === SumpTypes.horizontal
						? <>
							<TableRow value={horizontal.sumpLength.value} label={horizontal.sumpLength.label} />
							<TableRow value={horizontal.oneSumpVolume.value} label={horizontal.oneSumpVolume.label} />
							<TableRow value={horizontal.sedimentCleanPeriod.value} label={horizontal.sedimentCleanPeriod.label} />
						</>
						: null}
					<TableRow value={sumpResult.fullSumpHeight.value} label={sumpResult.fullSumpHeight.label} />
					{sumpResult.deviceType === SumpTypes.vertical
						? <>
							<TableRow value={vertical.gapHeightTrumpetAndShield.value} label={vertical.gapHeightTrumpetAndShield.label} />
							<TableRow value={vertical.commonHeightCylinderSump.value} label={vertical.commonHeightCylinderSump.label} />
							<TableRow value={vertical.conePartOfSump.value} label={vertical.conePartOfSump.label} />
						</>
						: null}
					{sumpResult.deviceType === SumpTypes.verticalUpDownFlow
						? <>
							<TableRow value={verticalUpDownFlow.commonHeightCylinderSump.value} label={verticalUpDownFlow.commonHeightCylinderSump.label} />
							<TableRow value={verticalUpDownFlow.conePartOfSump.value} label={verticalUpDownFlow.conePartOfSump.label} />
							<TableRow value={verticalUpDownFlow.sumpDiameter.value} label={verticalUpDownFlow.sumpDiameter.label} />
							<TableRow value={verticalUpDownFlow.diameterRingBorder.value} label={verticalUpDownFlow.diameterRingBorder.label} />
							<TableRow value={verticalUpDownFlow.heightRingBorder.value} label={verticalUpDownFlow.heightRingBorder.label} />
						</>
						: null}
					{sumpResult.deviceType === SumpTypes.vertical
						? <>
							<TableRow value={vertical.sumpDiameter.value} label={vertical.sumpDiameter.label} />
							<TableRow value={vertical.diameterCentralPipe.value} label={vertical.diameterCentralPipe.label} />
							<TableRow value={vertical.diameterOfTrumpet.value} label={vertical.diameterOfTrumpet.label} />
							<TableRow value={vertical.diameterOfReflectorShield.value} label={vertical.diameterOfReflectorShield.label} />
						</>
						: null}
					{sumpResult.deviceType === SumpTypes.radial
						? <TableRow value={radial.sumpDiameter.value} label={radial.sumpDiameter.label} />
						: null}
					<TableRow value={sumpResult.sedimentAmountDaily.value} label={sumpResult.sedimentAmountDaily.label} />
				</tbody>
			</Table>
		</div>
	);
}