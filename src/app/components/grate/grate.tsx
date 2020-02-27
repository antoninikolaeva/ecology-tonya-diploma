import * as React from 'react';
import { Button, Table } from 'react-bootstrap';

import { GRATE_CONST as _, getUniqueWidthSection, getUniqueRodThickness, transferRadiansToDegrees } from './grate.service';
import { SourceOfWasteWater, HammerCrusher, hammerCrushers, FormOfRods, grates, Grate, TypeOfGrates, grateCrushers, GrateCrusher } from './grate-resources';
import { labelTemplate, InputTemplate, ItemList, SelectTemplate, NULLSTR, resetSelectToDefault } from '../utils';
import { GrateTypes } from '../general-resources';
import { ErrorAlert } from '../error/error';
import { GeneralDataModel, dataModel } from '../data-model';

interface GrateComponentProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: GrateTypes;
	onCountMode(countMode: boolean): void;
}

interface GrateComponentState {
	sourceOfWasteWater: SourceOfWasteWater;
	inputAmountOfWaste: number;
	amountOfWaste: number;
	amountOfHammerCrushers: number;
	currentHammerCrusher: HammerCrusher;
	speedOfWaterInChannel: number;
	speedOfWaterInSection: number;
	formOfRod: number;
	inclineAngle: number;
	flowRestrictionRake: number;
	listOfRodThickness: number[];
	currentRodThickness: number;
	amountOfSuitableGrates: number;
	currentTypeOfGrates: TypeOfGrates;
	currentStandardWidthOfChannel: number;
	valueOfLedgeInstallationPlace: number;
	sizeOfInputChannelPart: number;
	sizeOfOutputChannelPart: number;
	lengthOfIncreaseChannelPart: number;
	commonLengthOfChamberGrate: number;
	currentGrateCrusher: GrateCrusher;
	amountGrateOfCrushers: number;
	checkGrateCrusherSpeed: number;
	isValidateError: boolean;
	checkSpeedOfWater: number;
	currentWidthSection: number;
	suitableGrates: Grate[];
	limitedStandardWidthOfChannel: number[];
	currentSuitableGrate: Grate;
}

export class GrateComponent extends React.Component<GrateComponentProps, GrateComponentState> {
	private dailyWasteGeneratedRef: HTMLInputElement = undefined;
	private normOfWaterOutRef: HTMLInputElement = undefined;
	private speedOfWaterInChannelRef: HTMLInputElement = undefined;
	private speedOfWaterInSectionRef: HTMLInputElement = undefined;
	private inclineAngleRef: HTMLInputElement = undefined;
	private flowRestrictionRakeRef: HTMLInputElement = undefined;
	private sourceOfWasteWaterRef: HTMLOptionElement[] = [];
	private selectSourceWaterList: ItemList[] = [
		{ value: undefined, label: 'Выберите источник сточных вод' },
		{ value: SourceOfWasteWater.manufacture, label: 'Производсвенный сток' },
		{ value: SourceOfWasteWater.city, label: 'Городской сток' },
	];
	private hammerCrushersRef: HTMLOptionElement[] = [];
	private selectHammerCrusherList: ItemList[] = hammerCrushers.map(crusher => {
		return { value: crusher.performance, label: crusher.mark };
	});
	private formOfRodsRef: HTMLOptionElement[] = [];
	private formOfRodList: ItemList[] = [
		{ value: undefined, label: 'Выберите форму стержня' },
		{ value: FormOfRods.prizma, label: 'Прямоугольная форма' },
		{ value: FormOfRods.prizmaWithCircleEdge, label: 'Прямоугольная форма с закругленной лобовой частью' },
		{ value: FormOfRods.circle, label: 'Круглая форма' },
	];
	private widthSectionsRef: HTMLOptionElement[] = [];
	private widthSectionList: ItemList[] = [];
	private rodThicknessesRef: HTMLOptionElement[] = [];
	private rodThicknessList: ItemList[] = [];
	private grateCrushersRef: HTMLOptionElement[] = [];
	private grateCrusherList: ItemList[] = grateCrushers.map(crusher => {
		return { value: crusher.mark, label: crusher.mark };
	});
	private suitableGratesRef: HTMLOptionElement[] = [];
	private suitableGrateList: ItemList[] = [];
	private limitedStandardChannelsWidthRef: HTMLOptionElement[] = [];
	private limitedStandardChannelWidthList: ItemList[] = [];
	private typeOfGratesRef: HTMLOptionElement[] = [];
	private typeOfGrateList: ItemList[] = [
		{ value: undefined, label: 'Выберите тип решетки' },
		{ value: TypeOfGrates.vertical, label: 'Вертикальные решетки' },
		{ value: TypeOfGrates.incline, label: 'Наклонные решетки' },
	];

