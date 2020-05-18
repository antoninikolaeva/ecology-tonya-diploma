import * as React from 'react';
import { AverageTypes } from '../general-resources';
import { labelTemplate, NULLSTR, InputTemplate, ItemList, resetSelectToDefault, SelectTemplate, TableRow } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, AverageResultData } from '../data-model';
import { AverageSource } from './average-resource';
import { ErrorAlert } from '../error/error';

export interface AverageProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: AverageTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface AverageState {
	maxConcentrate: number;
	finalConcentrate: number;
	middleConcentrate: number;
	averageMechanism: AverageSource.AverageMechanismType;
	deviceWorkingPeriod: number;
	averageDeep: number;
	amountOfSection: number;
	sectionWidth: number;
	bubbleDeep: number;
	distanceBetweenWallBubble: number;
	distanceBetweenIntervalBubble: number;
	amountOfIntervalBubble: number;
	amountOfSectionChannel: number;
	waterSpeedInTray: number;
	waterDeepInDistributeTray: number;
	bubbleType: number;
	formOfAverage: AverageSource.FormOfAverage;
	isValidateError: boolean;
	isResult: boolean;
}

export class AverageComponent extends React.Component<AverageProps, AverageState> {
	private maxConcentrateRef: HTMLInputElement;
	private finalConcentrateRef: HTMLInputElement;
	private middleConcentrateRef: HTMLInputElement;
	private deviceWorkingPeriodRef: HTMLInputElement;
	private averageDeepRef: HTMLInputElement;
	private amountOfSectionRef: HTMLInputElement;
	private sectionWidthRef: HTMLInputElement;
	private bubbleDeepRef: HTMLInputElement;
	private distanceBetweenWallBubbleRef: HTMLInputElement;
	private distanceBetweenIntervalBubbleRef: HTMLInputElement;
	private amountOfIntervalBubbleRef: HTMLInputElement;
	private amountOfSectionChannelRef: HTMLInputElement;
	private waterSpeedInTrayRef: HTMLInputElement;
	private waterDeepInDistributeTrayRef: HTMLInputElement;
	private averageMechanismRef: HTMLOptionElement[] = [];
	private bubbleTypeListRef: HTMLOptionElement[] = [];
	private formOfAverageListRef: HTMLOptionElement[] = [];

	private averageCoefficient: number;
	private averageMechanismList: ItemList[] = [
		{ value: undefined, label: 'Выберите устройство тип усреднителя' },
		{ value: AverageSource.AverageMechanismType.bubbling, label: `Усреднитель смеситель барботажного типа` },
		{ value: AverageSource.AverageMechanismType.multichannel_width, label: `Многоканальный усреднитель с каналами разной ширины` },
		{ value: AverageSource.AverageMechanismType.multichannel_length, label: `Многоканальный усреднитель с каналами разной длины` },
	];
	private bubbleTypeList: ItemList[] = [
		{ value: undefined, label: 'Выберите тип использования барботеров' },
		{ value: AverageSource.BubbleType.averageConcentrate, label: 'Усреднение концентраций' },
		{ value: AverageSource.BubbleType.stopDropSediment, label: 'Предотвращение выпадения взвесей' },
	];
	private formOfAverageList: ItemList[] = [
		{ value: undefined, label: 'Выберите форму усреднителя в плане' },
		{ value: AverageSource.FormOfAverage.prizma, label: 'Прямоугольный' },
		{ value: AverageSource.FormOfAverage.circle, label: 'Круглый' },
	];
	private averageVolume: number;
	private sectionSquare: number;
	private averageLength: number;
	private speedOfWaterFlow: number;
	private commonAirFlow: number;
	private widthOfEachChannel: number[] = [];
	private waterFlowOfEachChannel: number[] = [];
	private crossSectionalArea: number;
	private squareBottomForEachChannel: number[] = [];
	private squareSideForEachChannel: number[] = [];
	private volumeOfOneSection: number;
	private averageDiameter: number;
	private channelWidthPrizma: number;
	private channelWidthCircle: number;

	private averageResult: AverageResultData;

