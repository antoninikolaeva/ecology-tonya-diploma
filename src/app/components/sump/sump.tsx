import * as React from 'react';

import { SumpTypes } from '../general-resources';
import { labelTemplate, InputTemplate, NULLSTR, SelectTemplate, ItemList, resetSelectToDefault } from '../utils';
import { Table } from 'react-bootstrap';
import { SumpSource } from './sump-resources';
import { ErrorAlert } from '../error/error';
import { transferRadiansToDegrees } from '../grate/grate.service';

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
	isValidateError: boolean;
	isResult: boolean;
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
	private sumpDiametersRef: HTMLOptionElement[] = [];

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
	private diameterRingBorder: number;
	private heightRingBorder: number;

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
			isValidateError: false,
			isResult: false,
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
		if (this.alphaRef) { this.alphaRef.value = NULLSTR; }
		resetSelectToDefault(this.sumpDiametersRef, this.sumpDiametersList);
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
		const { type } = this.props;
		const { baseConcentrate, workingDeepSumpPart, finalConcentrate, } = this.state;
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
					? <InputTemplate title={`Допустимая конечная концентрация взвешенных веществ в осветленной воде, мг/л,
						диапазон[0 - ${baseConcentrate}]`}
						range={{ minValue: 0, maxValue: baseConcentrate }}
						placeholder={'Введите допустимую конечную концентрацию взвешенных веществ...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalConcentrateRef = input; }}
						onInput={(value) => { this.setState({ finalConcentrate: value }); }} />
					: null}

				{baseConcentrate && finalConcentrate
					? <InputTemplate title={`Рабочая глубина отстойной части, мг/л,
						диапазон[${type === SumpTypes.horizontal || type === SumpTypes.radial
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
				this.checkWorkingThreadSpeed > SumpSource.WorkingThreadSpeed.min &&
				this.checkWorkingThreadSpeed < SumpSource.WorkingThreadSpeed.middle
					? <ErrorAlert errorMessage={`Проверка скорости рабочего потока : ${this.checkWorkingThreadSpeed},
					должна быть в пределах диапазона ${SumpSource.WorkingThreadSpeed.min} - ${SumpSource.WorkingThreadSpeed.middle}.
					Для урегулирования скорости измените рабочую глубину отстойника.`} />
					: null}

				{workingDeepSumpPart
					? <InputTemplate title={`Ширина секции, м,
							диапазон[${(SumpSource.WidthSectionCoefficient.min * workingDeepSumpPart)} -
							${(SumpSource.WidthSectionCoefficient.max * workingDeepSumpPart)}]`}
							range={{
								minValue: (SumpSource.WidthSectionCoefficient.min * workingDeepSumpPart),
								maxValue: (SumpSource.WidthSectionCoefficient.max * workingDeepSumpPart)
							}}
							placeholder={'Введите ширину секции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.widthSectionRef = input; }}
							onInput={(value) => { this.setState({ widthSection: value }); }} />
					: null}

				{baseConcentrate && workingDeepSumpPart && finalConcentrate
					? <InputTemplate title={`Скорость рабочего потока, мм/с,
						диапазон[${type === SumpTypes.horizontal || type === SumpTypes.radial
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

				{type === SumpTypes.radial && this.checkWorkingThreadSpeed > SumpSource.WorkingThreadSpeed.middle
					? <ErrorAlert errorMessage={`Проверка скорости рабочего потока : ${this.checkWorkingThreadSpeed},
					должна быть меньше табличной скорости потока : ${SumpSource.WorkingThreadSpeed.middle}.
					Для урегулирования скорости измените количество отделений отстойников.`} />
					: null}

				<InputTemplate title={`Влажность осадка, %,
					диапазон[${SumpSource.SedimentWet.min} - ${SumpSource.SedimentWet.max}]`}
					range={{ minValue: SumpSource.SedimentWet.min, maxValue: SumpSource.SedimentWet.max }}
					placeholder={'Введите влажность осадка...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.sedimentWetRef = input; }}
					onInput={(value) => { this.setState({ sedimentWet: value }); }} />

				{this.amountOfSection < SumpSource.minAmountOfSection
					? <ErrorAlert errorMessage={`Количество отделений отстойника: ${this.amountOfSection},
					должно быть не менее ${SumpSource.minAmountOfSection}`} />
					: null}

				{type === SumpTypes.horizontal || type === SumpTypes.radial
					? <InputTemplate title={`Высота борта над слоем воды, м,
							диапазон[${SumpSource.BorderHeight.min} - ${SumpSource.BorderHeight.max}]`}
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

				<InputTemplate title={`Угол наклона стенок приямника, градусы,
					диапазон[${SumpSource.Alpha.min}
					-
					${type === SumpTypes.horizontal
						? SumpSource.Alpha.middle
						: type === SumpTypes.vertical
							? SumpSource.Alpha.max
							: SumpSource.Alpha.max}]`}
					range={{ minValue: SumpSource.Alpha.min, maxValue: SumpSource.Alpha.max }}
					placeholder={'Введите угол наклона стенок приямника...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.alphaRef = input; }}
					onInput={(value) => { this.setState({ alpha: value }); }} />

				{this.renderCheckingButton()}
			</>
		);
	}

	private isInputReadyToCounting = (): boolean => {
		const { type } = this.props;
		const {
			baseConcentrate, finalConcentrate, workingDeepSumpPart, workingThreadSpeed,
			widthSection, borderHeight, sedimentWet, alpha,
		} = this.state;
		const notRadial = (type !== SumpTypes.radial && alpha) ? true : false;
		const onlyHorizontal = (type === SumpTypes.horizontal && borderHeight) ? true : false;
		const commonInputs = (baseConcentrate && finalConcentrate && workingDeepSumpPart &&
			workingThreadSpeed && widthSection && sedimentWet) ? true : false;
		if (type === SumpTypes.horizontal) {
			return commonInputs && onlyHorizontal && notRadial;
		} else if (type !== SumpTypes.radial) {
			return commonInputs && notRadial;
		} else {
			return commonInputs;
		}
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
			this.amountOfSection = Math.ceil(convertSecondMaxFlowToHour(secondMaxFlow) /
				(1.41 * Kset * Math.pow(this.sumpDiameter, 2) * this.hydraulicHugest));
		} else {
			this.amountOfSection = Math.ceil(this.summaWidthAllSection / widthSection);
		}
		// turbulentCoefficient
		const turbulentCoefficient = selectTurbulentCoefficient(workingThreadSpeed);
		// Formula horizontal 4: Qmud = Q * (Cen - Cex) / ((100 - pmud)* gamma * 10^4);
		this.sedimentAmountDaily = (dailyWaterFlow * (baseConcentrate - finalConcentrate)) / ((100 - sedimentWet) * SumpSource.sedimentDensity);

		if (type === SumpTypes.horizontal) {
			// Formula horizontal 1: vw = 1000 * qmax / Hset * Bset * n; should be (5 - 10) else change Hset
			this.checkWorkingThreadSpeed = 1000 * secondMaxFlow / (workingDeepSumpPart * widthSection * this.amountOfSection);
			// Formula horizontal 2: Lset = (vw * Hset) / Kset * (u0 - vtb);
			this.sumpLength = (this.checkWorkingThreadSpeed * workingDeepSumpPart) /
				(SumpSource.CoefficientUsingVolume.horizontal * (this.hydraulicHugest - turbulentCoefficient));
			// Formula horizontal 5: Wmud = 1/6 * (Bset - 0.5)*(Bset^2 + 0.5 * Bset + 0.25) * tg(alpha);
			this.oneSumpVolume = 1 / 6 * (widthSection - 0.5) * (Math.pow(widthSection, 2) + 0.5 * widthSection + 0.25) *
				Math.tan(transferRadiansToDegrees(alpha));
			// Formula horizontal 6: Lset = (24 * n * Wmud) / Qmud;
			this.sedimentCleanPeriod = (24 * this.amountOfSection * this.oneSumpVolume) / this.sedimentAmountDaily;
		}

		if (type === SumpTypes.vertical) {
			// Formula vertical 1: den = sqrt(4 * qmax / pi * n * ven);
			this.diameterCentralPipe = Math.sqrt((4 * secondMaxFlow) / (Math.PI * this.amountOfSection * workingThreadSpeed));
			// Formula vertical 2: Dset = sqrt(4000 * qmax / pi * n * Kset(u0 - vtb) + den^2);
			this.sumpDiameter = Math.sqrt((4000 * secondMaxFlow) /
				(Math.PI * this.amountOfSection * Kset * (this.hydraulicHugest - turbulentCoefficient)) +
				Math.pow(this.diameterCentralPipe, 2));
			// Formula vertical 3: dp = 1.35 * den;
			this.diameterOfTrumpet = 1.35 * this.sumpDiameter;
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
			this.sumpDiameter = Math.sqrt((4000 * secondMaxFlow) /
				(Math.PI * this.amountOfSection * Kset * (this.hydraulicHugest - turbulentCoefficient)));
			// Formula radial 2: v = (2 * qmax) / pi * n * Dset * Hset;
			this.checkWorkingThreadSpeed = (2 * secondMaxFlow) /
				(Math.PI * this.amountOfSection * this.sumpDiameter * workingDeepSumpPart);
		}

		if (type === SumpTypes.vertical || type === SumpTypes.verticalUpDownFlow) {
			// Formula vertical/verticalUpDownFlow 7: Hk = 0.5 * Dset * tan(alpha);
			this.conePartOfSump = 0.5 * this.sumpDiameter * Math.tan(transferRadiansToDegrees(alpha));
			// Formula vertical/verticalUpDownFlow 8: Hц = Hц + Hk;
			this.fullSumpHeight = this.commonHeightCylinderSump + this.conePartOfSump;
		}

		if (type === SumpTypes.horizontal || type === SumpTypes.radial) {
			// Formula horizontal/radial 3: H = Hset + H1 + H2;
			this.fullSumpHeight = workingDeepSumpPart + borderHeight + SumpSource.heightOfNeutralLayer;
		}

		this.setState({ isResult: true });
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
						<tr><td>Количество отделений отстойника, шт</td>
							<td>{this.amountOfSection ? this.amountOfSection : undefined}</td></tr>
						<tr><td>Количество осадка выделяемого при отсаивании за сутки, м3/сут</td>
							<td>{this.sedimentAmountDaily ? this.sedimentAmountDaily.toFixed(3) : undefined}</td></tr>

						{type === SumpTypes.horizontal
							? <>
								<tr><td>Длина отстойника, м</td>
									<td>{this.sumpLength ? this.sumpLength.toFixed(3) : undefined}</td></tr>
								<tr><td>Вместимость приямника одного отстойника для сбора осадка, м3</td>
									<td>{this.oneSumpVolume ? this.oneSumpVolume.toFixed(3) : undefined}</td></tr>
								<tr><td>Период между выгрузками осадка из отстойника, ч</td>
									<td>{this.sedimentCleanPeriod ? this.sedimentCleanPeriod.toFixed(3) : undefined}</td></tr>
							</>
							: null}

						{type === SumpTypes.vertical
							? <>
								<tr><td>Диаметр центральной трубы, м</td>
									<td>{this.diameterCentralPipe ? this.diameterCentralPipe.toFixed(3) : undefined}</td></tr>
								<tr><td>Диаметр раструба, м</td>
									<td>{this.diameterOfTrumpet ? this.diameterOfTrumpet.toFixed(3) : undefined}</td></tr>
								<tr><td>Диаметр отражательного щита, м</td>
									<td>{this.diameterOfReflectorShield ? this.diameterOfReflectorShield.toFixed(3) : undefined}</td></tr>
								<tr><td>Высота щели между низом центральной трубы и поверхностью отражательного щита, м</td>
									<td>{this.gapHeightTrumpetAndShield ? this.gapHeightTrumpetAndShield.toFixed(3) : undefined}</td></tr>
							</>
							: null}

						{type === SumpTypes.verticalUpDownFlow
							? <>
								<tr><td>Диаметр кольцевой перегородки, м</td>
									<td>{this.diameterRingBorder ? this.diameterRingBorder.toFixed(3) : undefined}</td></tr>
								<tr><td>Высота кольцевой перегородки, м</td>
									<td>{this.heightRingBorder ? this.heightRingBorder.toFixed(3) : undefined}</td></tr>
							</>
							: null}

						{type === SumpTypes.verticalUpDownFlow || type === SumpTypes.vertical
							? <>
								<tr><td>Общая высота цилиндрической части отстойника, м</td>
									<td>{this.commonHeightCylinderSump ? this.commonHeightCylinderSump.toFixed(3) : undefined}</td></tr>
								<tr><td>Высота конусной часть отстойника, м</td>
									<td>{this.conePartOfSump ? this.conePartOfSump.toFixed(3) : undefined}</td></tr>
							</>
							: null}

						{type === SumpTypes.verticalUpDownFlow ||
							type === SumpTypes.vertical ||
							type === SumpTypes.radial
							? <>
								<tr><td>Диаметр отстойника, м</td>
									<td>{this.sumpDiameter ? this.sumpDiameter.toFixed(3) : undefined}</td></tr>
							</>
							: null}

							<tr><td>Общая высота отстойника, м</td>
								<td>{this.fullSumpHeight ? this.fullSumpHeight.toFixed(3) : undefined}</td></tr>
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

function selectValueFromDiapason(array: number[], valueToCompare: number): number {
	let value;
	for (let index = 0; index < array.length; index++) {
		if (valueToCompare >= array[index] && valueToCompare <= array[index + 1]) {
			if (((array[index + 1] + array[index]) / 2) > valueToCompare) {
				value = array[index];
			} else {
				value = array[index + 1];
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
	if (highLightEffect < SumpSource.HighLightEffectDiapason.low) {
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

function convertSecondMaxFlowToHour(secondMaxFlow: number) {
	return 3600 * secondMaxFlow;
}