	constructor(props: GrateComponentProps) {
		super(props);
		this.selectHammerCrusherList.unshift({ value: undefined, label: 'Выберите молотковую дробилку' });
		this.widthSectionList = getUniqueWidthSection().map(section => {
			return { value: section, label: `${section}` };
		});
		this.widthSectionList.unshift({ value: undefined, label: 'Выберите ширину прозоров решетки' });
		this.grateCrusherList.unshift({ value: undefined, label: 'Выберите тип решетки дробилки' });
		this.state = {
			sourceOfWasteWater: undefined,
			inputAmountOfWaste: undefined,
			amountOfWaste: undefined,
			amountOfHammerCrushers: undefined,
			currentHammerCrusher: undefined,
			speedOfWaterInChannel: undefined,
			speedOfWaterInSection: undefined,
			formOfRod: undefined,
			inclineAngle: undefined,
			flowRestrictionRake: undefined,
			listOfRodThickness: undefined,
			currentRodThickness: undefined,
			amountOfSuitableGrates: undefined,
			currentTypeOfGrates: undefined,
			valueOfLedgeInstallationPlace: undefined,
			sizeOfInputChannelPart: undefined,
			sizeOfOutputChannelPart: undefined,
			lengthOfIncreaseChannelPart: undefined,
			commonLengthOfChamberGrate: undefined,
			currentStandardWidthOfChannel: undefined,
			currentGrateCrusher: undefined,
			amountGrateOfCrushers: undefined,
			checkGrateCrusherSpeed: undefined,
			isValidateError: false,
			checkSpeedOfWater: undefined,
			currentWidthSection: undefined,
			suitableGrates: undefined,
			limitedStandardWidthOfChannel: undefined,
			currentSuitableGrate: undefined,
		};
	}

	private clearPage = () => {
		if (this.dailyWasteGeneratedRef) { this.dailyWasteGeneratedRef.value = NULLSTR; }
		if (this.normOfWaterOutRef) { this.normOfWaterOutRef.value = NULLSTR; }
		if (this.speedOfWaterInChannelRef) { this.speedOfWaterInChannelRef.value = NULLSTR; }
		if (this.speedOfWaterInSectionRef) { this.speedOfWaterInSectionRef.value = NULLSTR; }
		if (this.inclineAngleRef) { this.inclineAngleRef.value = NULLSTR; }
		if (this.flowRestrictionRakeRef) { this.flowRestrictionRakeRef.value = NULLSTR; }
		resetSelectToDefault(this.sourceOfWasteWaterRef, this.selectSourceWaterList);
		resetSelectToDefault(this.hammerCrushersRef, this.selectHammerCrusherList);
		resetSelectToDefault(this.formOfRodsRef, this.formOfRodList);
		resetSelectToDefault(this.widthSectionsRef, this.widthSectionList);
		resetSelectToDefault(this.rodThicknessesRef, this.rodThicknessList);
		resetSelectToDefault(this.grateCrushersRef, this.grateCrusherList);
		resetSelectToDefault(this.suitableGratesRef, this.suitableGrateList);
		resetSelectToDefault(this.limitedStandardChannelsWidthRef, this.limitedStandardChannelWidthList);
		resetSelectToDefault(this.typeOfGratesRef, this.typeOfGrateList);
		this.setState({
			sourceOfWasteWater: undefined,
			inputAmountOfWaste: undefined,
			amountOfWaste: undefined,
			amountOfHammerCrushers: undefined,
			speedOfWaterInChannel: undefined,
			speedOfWaterInSection: undefined,
			formOfRod: undefined,
			inclineAngle: undefined,
			flowRestrictionRake: undefined,
			listOfRodThickness: undefined,
			currentRodThickness: undefined,
			amountOfSuitableGrates: undefined,
			currentTypeOfGrates: undefined,
			valueOfLedgeInstallationPlace: undefined,
			sizeOfInputChannelPart: undefined,
			sizeOfOutputChannelPart: undefined,
			lengthOfIncreaseChannelPart: undefined,
			commonLengthOfChamberGrate: undefined,
			currentStandardWidthOfChannel: undefined,
			currentGrateCrusher: undefined,
			amountGrateOfCrushers: undefined,
			checkGrateCrusherSpeed: undefined,
			isValidateError: false,
			checkSpeedOfWater: undefined,
			currentWidthSection: undefined,
			suitableGrates: undefined,
			limitedStandardWidthOfChannel: undefined,
			currentSuitableGrate: undefined,
		});
	}