	constructor(props: AverageProps) {
		super(props);

		this.state = {
			maxConcentrate: undefined,
			finalConcentrate: undefined,
			middleConcentrate: undefined,
			averageMechanism: undefined,
			deviceWorkingPeriod: undefined,
			averageDeep: undefined,
			amountOfSection: undefined,
			sectionWidth: undefined,
			bubbleDeep: undefined,
			distanceBetweenWallBubble: undefined,
			distanceBetweenIntervalBubble: undefined,
			amountOfIntervalBubble: undefined,
			amountOfSectionChannel: undefined,
			waterSpeedInTray: undefined,
			waterDeepInDistributeTray: undefined,
			bubbleType: undefined,
			formOfAverage: undefined,
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		if (this.maxConcentrateRef) { this.maxConcentrateRef.value = NULLSTR; }
		if (this.finalConcentrateRef) { this.finalConcentrateRef.value = NULLSTR; }
		if (this.middleConcentrateRef) { this.middleConcentrateRef.value = NULLSTR; }
		if (this.deviceWorkingPeriodRef) { this.deviceWorkingPeriodRef.value = NULLSTR; }
		if (this.averageDeepRef) { this.averageDeepRef.value = NULLSTR; }
		if (this.amountOfSectionRef) { this.amountOfSectionRef.value = NULLSTR; }
		if (this.sectionWidthRef) { this.sectionWidthRef.value = NULLSTR; }
		if (this.bubbleDeepRef) { this.bubbleDeepRef.value = NULLSTR; }
		if (this.distanceBetweenWallBubbleRef) { this.distanceBetweenWallBubbleRef.value = NULLSTR; }
		if (this.distanceBetweenIntervalBubbleRef) { this.distanceBetweenIntervalBubbleRef.value = NULLSTR; }
		if (this.amountOfIntervalBubbleRef) { this.amountOfIntervalBubbleRef.value = NULLSTR; }
		if (this.amountOfSectionChannelRef) { this.amountOfSectionChannelRef.value = NULLSTR; }
		if (this.waterSpeedInTrayRef) { this.waterSpeedInTrayRef.value = NULLSTR; }
		if (this.waterDeepInDistributeTrayRef) { this.waterDeepInDistributeTrayRef.value = NULLSTR; }
		resetSelectToDefault(this.averageMechanismRef, this.averageMechanismList);
		resetSelectToDefault(this.bubbleTypeListRef, this.bubbleTypeList);
		resetSelectToDefault(this.formOfAverageListRef, this.formOfAverageList);
		this.setState({
			maxConcentrate: undefined,
			finalConcentrate: undefined,
			middleConcentrate: undefined,
			averageMechanism: undefined,
			deviceWorkingPeriod: undefined,
			averageDeep: undefined,
			amountOfSection: undefined,
			sectionWidth: undefined,
			bubbleDeep: undefined,
			distanceBetweenWallBubble: undefined,
			distanceBetweenIntervalBubble: undefined,
			amountOfIntervalBubble: undefined,
			amountOfSectionChannel: undefined,
			waterSpeedInTray: undefined,
			waterDeepInDistributeTray: undefined,
			bubbleType: undefined,
			formOfAverage: undefined,
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
		const {
			maxConcentrate, finalConcentrate, averageMechanism,
			bubbleDeep, formOfAverage, amountOfIntervalBubble,
		} = this.state;
		let badWidth;
		if (averageMechanism === AverageSource.AverageMechanismType.multichannel_width) {
			badWidth = this.widthOfEachChannelCheck();
		}
		return (
			<>
				<InputTemplate title={`Максимальная концентрация загрязнений в стоке, мг/л`}
					range={{ minValue: 0, maxValue: Infinity }}
					placeholder={'Введите максимальную концентрацию загрязнений в стоке...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.maxConcentrateRef = input; }}
					onInput={(value) => { this.setState({ maxConcentrate: value }); }} />

				{maxConcentrate
					? <InputTemplate title={`Допустимая концентрация по условию работы последующих сооружений, мг/л,
						диапазон[0 - ${maxConcentrate}]`}
						range={{ minValue: 0, maxValue: maxConcentrate }}
						placeholder={'Введите допустимую концентрацию...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalConcentrateRef = input; }}
						onInput={(value) => { this.setState({ finalConcentrate: value }); }} />
					: null}

				{finalConcentrate
					? <InputTemplate title={`Средняя концентрация загрязнений в стоке, мг/л,
						диапазон[0 - ${finalConcentrate}]`}
						range={{ minValue: 0, maxValue: finalConcentrate }}
						placeholder={'Введите среднюю концентрацию загрязнений в стоке...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.middleConcentrateRef = input; }}
						onInput={(value) => {
							this.countingAverageCoefficient(value);
							this.setState({ middleConcentrate: value });
						}} />
					: null}

				{this.averageCoefficient
					? <SelectTemplate title={'Диаметр отстойника, м'} itemList={this.averageMechanismList}
							onSelect={(value) => { this.setState({ averageMechanism: value as AverageSource.AverageMechanismType }); }}
							onSelectRef={(optionList) => { this.averageMechanismRef = optionList; }} />
					: null}

				<InputTemplate title={`Период работы устройства усреднителя, ч`}
					range={{ minValue: 0, maxValue: Infinity }}
					placeholder={'Введите период работы устройства усреднителя...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.deviceWorkingPeriodRef = input; }}
					onInput={(value) => { this.setState({ deviceWorkingPeriod: value }); }} />

				<InputTemplate title={`Глубина усреднителя, м, диапазон[${averageMechanism === AverageSource.AverageMechanismType.bubbling
					? AverageSource.AverageDeep.min
					: 0}
					-
					${averageMechanism === AverageSource.AverageMechanismType.bubbling
						? AverageSource.AverageDeep.max
						: averageMechanism === AverageSource.AverageMechanismType.multichannel_width
							? AverageSource.AverageDeep.middle
							: AverageSource.AverageDeep.less}]`}
					range={{ minValue: averageMechanism === AverageSource.AverageMechanismType.bubbling
						? AverageSource.AverageDeep.min
						: 0,
						maxValue: averageMechanism === AverageSource.AverageMechanismType.bubbling
						? AverageSource.AverageDeep.max
						: averageMechanism === AverageSource.AverageMechanismType.multichannel_width
							? AverageSource.AverageDeep.middle
							: AverageSource.AverageDeep.less }}
					placeholder={'Введите глубину усреднителя...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.averageDeepRef = input; }}
					onInput={(value) => { this.setState({ averageDeep: value }); }} />

				<InputTemplate title={`Количесво секций, шт, диапазон[${AverageSource.minAmountOfSection} - n]`}
					range={{ minValue: AverageSource.minAmountOfSection, maxValue: Infinity }}
					placeholder={'Введите количесво секций...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.amountOfSectionRef = input; }}
					onInput={(value) => { this.setState({ amountOfSection: value }); }} />

				{averageMechanism === AverageSource.AverageMechanismType.multichannel_length
					? <>
						<SelectTemplate title={'Форма усреднителя в плане'} itemList={this.formOfAverageList}
							onSelect={(value) => { this.setState({ formOfAverage: value as AverageSource.FormOfAverage }); }}
							onSelectRef={(optionList) => { this.formOfAverageListRef = optionList; }} />
					</>
					: null}

				{averageMechanism === AverageSource.AverageMechanismType.multichannel_length &&
					formOfAverage === AverageSource.FormOfAverage.prizma
					? <>
						<InputTemplate title={`Ширина секций, м`}
							range={{ minValue: 0, maxValue: Infinity }}
							placeholder={'Введите ширину секций...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.sectionWidthRef = input; }}
							onInput={(value) => { this.setState({ sectionWidth: value }); }} />
					</>
					: null}

				{!(averageMechanism === AverageSource.AverageMechanismType.multichannel_length)
					? <>
						<InputTemplate title={`Ширина секций, м`}
							range={{ minValue: 0, maxValue: Infinity }}
							placeholder={'Введите ширину секций...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.sectionWidthRef = input; }}
							onInput={(value) => { this.setState({ sectionWidth: value }); }} />
					</>
					: null}

				{averageMechanism === AverageSource.AverageMechanismType.bubbling
					? <>
						{this.speedOfWaterFlow > AverageSource.checkSpeed
							? <ErrorAlert errorMessage={`Значение скорости продольного движения воды: ${this.speedOfWaterFlow} м/с,
									должно быть не более ${AverageSource.checkSpeed} м/с.
									Для урегулирования значения скрости поменяйте количество секций или глубину усреднителя.`} />
							: null}

						<SelectTemplate title={'Тип использования барботеров'} itemList={this.bubbleTypeList}
							onSelect={(value) => { this.setState({ bubbleType: value as number }); }}
							onSelectRef={(optionList) => { this.bubbleTypeListRef = optionList; }} />

						<InputTemplate title={`Глубина погружения барботеров, м,
							диапазон[${AverageSource.BubbleDeep.min} - ${AverageSource.BubbleDeep.max}]`}
							range={{ minValue: AverageSource.BubbleDeep.min, maxValue: AverageSource.BubbleDeep.max }}
							placeholder={'Введите глубину погружения барботеров...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.bubbleDeepRef = input; }}
							onInput={(value) => { this.setState({ bubbleDeep: value }); }} />

						{bubbleDeep
							? <>
								<InputTemplate title={`Расстояние между пристенными барботерами, м,
									диапазон[${AverageSource.BubbleDistanceWall.min * bubbleDeep} - ${AverageSource.BubbleDistanceWall.max * bubbleDeep}]`}
									range={{
										minValue: (AverageSource.BubbleDistanceWall.min * bubbleDeep),
										maxValue: (AverageSource.BubbleDistanceWall.max * bubbleDeep)
									}}
									placeholder={'Введите расстояние между пристенными барботерамив...'}
									onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
									onInputRef={(input) => { this.distanceBetweenWallBubbleRef = input; }}
									onInput={(value) => { this.setState({ distanceBetweenWallBubble: value }); }} />
							</>
							: null}

						<InputTemplate title={`Количество промежуточных барботеров, шт`}
							range={{ minValue: 0, maxValue: Infinity }}
							placeholder={'Введите количество промежуточных барботеров...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.amountOfIntervalBubbleRef = input; }}
							onInput={(value) => { this.setState({ amountOfIntervalBubble: value }); }} />

						{bubbleDeep && amountOfIntervalBubble > 1
							? <>
								<InputTemplate title={`Расстояние между промежуточными барботерами, м,
									диапазон[${AverageSource.BubbleDistanceInterval.min * bubbleDeep}
									- ${AverageSource.BubbleDistanceInterval.max * bubbleDeep}]`}
									range={{
										minValue: AverageSource.BubbleDistanceInterval.min * bubbleDeep,
										maxValue: AverageSource.BubbleDistanceInterval.max * bubbleDeep
									}}
									placeholder={'Введите расстояние между промежуточными барботерами...'}
									onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
									onInputRef={(input) => { this.distanceBetweenIntervalBubbleRef = input; }}
									onInput={(value) => { this.setState({ distanceBetweenIntervalBubble: value }); }} />
							</>
							: null}
					</>
					: null}

				{averageMechanism === AverageSource.AverageMechanismType.multichannel_width
					? <>
						<InputTemplate title={`Количество каналов в одной секции усреднителя, шт, диапазон[${AverageSource.minAmountOfSectionChannel} - n]`}
							range={{ minValue: AverageSource.minAmountOfSectionChannel, maxValue: Infinity }}
							placeholder={'Введите количество каналов...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.amountOfSectionChannelRef = input; }}
							onInput={(value) => { this.setState({ amountOfSectionChannel: value }); }} />

						{badWidth
							? <ErrorAlert errorMessage={`Ширина канала: ${badWidth.index}, равная ${badWidth.value} м,
									должна быть в пределах от ${AverageSource.SectionChannelWidth.min} до ${AverageSource.SectionChannelWidth.max} м.`} />
							: null}

						<InputTemplate title={`Скорость течения в лотке, м/с, диапазон[${AverageSource.minWaterSpeedInTray} - n]`}
							range={{ minValue: AverageSource.minWaterSpeedInTray, maxValue: Infinity }}
							placeholder={'Введите скорость течения в лотке...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.waterSpeedInTrayRef = input; }}
							onInput={(value) => { this.setState({ waterSpeedInTray: value }); }} />

						<InputTemplate title={`Глубина воды в распределительном лотке, м`}
							range={{ minValue: 0, maxValue: Infinity }}
							placeholder={'Введите глубина воды в распределительном лотке...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.waterDeepInDistributeTrayRef = input; }}
							onInput={(value) => { this.setState({ waterDeepInDistributeTray: value }); }} />
					</>
					: null}

				{averageMechanism === AverageSource.AverageMechanismType.multichannel_length
					? <>
						<InputTemplate title={`Количество каналов в одной секции усреднителя, шт, диапазон[${AverageSource.minAmountOfSectionChannel} - n]`}
							range={{ minValue: AverageSource.minAmountOfSectionChannel, maxValue: Infinity }}
							placeholder={'Введите количество каналов...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.amountOfSectionChannelRef = input; }}
							onInput={(value) => { this.setState({ amountOfSectionChannel: value }); }} />

						{(this.channelWidthPrizma < AverageSource.ChannelWidth.min || this.channelWidthPrizma > AverageSource.ChannelWidth.max) ||
							(this.channelWidthCircle < AverageSource.ChannelWidth.min || this.channelWidthCircle > AverageSource.ChannelWidth.max)
							? <ErrorAlert errorMessage={`Ширина канала: ${this.channelWidthPrizma} м - прямоугольный усреднитель и
									${this.channelWidthCircle} м - круговой усреднитель,
									должна быть в пределах от ${AverageSource.ChannelWidth.min} до ${AverageSource.ChannelWidth.max} м.`} />
							: null}
					</>
					: null}

				{this.renderCheckingButton()}
			</>
		);
	}

	private isInputReadyToCounting = (): boolean => {
		const {
			maxConcentrate, finalConcentrate, middleConcentrate, averageMechanism,
			deviceWorkingPeriod, averageDeep, amountOfSection, sectionWidth,
			bubbleDeep, distanceBetweenWallBubble, distanceBetweenIntervalBubble,
			amountOfIntervalBubble, amountOfSectionChannel, waterSpeedInTray, waterDeepInDistributeTray,
			bubbleType, formOfAverage,
		} = this.state;
		const commonInputs = maxConcentrate && finalConcentrate && middleConcentrate && averageMechanism
			&& deviceWorkingPeriod && averageDeep && amountOfSection && sectionWidth ? true : false;
		const onlyBubble = bubbleDeep && distanceBetweenWallBubble && amountOfIntervalBubble &&
			(amountOfIntervalBubble > 1 ? distanceBetweenIntervalBubble : true) && bubbleType ? true : false;
		const onlyChannelWidth = amountOfSectionChannel && waterSpeedInTray && waterDeepInDistributeTray ? true : false;
		const onlyChannelLength = amountOfSectionChannel && formOfAverage ? true : false;
		return (commonInputs && onlyBubble) || (commonInputs && onlyChannelLength) || (commonInputs && onlyChannelWidth);
	}

	private countingAverageCoefficient = (middleConcentrate: number) => {
		const { maxConcentrate, finalConcentrate } = this.state;
		// Common formula 1: Kav = (Cmax - Cmid) / (Cadm - Cmid);
		this.averageCoefficient = (maxConcentrate - middleConcentrate) / (finalConcentrate - middleConcentrate);
	}

	private widthOfEachChannelCheck = (): { index: number; value: number } => {
		for (let i = 1; i < this.widthOfEachChannel.length + 1; i++) {
			if (this.widthOfEachChannel[i] < AverageSource.SectionChannelWidth.min ||
				this.widthOfEachChannel[i] > AverageSource.SectionChannelWidth.max) {
				return { index: i, value: this.widthOfEachChannel[i] };
			}
		}
	}

	private resultCounting = () => {
		const { secondMaxFlow, type } = this.props;
		const {
			averageMechanism, deviceWorkingPeriod, sectionWidth,
			amountOfSection, averageDeep, amountOfIntervalBubble,
			amountOfSectionChannel, waterSpeedInTray, waterDeepInDistributeTray,
			bubbleType,
		} = this.state;

		if (type === AverageTypes.volleyDischarge) {
			if (averageMechanism === AverageSource.AverageMechanismType.bubbling) {
				if (this.averageCoefficient < AverageSource.averageCoefficientBorder) {
					// formula 2 Wz = (1,3 * qw * tz) / ln(Kav / (Kav - 1))
					this.averageVolume = (1.3 * secondMaxFlow * 3600 * deviceWorkingPeriod) /
						Math.log(this.averageCoefficient / (this.averageCoefficient - 1));
				} else if (this.averageCoefficient > AverageSource.averageCoefficientBorder) {
					// formula 3 Wz = 1,3 * qw * tz * Kav
					this.averageVolume = Math.round(1.3 * secondMaxFlow * 3600 * deviceWorkingPeriod * this.averageCoefficient);
				}
			}
			if (averageMechanism === AverageSource.AverageMechanismType.multichannel_width ||
				averageMechanism === AverageSource.AverageMechanismType.multichannel_length) {
				// formula 4 Wz = 0.5 * qw * tz * Kav
				this.averageVolume = Math.round(0.5 * secondMaxFlow * 3600 * deviceWorkingPeriod * this.averageCoefficient);
			}
		}

		if (type === AverageTypes.cycleFluctuation) {
			if (this.averageCoefficient < AverageSource.averageCoefficientBorder) {
				// formula 5 Wcir = 0.21 * qw * tcir * sqrt(Kav^2 - 1)
				this.averageVolume = Math.round(0.21 * secondMaxFlow * 3600 * deviceWorkingPeriod *
					Math.sqrt(Math.pow(this.averageCoefficient, 2) - 1));
			} else if (this.averageCoefficient > AverageSource.averageCoefficientBorder) {
				// formula 6 Wcir = 1.3 * qw * tcir * Kav
				this.averageVolume = Math.round(1.3 * secondMaxFlow * 3600 * deviceWorkingPeriod * this.averageCoefficient);
			}
		}

		// formula 7 F = W / (n * H);
		this.sectionSquare = Math.round(this.averageVolume / (amountOfSection * averageDeep));
		// formula 8 L = F / B;
		this.averageLength = Math.round(this.sectionSquare / sectionWidth);

		if (averageMechanism === AverageSource.AverageMechanismType.bubbling) {
			// formula 9 v = qmax / (3600 * B * H * n)
			this.speedOfWaterFlow = secondMaxFlow / (3600 * sectionWidth * averageDeep * amountOfSection);
			// formula 10 = Qair = (2 * qair + n'air * q'air) * n * L
			const intensiveWallBubble = bubbleType;
			const intensiveIntervalBubble = bubbleType === AverageSource.BubbleType.averageConcentrate
				? AverageSource.BubbleType.averageConcentrateDerivative
				: AverageSource.BubbleType.stopDropSedimentDerivative;
			this.commonAirFlow = (2 * intensiveWallBubble + amountOfIntervalBubble * intensiveIntervalBubble) *
				(amountOfSection * this.averageLength);
		} else if (averageMechanism === AverageSource.AverageMechanismType.multichannel_width) {
			// formula 11 bi = ((3 * (i-0.5) / (ncan * (ncan - 1)))) * (((2*ncan - 1) / ncan) - (2 * i) / (ncan + 1)) * B;
			this.widthOfEachChannel = [];
			for (let i = 1; i < amountOfSectionChannel + 1; i++) {
				const width = ((3 * (i - 0.5)) / (amountOfSectionChannel * (amountOfSectionChannel - 1)) *
					((2 * amountOfSectionChannel - 1) / amountOfSectionChannel - (2 * i) / (amountOfSectionChannel + 1))) * sectionWidth;
				this.widthOfEachChannel.push(width);
			}
			// formula 12 qi = ((2 * ncan - 1) / (ncan * (ncan - 1))) - (((2 * i / (ncan^2 - 1)) * (qmax / n);
			this.waterFlowOfEachChannel = [];
			for (let i = 1; i < amountOfSectionChannel + 1; i++) {
				const waterFlow = (((2 * amountOfSectionChannel - 1) / (amountOfSectionChannel * (amountOfSectionChannel - 1))) -
					((2 * i) / (Math.pow(amountOfSectionChannel, 2) - 1))) * (secondMaxFlow * 3600 / amountOfSection);
				this.waterFlowOfEachChannel.push(waterFlow);
			}
			// formula 13 omega = qmax / 3600 * n * v
			this.crossSectionalArea = secondMaxFlow / (amountOfSection * waterSpeedInTray);
			// formula 13 omegai = (qi * mu) / (0,36 * sqrt(2 * g * h0))
			this.squareBottomForEachChannel = [];
			this.squareSideForEachChannel = [];
			for (let i = 1; i < amountOfSectionChannel + 1; i++) {
				const bottomSquare = (this.waterFlowOfEachChannel[i - 1] * AverageSource.CoefficientHoleFlow.bottom) /
					(0.36 * Math.sqrt(2 * AverageSource.gravityAcceleration * waterDeepInDistributeTray));
				const sideSquare = (this.waterFlowOfEachChannel[i - 1] * AverageSource.CoefficientHoleFlow.side) /
					(0.36 * Math.sqrt(2 * AverageSource.gravityAcceleration * waterDeepInDistributeTray));
				this.squareBottomForEachChannel.push(bottomSquare);
				this.squareSideForEachChannel.push(sideSquare);
			}
		} else if (averageMechanism === AverageSource.AverageMechanismType.multichannel_length) {
			// formula 14 W1 = W / n
			this.volumeOfOneSection = this.averageVolume / amountOfSection;
			// formula 15 D = sqrt(4 * F / pi);  For circle form
			this.averageDiameter = Math.sqrt((4 * this.sectionSquare) / Math.PI);
			// formula 15 bcan = B / ncan - for prizma; bcan = 0.5 * D / ncan - for circle
			this.channelWidthPrizma = sectionWidth / amountOfSectionChannel;
			this.channelWidthCircle = (0.5 * this.averageDiameter) / amountOfSectionChannel;
		}

		this.setAverageResult();

		this.setState({ isResult: true });
	}

	private setAverageResult = () => {
		const {type} = this.props;
		const {
			averageMechanism, distanceBetweenWallBubble, distanceBetweenIntervalBubble, formOfAverage
		} = this.state;
		this.averageResult = {
			complete: true,
			deviceType: type,
			averageMechanismType: averageMechanism,
			averageCoefficient: {
				value: this.averageCoefficient ? Number(this.averageCoefficient.toFixed(3)) : undefined,
				label: 'Требуемый коэффициент усреднения, %'
			},
			averageVolume: {value: this.averageVolume, label: 'Объем усреднителя, м3'},
			sectionSquare: {value: this.sectionSquare, label: 'Площадь каждой секции усреднителя, м2'},
			bubbling: {
				averageLength: {value: this.averageLength, label: 'Длина усреднителя, м'},
				commonAirFlow: {
					value: this.commonAirFlow ? Number(this.commonAirFlow.toFixed(3)) : undefined,
					label: 'Общий расход воздуха для барботирования, м3/ч'
				},
				distanceBetweenIntervalBubble: {
					value: distanceBetweenIntervalBubble ? Number(distanceBetweenIntervalBubble.toFixed(3)) : undefined,
					label: 'Расстояние между барботерами для промежуточных барботеров, м'
				},
				distanceBetweenWallBubble: {
					value: distanceBetweenWallBubble ? Number(distanceBetweenWallBubble.toFixed(3)) : undefined,
					label: 'Расстояние между барботерами для пристенных барботеров, м'
				},
			},
			multichannelLength: {
				formOfAverage: formOfAverage,
				averageLength: {
					value: this.averageLength ? Number(this.averageLength.toFixed(3)) : undefined,
					label: 'Длина усреднителя для прямоугольного плана, м'
				},
				averageDiameter: {
					value: this.averageDiameter ? Number(this.averageDiameter.toFixed(3)) : undefined,
					label: 'Диаметр усреднителя для кругового плана, м'
				},
				channelWidthCircle: {
					value: this.channelWidthCircle ? Number(this.channelWidthCircle.toFixed(3)) : undefined,
					label: 'Ширина канала для кругового усреднителя, м'
				},
				channelWidthPrizma: {
					value: this.channelWidthPrizma ? Number(this.channelWidthPrizma.toFixed(3)) : undefined,
					label: 'Ширина канала для прямоугольного усреднителя, м'
				},
			},
			multichannelWidth: {
				averageLength: {value: this.averageLength, label: 'Длина усреднителя, м'},
				crossSectionalArea: {
					value: this.crossSectionalArea ? Number(this.crossSectionalArea.toFixed(3)) : undefined,
					label: 'Площадь поперечного сечения распределительного лотка, м2'
				},
				widthOfEachChannel: {value: listOfArrayValues(this.widthOfEachChannel, 3), label: 'Ширина каждого канала секции, м'},
				waterFlowOfEachChannel: {value: listOfArrayValues(this.waterFlowOfEachChannel, 3), label: 'Расход воды в каждом канале, м3/ч'},
				squareBottomForEachChannel: {value: listOfArrayValues(this.squareBottomForEachChannel, 3), label: 'Площадь донного отверстия в распределительном лотке, м2'},
				squareSideForEachChannel: {value: listOfArrayValues(this.squareSideForEachChannel, 3), label: 'Площадь бокового отверстия в распределительном лотке, м2'},
			},
		};
		dataModel.setAverageResult(this.averageResult);
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return renderAverageResult(this.averageResult, {isGeneralResult: false, title: undefined});
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
					{type === AverageTypes.volleyDischarge ?
						<div className={'count-title'}>Залповый сброс</div> :
						<div className={'count-title'}>Циклические колебания</div>}
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

function listOfArrayValues(array: number[], fixedValue: number): string {
	return array.map(value => value.toFixed(fixedValue)).join(', ');
}

export function renderAverageResult(
	averageResult: AverageResultData,
	generalResultConfig: {
		isGeneralResult: boolean;
		title: string;
	},
) {
	if (!averageResult) {
		return null;
	}
	const bubling = averageResult.bubbling;
	const width = averageResult.multichannelWidth;
	const length = averageResult.multichannelLength;
	const deviceType = averageResult.deviceType === AverageTypes.volleyDischarge
		? 'Залповый сброс' : 'Циклические колебания';
	const mechanism = averageResult.averageMechanismType === AverageSource.AverageMechanismType.bubbling
		? 'Барботажный тип'
		: averageResult.averageMechanismType === AverageSource.AverageMechanismType.multichannel_length
		? 'Многоканальный усреднитель с каналами разной длины'
		: 'Многоканальный усреднитель с каналами разной ширины';
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
						<TableRow value={mechanism} label={'Тип механизма'} />
						</>
						: null}
					<TableRow value={averageResult.averageCoefficient.value} label={averageResult.averageCoefficient.label} />
					<TableRow value={averageResult.averageVolume.value} label={averageResult.averageVolume.label} />
					<TableRow value={averageResult.sectionSquare.value} label={averageResult.sectionSquare.label} />
					{averageResult.averageMechanismType === AverageSource.AverageMechanismType.bubbling
						? <>
							<TableRow value={bubling.averageLength.value} label={bubling.averageLength.label} />
							<TableRow value={bubling.commonAirFlow.value} label={bubling.commonAirFlow.label} />
							<TableRow value={bubling.distanceBetweenIntervalBubble.value} label={bubling.distanceBetweenIntervalBubble.label} />
							<TableRow value={bubling.distanceBetweenWallBubble.value} label={bubling.distanceBetweenWallBubble.label} />
						</>
						: null}
					{averageResult.averageMechanismType === AverageSource.AverageMechanismType.multichannel_length
						? <>
							{length.formOfAverage === AverageSource.FormOfAverage.prizma
								? <>
									<TableRow value={length.averageLength.value} label={length.averageLength.label} />
									<TableRow value={length.channelWidthPrizma.value} label={length.channelWidthPrizma.label} />
								</>
								: <>
									<TableRow value={length.averageDiameter.value} label={length.averageDiameter.label} />
									<TableRow value={length.channelWidthCircle.value} label={length.channelWidthCircle.label} />
								</>}
						</>
						: null}
					{averageResult.averageMechanismType === AverageSource.AverageMechanismType.multichannel_width
						? <>
							<TableRow value={width.averageLength.value} label={width.averageLength.label} />
							<TableRow value={width.crossSectionalArea.value} label={width.crossSectionalArea.label} />
							<TableRow value={width.squareBottomForEachChannel.value} label={width.squareBottomForEachChannel.label} />
							<TableRow value={width.squareSideForEachChannel.value} label={width.squareSideForEachChannel.label} />
							<TableRow value={width.waterFlowOfEachChannel.value} label={width.waterFlowOfEachChannel.label} />
							<TableRow value={width.widthOfEachChannel.value} label={width.widthOfEachChannel.label} />
						</>
						: null}
				</tbody>
			</Table>
		</div>
	);
}