	// Динамический расчет количества загрязнений и количества молотковых дробилок
	private amountOfWasteGenerated = (value: number) => {
		const { dailyWaterFlow } = this.props;
		const { sourceOfWasteWater, currentHammerCrusher } = this.state;
		if (!currentHammerCrusher) {
			return;
		}
		// value - переменная используемая как для производства так и для городских стоков
		// определяет либо количество отбросов, либо норму водоотведения
		let amountOfWaste;
		if (sourceOfWasteWater === SourceOfWasteWater.manufacture) {
			amountOfWaste = _.WOTB_MANUFACTURE * value * _.K /
				_.HOURS_IN_DAY;
		} else {
			const amountOfDwellers = _.TRANSFORM_LITER_TO_VOLUME_METER * dailyWaterFlow / value;
			amountOfWaste = _.QOTB * amountOfDwellers / _.WOTB_CITY;
		}
		const amountOfHammerCrushers = (amountOfWaste / currentHammerCrusher.performance) > 1 ?
			Math.ceil(amountOfWaste / currentHammerCrusher.performance) :
			1;
		sourceOfWasteWater === SourceOfWasteWater.manufacture ?
			this.setState({ inputAmountOfWaste: value, amountOfWaste, amountOfHammerCrushers }) :
			this.setState({ inputAmountOfWaste: value, amountOfWaste, amountOfHammerCrushers });
	}

	// Основной расчет по нажатию на кнопку Подобрать марку решетки,
	// производит расчет и делает выбор всех удовлетворяемых решеток.
	// Возможны ситуации когда для заданных параметров нет удовлетворительных
	// решеток, тогда нужно менять какие-либо параметры.
	private grateCounting = () => {
		const { secondMaxFlow, type } = this.props;
		const {
			flowRestrictionRake,
			speedOfWaterInChannel,
			speedOfWaterInSection,
			currentRodThickness,
			isValidateError,
			currentWidthSection
		} = this.state;
		if (!this.isDataExisted() || isValidateError) { return; }
		resetSelectToDefault(this.suitableGratesRef, this.suitableGrateList);
		resetSelectToDefault(this.limitedStandardChannelsWidthRef, this.limitedStandardChannelWidthList);
		resetSelectToDefault(this.typeOfGratesRef, this.typeOfGrateList);
		let amountOfSection;
		if (type === GrateTypes.mechanic) {
			amountOfSection = (flowRestrictionRake * secondMaxFlow) /
				(Math.sqrt(secondMaxFlow / speedOfWaterInChannel) *
					speedOfWaterInSection * currentWidthSection);
		} else if (type === GrateTypes.hand) {
			amountOfSection = (_.FLOW_RESTRICTION_RAKE * secondMaxFlow) /
				(Math.sqrt(secondMaxFlow / speedOfWaterInChannel) *
					speedOfWaterInSection * currentWidthSection);
		}
		const commonWidthOfGrate = currentRodThickness * (amountOfSection - 1) + currentWidthSection * amountOfSection;
		let amountOfSuitableGrates = 1;
		let suitableGrates: Grate[] = [];
		while (amountOfSuitableGrates > 0) {
			suitableGrates = grates.filter(grate => {
				const isSuitableGrate = commonWidthOfGrate <= (amountOfSuitableGrates * grate.size.width) &&
					grate.widthSection === currentWidthSection && grate.rodThickness === currentRodThickness;
				return isSuitableGrate;
			});
			if (suitableGrates.length > 0) {
				break;
			} else {
				amountOfSuitableGrates++;
			}
		}
		const checkedSuitableGrates = suitableGrates.filter(grate => this.checkWaterSpeedCounting(grate, amountOfSuitableGrates));
		if (checkedSuitableGrates.length === 0) {
			this.setState({
				amountOfSuitableGrates, suitableGrates: checkedSuitableGrates,
				currentSuitableGrate: undefined, currentStandardWidthOfChannel: undefined,
				currentTypeOfGrates: undefined, valueOfLedgeInstallationPlace: undefined
			});
			return;
		}
		this.setState({
			amountOfSuitableGrates, suitableGrates: checkedSuitableGrates,
			currentSuitableGrate: undefined, currentStandardWidthOfChannel: undefined,
			currentTypeOfGrates: undefined, valueOfLedgeInstallationPlace: undefined
		});
	}

	// Проверка решеток на удовлетворяемость всем заданным требованиям
	private checkWaterSpeedCounting = (currentSuitableGrate: Grate, amountOfSuitableGratesAfterCount?: number): boolean => {
		const { secondMaxFlow, type } = this.props;
		const { amountOfSuitableGrates, flowRestrictionRake, speedOfWaterInChannel, currentWidthSection } = this.state;
		const amountOfSuitableGratesReal = amountOfSuitableGratesAfterCount ? amountOfSuitableGratesAfterCount : amountOfSuitableGrates;
		let checkSpeedOfWater;
		if (type === GrateTypes.mechanic) {
			checkSpeedOfWater = (flowRestrictionRake * secondMaxFlow) /
				(Math.sqrt(secondMaxFlow / speedOfWaterInChannel) *
					currentSuitableGrate.numberOfSection * currentWidthSection *
					amountOfSuitableGratesReal);
		} else if (type === GrateTypes.hand) {
			checkSpeedOfWater = (_.FLOW_RESTRICTION_RAKE * secondMaxFlow) /
				(Math.sqrt(secondMaxFlow / speedOfWaterInChannel) *
					currentSuitableGrate.numberOfSection * currentWidthSection *
					amountOfSuitableGratesReal);
		}
		this.setState({ checkSpeedOfWater });
		if (_.MIN_CHECK_SPEED_WATER <= checkSpeedOfWater && _.MAX_CHECK_SPEED_WATER >= checkSpeedOfWater) {
			return true;
		} else {
			return false;
		}
	}

	// Расчет величины уступа в месте установки решетки
	private countingLedgeInstallationPlace = () => {
		const { currentRodThickness, formOfRod, inclineAngle, checkSpeedOfWater, currentWidthSection } = this.state;
		const dzeta = formOfRod * Math.sin(transferRadiansToDegrees(inclineAngle)) *
			Math.pow(currentRodThickness / currentWidthSection, (4 / 3));
		const valueOfLedgeInstallationPlace = dzeta * Math.pow(checkSpeedOfWater, 2) / (2 * _.G) * _.P;
		this.setState({ valueOfLedgeInstallationPlace });
	}

	// Расчет все длин
	private countingLengths = () => {
		const { secondMaxFlow } = this.props;
		const { speedOfWaterInChannel, inclineAngle, currentStandardWidthOfChannel, currentTypeOfGrates, currentSuitableGrate } = this.state;
		const sizeOfInputChannelPart = (currentSuitableGrate.size.width - currentStandardWidthOfChannel) /
			(2 * Math.tan(transferRadiansToDegrees(_.PFI)));
		const sizeOfOutputChannelPart = 0.5 * sizeOfInputChannelPart;
		let lengthOfIncreaseChannelPart;
		if (currentTypeOfGrates === TypeOfGrates.vertical) {
			lengthOfIncreaseChannelPart = _.CHANNEL_PORT * currentStandardWidthOfChannel;
		} else {
			lengthOfIncreaseChannelPart = (_.CHANNEL_PORT * currentStandardWidthOfChannel) +
				Math.sqrt(secondMaxFlow / speedOfWaterInChannel) /
				Math.tan(transferRadiansToDegrees(inclineAngle));
		}
		this.setState({
			commonLengthOfChamberGrate:
				sizeOfInputChannelPart + sizeOfOutputChannelPart + lengthOfIncreaseChannelPart,
			sizeOfInputChannelPart,
			sizeOfOutputChannelPart,
			lengthOfIncreaseChannelPart
		});
	}

	private resultCounting = () => {
		this.countingLedgeInstallationPlace();
		this.countingLengths();
	}

	// Расчет решеток дробилок
	private countingGrateCrusher = (currentGrateCrusher: GrateCrusher) => {
		const { secondMaxFlow } = this.props;
		let amountGrateOfCrushers = 1;
		while (1) {
			if ((amountGrateOfCrushers * currentGrateCrusher.maxPerformance) > secondMaxFlow) {
				break;
			}
			amountGrateOfCrushers++;
		}
		const checkGrateCrusherSpeed = secondMaxFlow / (amountGrateOfCrushers * currentGrateCrusher.squareHeliumHole);
		this.setState({ checkGrateCrusherSpeed, amountGrateOfCrushers });
	}

	// Выбор источника сточных вод
	private selectSourceOfWasteWater = (value: string | number) => {
		if (this.dailyWasteGeneratedRef) { this.dailyWasteGeneratedRef.value = ''; }
		if (this.normOfWaterOutRef) { this.normOfWaterOutRef.value = ''; }
		this.setState({ sourceOfWasteWater: value as SourceOfWasteWater, amountOfWaste: 0, amountOfHammerCrushers: 0 });
	}

	// Выбор решеток дробилок из списка
	private selectHammerCrusher = (value: string | number) => {
		const { amountOfWaste } = this.state;
		if (typeof value === 'number') {
			const currentHammerCrusher = hammerCrushers.filter(crusher => crusher.performance === value);
			const amountOfHammerCrushers = (amountOfWaste / currentHammerCrusher[0].performance) > 1 ?
				Math.ceil(amountOfWaste / currentHammerCrusher[0].performance) :
				1;
			this.setState({ amountOfHammerCrushers, currentHammerCrusher: currentHammerCrusher[0] });
		}
	}

	// Выбор формы стержней решетки
	private selectFormOfRods = (value: string | number) => {
		if (typeof value === 'number') {
			this.setState({ formOfRod: value });
		}
	}

	// Выбор ширины прозоров
	private selectWidthSection = (value: string | number) => {
		if (typeof value === 'number') {
			const listOfRodThickness = getUniqueRodThickness(value);
			if (this.rodThicknessesRef) {
				resetSelectToDefault(this.rodThicknessesRef, this.rodThicknessList);
			}
			this.setState({ listOfRodThickness, currentRodThickness: undefined, currentWidthSection: value });
		}
	}

	// Выбор толщины стержней решетки
	private selectCurrentRodThickness = (value: string | number) => {
		if (typeof value === 'number') {
			this.setState({ currentRodThickness: value });
		}
	}

	// Выбор и перерасчет текущих удовлетворяемых решеток
	private selectFromSuitableGrate = (value: string | number) => {
		const { amountOfSuitableGrates, suitableGrates } = this.state;
		const currentSuitableGrate = suitableGrates.find((grate: Grate) => grate.mark === value);
		this.checkWaterSpeedCounting(currentSuitableGrate);
		const limitedStandardWidthOfChannel = _.STANDARD_WIDTH_OF_CHANNEL.filter(
			width => width < currentSuitableGrate.size.width * amountOfSuitableGrates);
		this.setState({ limitedStandardWidthOfChannel, currentSuitableGrate });
	}

	// Выбор стандартной ширины канала подводящего воду к решеткам
	private selectStandardWidthOfChannel = (value: string | number) => {
		if (typeof value === 'number') {
			this.setState({ currentStandardWidthOfChannel: value });
		}
	}

	// Выбор типа решетки
	private selectTypeOfGrate = (value: string | number) => {
		this.setState({ currentTypeOfGrates: value as TypeOfGrates });
	}

	// Выбор решеток дробилок из списка
	private selectGrateCrusher = (value: string | number) => {
		const currentGrateCrusher = grateCrushers.find(grateCrusher => grateCrusher.mark === value);
		this.countingGrateCrusher(currentGrateCrusher);
		this.setState({ currentGrateCrusher });
	}

	// Отрисовка выбора источника грязной воды
	private renderSourceOfWasteWater = () => {
		const { dailyWaterFlow } = this.props;
		const { sourceOfWasteWater } = this.state;
		return <div>
			{labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
			<SelectTemplate title={'Выбор молотковых дробилок'} itemList={this.selectHammerCrusherList}
				onSelect={(value) => this.selectHammerCrusher(value)}
				onSelectRef={(optionList) => { this.hammerCrushersRef = optionList; }} />
			<SelectTemplate title={'Источник сточных вод'} itemList={this.selectSourceWaterList}
				onSelect={(value) => this.selectSourceOfWasteWater(value)}
				onSelectRef={(optionList) => { this.sourceOfWasteWaterRef = optionList; }} />
			{sourceOfWasteWater === SourceOfWasteWater.city ?
				<InputTemplate title={'Норма водоотведения, л/(чел*сут)'}
					placeholder={''}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.normOfWaterOutRef = input; }}
					onInput={(value) => { this.amountOfWasteGenerated(value); }} /> :
				sourceOfWasteWater === SourceOfWasteWater.manufacture ?
					<InputTemplate title={'Количество образующихся отбросов, м3/сут'}
						placeholder={''}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.dailyWasteGeneratedRef = input; }}
						onInput={(value) => { this.amountOfWasteGenerated(value); }} /> :
					null}
		</div>;
	}

	private renderGrate = () => {
		const { type, secondMaxFlow } = this.props;
		const { listOfRodThickness, checkGrateCrusherSpeed, amountGrateOfCrushers, currentGrateCrusher } = this.state;
		if (listOfRodThickness && listOfRodThickness.length !== 0) {
			this.rodThicknessList = listOfRodThickness.map(thickness => {
				return { value: thickness, label: `${thickness}` };
			});
			this.rodThicknessList.unshift({ value: undefined, label: 'Выберите толщину стержня' });
		}
		return <div className={'device-input'}>
			<div className={'input-data-title'}>Входные данные</div>
			{labelTemplate('Секундный максимальный расход', secondMaxFlow)}
			{type === GrateTypes.mechanic || type === GrateTypes.hand ?
				<div>
					{this.renderSourceOfWasteWater()}
					<InputTemplate title={'Скрость течения воды в канале, м/с, диапазон [1.5 - 2]'}
						placeholder={'Введите значение Vk...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						range={{ minValue: _.SPEED_WATER_IN_CHANNEL_MIN, maxValue: _.SPEED_WATER_IN_CHANNEL_MAX }}
						onInputRef={(input) => { this.speedOfWaterInChannelRef = input; }}
						onInput={(value) => { this.setState({ speedOfWaterInChannel: value }); }} />
					<InputTemplate title={'Скорость движения воды в прозорах решетки, м/с, диапазон [0.8 - 1]'}
						placeholder={'Введите значение Vp...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						range={{ minValue: _.SPEED_WATER_IN_SECTION_MIN, maxValue: _.SPEED_WATER_IN_SECTION_MAX }}
						onInputRef={(input) => { this.speedOfWaterInSectionRef = input; }}
						onInput={(value) => { this.setState({ speedOfWaterInSection: value }); }} />
					<SelectTemplate title={'Выбор формы стержней'} itemList={this.formOfRodList}
						onSelect={(value) => this.selectFormOfRods(value)}
						onSelectRef={(optionList) => { this.formOfRodsRef = optionList; }} />
					<InputTemplate title={'Угол наклона решетки к горизонту, диапазон [60 - 70]'}
						placeholder={'Введите значение α...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						range={{ minValue: _.INCLINE_ANGLE_MIN, maxValue: _.INCLINE_ANGLE_MAX }}
						onInputRef={(input) => { this.inclineAngleRef = input; }}
						onInput={(value) => { this.setState({ inclineAngle: value }); }} />
					{type === GrateTypes.mechanic ?
						<InputTemplate title={'Коэффициент, учитывающий стеснение потока механическими граблями, диапазон [1.05 - 1.1]'}
							placeholder={'Введите значение Kst...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							range={{ minValue: _.FLOW_RESTRICTION_RAKE_MIN, maxValue: _.FLOW_RESTRICTION_RAKE_MAX }}
							onInputRef={(input) => { this.flowRestrictionRakeRef = input; }}
							onInput={(value) => { this.setState({ flowRestrictionRake: value }); }} /> :
						null}
					<SelectTemplate title={'Ширина прозоров решетки, м'} itemList={this.widthSectionList}
						onSelect={(value) => this.selectWidthSection(value)}
						onSelectRef={(optionList) => { this.widthSectionsRef = optionList; }} />
					{this.rodThicknessList && this.rodThicknessList.length !== 0 ?
						<SelectTemplate title={'Толщина стержней решетки, м'} itemList={this.rodThicknessList}
							onSelect={(value) => { this.selectCurrentRodThickness(value); }}
							onSelectRef={(optionList) => { this.rodThicknessesRef = optionList; }} /> : null}
					<div className={'ctrl-buttons-panel'}>
						{this.renderCountingButton()}
					</div>

				</div> :
				<div>
					<SelectTemplate title={'Выбор типа решетки дробилки'} itemList={this.grateCrusherList}
						onSelect={(value) => { this.selectGrateCrusher(value); }}
						onSelectRef={(optionList) => { this.grateCrushersRef = optionList; }} />
					{checkGrateCrusherSpeed ?
						<div>
							{labelTemplate('Количество решеток дробилок необходимых для очистки, шт', amountGrateOfCrushers)}
							{labelTemplate('Проверка дробилки, скорость должна входить в диапазон [1 - 1.2], м/с', checkGrateCrusherSpeed)}
							{!(checkGrateCrusherSpeed > currentGrateCrusher.speedOfMoveInSectionMin) ||
								!(checkGrateCrusherSpeed < currentGrateCrusher.speedOfMoveInSectionMax) ?
								<ErrorAlert errorMessage={'Проверка прошла неудачно - данный тип решетки-дробилки ' +
									'не подходит, либо скорость близка к нужному значению, ' +
									'но таковой не является.'} /> : null}
						</div> : null}
				</div>
			}
		</div>;
	}

	// Отрисовка вывода общих результатов первого и второго расчетов
	private renderResultCounting = () => {
		const {
			amountOfSuitableGrates,
			valueOfLedgeInstallationPlace,
			amountOfWaste,
			commonLengthOfChamberGrate,
			sizeOfInputChannelPart,
			sizeOfOutputChannelPart,
			lengthOfIncreaseChannelPart,
			amountOfHammerCrushers,
			checkSpeedOfWater,
			suitableGrates,
			limitedStandardWidthOfChannel,
			currentSuitableGrate,
		} = this.state;
		dataModel.setGrateResult({
			currentSuitableGrate,
			valueOfLedgeInstallationPlace,
			amountOfHammerCrushers,
			amountOfSuitableGrates,
			sizeOfInputChannelPart,
			sizeOfOutputChannelPart,
			lengthOfIncreaseChannelPart,
			commonLengthOfChamberGrate,
			amountOfWaste,
		});
		if (suitableGrates && suitableGrates.length !== 0) {
			this.suitableGrateList = suitableGrates.map(grate => {
				return { value: grate.mark, label: grate.mark };
			});
			this.suitableGrateList.unshift({ value: undefined, label: 'Выберите решетку' });
		}
		if (limitedStandardWidthOfChannel && limitedStandardWidthOfChannel.length !== 0) {
			this.limitedStandardChannelWidthList = limitedStandardWidthOfChannel.map(width => {
				return { value: width, label: `${width}` };
			});
			this.limitedStandardChannelWidthList.unshift({ value: undefined, label: 'Выберите ширину канала' });
		}
		return (
			<div className={'device-result'}>
				<div className={'input-data-title'}>Результаты расчета</div>
				{checkSpeedOfWater ?
					labelTemplate('Проверка решеток на соответствие:', `
                        ${_.MIN_CHECK_SPEED_WATER} <= ${checkSpeedOfWater.toFixed(3)} <= ${_.MAX_CHECK_SPEED_WATER} :
                        ${_.MIN_CHECK_SPEED_WATER <= checkSpeedOfWater && _.MAX_CHECK_SPEED_WATER >= checkSpeedOfWater ? 'Соответствует' : 'Не соответствует'}`) :
					null}
				{suitableGrates && suitableGrates.length !== 0 ?
					<div>
						<SelectTemplate title={'Выбор решетки'} itemList={this.suitableGrateList}
							onSelect={(value) => { this.selectFromSuitableGrate(value); }}
							onSelectRef={(optionList) => { this.suitableGratesRef = optionList; }} />
						{this.limitedStandardChannelWidthList && this.limitedStandardChannelWidthList.length !== 0 ?
							<SelectTemplate title={'Выбор стандартной ширины канала, м'} itemList={this.limitedStandardChannelWidthList}
								onSelect={(value) => { this.selectStandardWidthOfChannel(value); }}
								onSelectRef={(optionList) => { this.limitedStandardChannelsWidthRef = optionList; }} /> : null}
						<SelectTemplate title={'Выбор типа решетки'} itemList={this.typeOfGrateList}
							onSelect={(value) => { this.selectTypeOfGrate(value); }}
							onSelectRef={(optionList) => { this.typeOfGratesRef = optionList; }} />
						{this.renderCheckingButton()}
						{valueOfLedgeInstallationPlace ?
							<div className={'table-result'}>
								<Table bordered hover>
									<tbody>
										<tr><td>Величина уступа в месте установки решетки, м</td><td>{valueOfLedgeInstallationPlace.toFixed(3)}</td></tr>
										<tr><td className={'input-label left-title-column'}>Молотковые дробилки</td><td className={'right-title-column'}></td></tr>
										<tr>
											<td>Количество технической воды, подводимой к дробилками, м3/ч</td>
											<td>{(_.TECHNICAL_WATER * valueOfLedgeInstallationPlace).toFixed(3)}</td>
										</tr>
										<tr>
											<td>Количество молотковых дробилок необходимых для очистки, шт</td>
											<td>{amountOfHammerCrushers}</td>
										</tr>
										<tr><td className={'input-label left-title-column'}>Решетки</td><td className={'right-title-column'}></td></tr>
										<tr><td>Количество рабочих решеток, шт</td><td>{amountOfSuitableGrates}</td></tr>
										<tr>
											<td>Количество резервных решеток, шт</td>
											<td>{amountOfSuitableGrates > _.BASE_AMOUNT_OF_GRATES ? _.ADDITIONAL_AMOUNT_OF_GRATES : 1}</td>
										</tr>
										<tr><td className={'input-label left-title-column'}>Основные длины</td><td className={'right-title-column'}></td></tr>
										<tr><td>Длина входной части канала, м</td><td>{sizeOfInputChannelPart.toFixed(3)}</td></tr>
										<tr><td>Длина выходной части канала, м</td><td>{sizeOfOutputChannelPart.toFixed(3)}</td></tr>
										<tr><td>Длина расширенной части канала, м</td><td>{lengthOfIncreaseChannelPart.toFixed(3)}</td></tr>
										<tr><td>Общая длина камеры решетки, м</td><td>{commonLengthOfChamberGrate.toFixed(3)}</td></tr>
										<tr><td className={'input-label left-title-column'}>Отходы</td><td className={'right-title-column'}></td></tr>
										<tr><td>Количество отходов, кг/ч</td><td>{amountOfWaste}</td></tr>
									</tbody>
								</Table>
							</div> :
							null
						}
					</div> : null}
			</div>
		);
	}

	private returnToScheme = () => {
		this.props.onCountMode(false);
	}

	// Отрисовка кнопки расчета
	private renderCountingButton = () => {
		const { isValidateError } = this.state;
		const isNotReadyToCount = !this.isDataExisted() || isValidateError;
		return isNotReadyToCount ? <button className={'btn btn-primary'} disabled>
				Подобрать марку решеток
			</button> :
			<button className={'btn btn-primary'} onClick={() => this.grateCounting()}>
				Подобрать марку решеток
			</button>;
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
				onClick={() => {}}
				title={'Cводная схема очитныех сооружений'}>
				<i className={'fas fa-trophy'}></i>
			</button>
		</div>;
	}

	private isDataExisted = () => {
		const { type } = this.props;
		const { speedOfWaterInChannel,
			speedOfWaterInSection, inclineAngle, flowRestrictionRake,
			amountOfHammerCrushers, formOfRod, currentRodThickness,
			currentGrateCrusher, currentWidthSection
		} = this.state;
		if (GrateTypes.mechanic === type && (!speedOfWaterInChannel ||
			!speedOfWaterInSection || !inclineAngle || !currentWidthSection ||
			!amountOfHammerCrushers || !formOfRod || !currentRodThickness || !flowRestrictionRake)) {
			return false;
		} else if (GrateTypes.hand === type && (!speedOfWaterInChannel ||
			!speedOfWaterInSection || !inclineAngle || !currentWidthSection ||
			!amountOfHammerCrushers || !formOfRod || !currentRodThickness)) {
			return false;
		} else if (GrateTypes.crusher === type && !currentGrateCrusher) {
			return false;
		} else {
			return true;
		}
	}

	private isCheckResultDataExisted = () => {
		const { currentSuitableGrate, currentStandardWidthOfChannel, currentTypeOfGrates } = this.state;
		if (!currentSuitableGrate || !currentStandardWidthOfChannel || !currentTypeOfGrates) {
			return false;
		} else {
			return true;
		}
	}

	private renderGrateView = () => {
		const { type } = this.props;
		return (
			<div>
				<div className={'title-container'}>
					{type === GrateTypes.mechanic ?
						<div className={'count-title'}>Механическая очистка</div> :
						type === GrateTypes.hand ?
							<div className={'count-title'}>Ручная очистка</div> :
							<div className={'count-title'}>Очистка решетками дробилками</div>}
					{this.renderToolbar()}
				</div>
				<div className={'device-container'}>
					{this.renderGrate()}
					{type === GrateTypes.mechanic || type === GrateTypes.hand ?
						this.renderResultCounting() :
						null}
				</div>
			</div>
		);
	}

	render() {
		return this.renderGrateView();
	}
}
