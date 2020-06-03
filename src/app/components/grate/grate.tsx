import * as React from 'react';
import { GrateTypes, KindOfDevices } from '../general-resources';
import {
	InputTemplate,
	labelTemplate,
	SelectTemplate,
	ItemList,
	NULLSTR,
	resetSelectToDefault,
	TableRow
} from '../utils';
import { GrateSource } from './grate-resources';
import { Table, Modal, Button } from 'react-bootstrap';
import { ErrorAlert } from '../error/error';
import { dataModel, GrateResultData } from '../data-model';

export interface GrateProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: GrateTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

export interface GrateState {
	speedOfWaterInChannel: number;
	speedOfWaterInSection: number;
	widthSection: number;
	rodThickness: number;
	amountOfGrates: number;
	inclineAngle: number;
	formOfRod: number;
	middleValueBPK5: number;
	middleVolumeWasteWater: number;
	markOfGrate: string;
	markOfHammerCrusher: string;
	markOfGrateCrusher: string;
	isValidateError: boolean;
	isResult: boolean;
	showChangeScheme: boolean;
	showOpenResult: boolean;
}

export class GrateComponent extends React.Component<GrateProps, GrateState> {
	private speedOfWaterInChannelRef: HTMLInputElement = undefined;
	private speedOfWaterInSectionRef: HTMLInputElement = undefined;
	private widthSectionRef: HTMLInputElement = undefined;
	private rodThicknessRef: HTMLInputElement = undefined;
	private amountOfGratesRef: HTMLInputElement = undefined;
	private inclineAngleRef: HTMLInputElement = undefined;
	private middleValueBPK5Ref: HTMLInputElement = undefined;
	private middleVolumeWasteWaterRef: HTMLInputElement = undefined;
	private formOfRodListRef: HTMLOptionElement[] = [];
	private markOfGrateListRef: HTMLOptionElement[] = [];
	private grateCrusherListRef: HTMLOptionElement[] = [];
	private hammerCrusherListRef: HTMLOptionElement[] = [];

	private formOfRodList: ItemList[] = [
		{ value: undefined, label: 'Выберите форму стержней' },
		{ value: GrateSource.FormOfRods.prizma, label: 'Прямоугольная форма' },
		{ value: GrateSource.FormOfRods.prizmaWithCircleEdge, label: 'Прямоугольная форма с закругленной лобовой частью' },
		{ value: GrateSource.FormOfRods.circle, label: 'Круглая форма' },
	];
	private markOfGrateList: ItemList[] = GrateSource.grates.map(grate => {
		return {value: grate.mark, label: grate.mark};
	});
	private hammerCrusherList: ItemList[] = GrateSource.hammerCrushers.map(grate => {
		return {value: grate.mark, label: grate.mark};
	});
	private grateCrusherList: ItemList[] = GrateSource.grateCrushers.map(grate => {
		return {value: grate.mark, label: grate.mark};
	});

	private amountOfSection: number;
	private generalGrateWidth: number;
	private countingWidthOfGrate: number;
	private countingAmountOfSection: number;
	private realWaterSpeedInSection: number;
	private amountAdditionalGrates: number;
	private amountAdditionalHammerCrusher: number;
	private sizeOfInputChannel: number;
	private sizeOfOutputChannel: number;
	private lengthOfExtendPartOfChannel: number;
	private commonLengthOfCamera: number;
	private sizeOfLedge: number;
	private coefficientLocalPressure: number;
	private volumeOfWaste: number;
	private massOfWaste: number;
	private amountOfDwellers: number;
	private currentGrate: GrateSource.Grate;
	private currentHammerCrusher: GrateSource.HammerCrusher;
	private amountOfHammerCrusher: number;
	private amountOfGrate: number;
	private amountOfTechnicWaterFlow: number;
	private currentGrateCrusher: GrateSource.GrateCrusher;
	private amountOfGrateCrusher: number;

	private grateResult: GrateResultData;

	constructor(props: GrateProps) {
		super(props);

		this.markOfGrateList.unshift({value: undefined, label: 'Выберите марку решетки'});
		this.hammerCrusherList.unshift({value: undefined, label: 'Выберите марку молотковой дробилки'});
		this.grateCrusherList.unshift({value: undefined, label: 'Выберите марку решетки-дробилки'});

		this.state = {
			speedOfWaterInChannel: undefined,
			speedOfWaterInSection: undefined,
			widthSection: undefined,
			rodThickness: undefined,
			amountOfGrates: undefined,
			inclineAngle: undefined,
			formOfRod: undefined,
			middleValueBPK5: undefined,
			middleVolumeWasteWater: undefined,
			markOfGrate: NULLSTR,
			markOfHammerCrusher: NULLSTR,
			markOfGrateCrusher: NULLSTR,
			isValidateError: false,
			isResult: false,
			showChangeScheme: false,
			showOpenResult: false,
		};
	}

	private clearPage = () => {
		if (this.speedOfWaterInChannelRef) { this.speedOfWaterInChannelRef.value = NULLSTR; }
		if (this.speedOfWaterInSectionRef) { this.speedOfWaterInSectionRef.value = NULLSTR; }
		if (this.widthSectionRef) { this.widthSectionRef.value = NULLSTR; }
		if (this.rodThicknessRef) { this.rodThicknessRef.value = NULLSTR; }
		if (this.amountOfGratesRef) { this.amountOfGratesRef.value = NULLSTR; }
		if (this.inclineAngleRef) { this.inclineAngleRef.value = NULLSTR; }
		if (this.middleValueBPK5Ref) { this.middleValueBPK5Ref.value = NULLSTR; }
		if (this.middleVolumeWasteWaterRef) { this.middleVolumeWasteWaterRef.value = NULLSTR; }
		resetSelectToDefault(this.formOfRodListRef, this.formOfRodList);
		resetSelectToDefault(this.markOfGrateListRef, this.markOfGrateList);
		resetSelectToDefault(this.grateCrusherListRef, this.grateCrusherList);
		resetSelectToDefault(this.hammerCrusherListRef, this.hammerCrusherList);
		this.setState({
			speedOfWaterInChannel: undefined,
			speedOfWaterInSection: undefined,
			widthSection: undefined,
			rodThickness: undefined,
			amountOfGrates: undefined,
			inclineAngle: undefined,
			formOfRod: undefined,
			middleValueBPK5: undefined,
			middleVolumeWasteWater: undefined,
			markOfGrate: NULLSTR,
			markOfHammerCrusher: NULLSTR,
			markOfGrateCrusher: NULLSTR,
			isValidateError: false,
			isResult: false,
			showChangeScheme: false,
			showOpenResult: false,
		});
	}

	private renderInputArea = () => {
		const { type, dailyWaterFlow } = this.props;
		return <div>
			{type === GrateTypes.hand
			? <>
				<InputTemplate title={`Скорость течения воды в канале, м/с,
					диапазон [${GrateSource.SpeedOfWaterInChannel.min} - ${GrateSource.SpeedOfWaterInChannel.max}]`}
					placeholder={'Введите скорость течения воды...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: GrateSource.SpeedOfWaterInChannel.min, maxValue: GrateSource.SpeedOfWaterInChannel.max }}
					onInputRef={(input) => { this.speedOfWaterInChannelRef = input; }}
					onInput={(value) => { this.setState({ speedOfWaterInChannel: value }); }} />
				<InputTemplate title={`Скорость движения воды в прозорах решетки, м/с,
					диапазон [${GrateSource.SpeedOfWaterInSection.min} - ${GrateSource.SpeedOfWaterInSection.max}]`}
					placeholder={'Введите скорость движения воды...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: GrateSource.SpeedOfWaterInSection.min, maxValue: GrateSource.SpeedOfWaterInSection.max }}
					onInputRef={(input) => { this.speedOfWaterInSectionRef = input; }}
					onInput={(value) => { this.setState({ speedOfWaterInSection: value }); }} />
				<InputTemplate title={`Ширина прозоров решетки, м, диапазон [${GrateSource.WidthSection.min} - ${GrateSource.WidthSection.max}]`}
					placeholder={'Введите ширину прозоров...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: GrateSource.WidthSection.min, maxValue: GrateSource.WidthSection.max }}
					onInputRef={(input) => { this.widthSectionRef = input; }}
					onInput={(value) => { this.setState({ widthSection: value }); }} />
				<InputTemplate title={`Толщина стержней решетки, м, диапазон [${GrateSource.RodThickness.min} - ${GrateSource.RodThickness.max}]`}
					placeholder={'Введите толщину стержней...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: GrateSource.RodThickness.min, maxValue: GrateSource.RodThickness.max }}
					onInputRef={(input) => { this.rodThicknessRef = input; }}
					onInput={(value) => { this.setState({ rodThickness: value }); }} />
				<InputTemplate title={`Количество решеток, шт`}
					placeholder={'Введите количество решеток...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: 1, maxValue: Infinity }}
					onInputRef={(input) => { this.amountOfGratesRef = input; }}
					onInput={(value) => { this.setState({ amountOfGrates: value }); }} />
				<InputTemplate title={`Угол наклона решетки к горизонту, град,
					диапазон [${GrateSource.InclineAngle.min} - ${GrateSource.InclineAngle.max}]`}
					placeholder={'Введите угол наклона решетки...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: GrateSource.InclineAngle.min, maxValue: GrateSource.InclineAngle.max }}
					onInputRef={(input) => { this.inclineAngleRef = input; }}
					onInput={(value) => { this.setState({ inclineAngle: value }); }} />
				<SelectTemplate title={'Форма стержней'} itemList={this.formOfRodList}
					onSelect={(value) => {this.setState({formOfRod: value as number}); }}
					onSelectRef={(optionList) => { this.formOfRodListRef = optionList; }} />
				{this.realWaterSpeedInSection <= GrateSource.CheckSpeedInSection.min ||
				this.realWaterSpeedInSection >= GrateSource.CheckSpeedInSection.max
				? <ErrorAlert errorMessage={`Действительная скорость движения воды в прозорах решетки:
					${this.realWaterSpeedInSection.toFixed(2)} м/с, должна быть в пределах от ${GrateSource.CheckSpeedInSection.min} до
					${GrateSource.CheckSpeedInSection.max}`} />
				: null}
			</>
			: null}
			{type === GrateTypes.mechanic
			? <>
				<SelectTemplate title={'Марка решетки'} itemList={this.markOfGrateList}
					onSelect={(value) => {this.setState({markOfGrate: value as string}); }}
					onSelectRef={(optionList) => { this.markOfGrateListRef = optionList; }} />
				<InputTemplate title={`Ширина прозоров решетки, м, диапазон [${GrateSource.WidthSection.min} - ${GrateSource.WidthSection.max}]`}
					placeholder={'Введите ширину прозоров...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: GrateSource.WidthSection.min, maxValue: GrateSource.WidthSection.max }}
					onInputRef={(input) => { this.widthSectionRef = input; }}
					onInput={(value) => { this.setState({ widthSection: value }); }} />
			</>
			: null}
			{type === GrateTypes.mechanic || type === GrateTypes.hand
			? <>
				<InputTemplate title={`Среднее значение БПК₅, мг(О₂)/л`}
					placeholder={`Введите среднее значение БПК₅...`}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: 0, maxValue: Infinity }}
					onInputRef={(input) => { this.middleValueBPK5Ref = input; }}
					onInput={(value) => { this.setState({ middleValueBPK5: value }); }} />
				<InputTemplate title={`Среднегодовой объем сточных вод, м³`}
					placeholder={'Введите среднегодовой объем...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: dailyWaterFlow, maxValue: Infinity }}
					onInputRef={(input) => { this.middleVolumeWasteWaterRef = input; }}
					onInput={(value) => { this.setState({ middleVolumeWasteWater: value }); }} />
			</>
			: null}
			{type === GrateTypes.crusher
			? <>
				<SelectTemplate title={'Марка решетки'} itemList={this.grateCrusherList}
					onSelect={(value) => {this.setState({markOfGrateCrusher: value as string}); }}
					onSelectRef={(optionList) => { this.grateCrusherListRef = optionList; }} />
				{(this.currentGrateCrusher && (this.realWaterSpeedInSection <= this.currentGrateCrusher.speedWater.min ||
				this.realWaterSpeedInSection >= this.currentGrateCrusher.speedWater.max))
				? <ErrorAlert errorMessage={`Действительная скорость движения воды в прозорах решетки:
					${this.realWaterSpeedInSection.toFixed(3)} м/с, должна быть в пределах от ${this.currentGrateCrusher.speedWater.min} до
					${this.currentGrateCrusher.speedWater.max}`} />
				: null}
			</>
			: null}
			{type === GrateTypes.mechanic
			? <>
				<SelectTemplate title={'Марка молотковой дробилки'} itemList={this.hammerCrusherList}
					onSelect={(value) => {this.setState({markOfHammerCrusher: value as string}); }}
					onSelectRef={(optionList) => { this.hammerCrusherListRef = optionList; }} />
			</>
			: null}
			{renderCheckingButton(
				this.clearPage,
				this.isInputReadyToCounting,
				this.resultCounting,
			)}
		</div>;
	}

	private isInputReadyToCounting = (): boolean => {
		const { type } = this.props;
		const {speedOfWaterInChannel, speedOfWaterInSection, formOfRod, inclineAngle,
			middleValueBPK5, middleVolumeWasteWater, rodThickness, widthSection, amountOfGrates,
			markOfGrate, markOfGrateCrusher, markOfHammerCrusher
		} = this.state;
		const onlyHandGrate = type === GrateTypes.hand && speedOfWaterInChannel && speedOfWaterInSection &&
			formOfRod && inclineAngle && rodThickness && widthSection && amountOfGrates ? true : false;
		const onlyMechanicGrate = type === GrateTypes.mechanic && markOfGrate && markOfHammerCrusher ? true : false;
		const onlyGrateCrusher = type === GrateTypes.crusher && markOfGrateCrusher ? true : false;
		const handOrMechanic = type === GrateTypes.hand || type === GrateTypes.mechanic && middleValueBPK5 &&
			middleVolumeWasteWater ? true : false;
		return (onlyHandGrate && handOrMechanic) || (onlyMechanicGrate && handOrMechanic) || onlyGrateCrusher;
	}

	private setCurrentResult = () => {
		const { type } = this.props;
		const { amountOfGrates } = this.state;
		this.grateResult = {
			type: KindOfDevices.grate,
			complete: true,
			deviceType: type,
			hand: {
				amountOfGrates: {value: amountOfGrates, label: 'Количество решеток, шт'},
				amountAdditionalGrates: {value: this.amountAdditionalGrates, label: 'Количество резервных решеток, шт'},
				countingWidthOfGrate: {
					value: this.countingWidthOfGrate ? Number(this.countingWidthOfGrate.toFixed(2)) : undefined,
					label: 'Ширина одной решетки, м'
				},
				countingAmountOfSection: {value: this.countingAmountOfSection, label: 'Количество прозоров одной решетки, шт'},
				commonLengthOfCamera: {
					value: this.commonLengthOfCamera ? Number(this.commonLengthOfCamera.toFixed(2)) : undefined,
					label: 'Общая длина камеры решетки, м'
				},
				sizeOfInputChannel: {
					value: this.sizeOfInputChannel ? Number(this.sizeOfInputChannel.toFixed(3)) : undefined,
					label: 'Размер входной части канала, м'},
				sizeOfOutputChannel: {
					value: this.sizeOfOutputChannel ? Number(this.sizeOfOutputChannel.toFixed(3)) : undefined,
					label: 'Размер выходной части канала, м'},
				lengthOfExtendPartOfChannel: {
					value: this.lengthOfExtendPartOfChannel ? Number(this.lengthOfExtendPartOfChannel.toFixed(3)) : undefined,
					label: 'Длина расширенной части канала, м'},
				sizeOfLedge: {
					value: this.sizeOfLedge ? Number(this.sizeOfLedge.toFixed(2)) : undefined,
					label: 'Величина уступа в месте установки решетки, м'},
				volumeOfWaste: {
					value: this.volumeOfWaste ? Number(this.volumeOfWaste.toFixed(2)) : undefined,
					label: 'Объем снимаемых отбросов, м³/сут'},
				massOfWaste: {
					value: this.massOfWaste ? Number(this.massOfWaste.toFixed(2)) : undefined,
					label: 'Масса снимаемых отбросов за сутки, т/сут'},
			},
			mechanic: {
				currentGrate: {value: this.currentGrate ? this.currentGrate.mark : undefined, label: 'Марка решетки'},
				amountOfGrate: {value: this.amountOfGrate, label: 'Количество решеток, шт'},
				amountAdditionalGrates: {value: this.amountAdditionalGrates, label: 'Количество резервных решеток, шт'},
				currentHammerCrusher: {
					value: this.currentHammerCrusher ? this.currentHammerCrusher.mark : undefined,
					label: 'Марка молотковой дробилки',
				},
				amountOfHammerCrusher: {value: this.amountOfHammerCrusher, label: 'Количество молотковых дробилок, шт'},
				amountAdditionalHammerCrusher: {value: this.amountAdditionalHammerCrusher, label: 'Количество резервных молотковых дробилок, шт'},
				amountOfTechnicWaterFlow: {value: this.amountOfTechnicWaterFlow, label: 'Расход технической воды, подводимой к дробилкам, м³/сут'},
				massOfWaste: {
					value: this.massOfWaste ? Number(this.massOfWaste.toFixed(2)) : undefined,
					label: 'Масса снимаемых отбросов за сутки, т/сут',
				},
			},
			crusher: {
				currentGrateCrusher: {
					value: this.currentGrateCrusher ? this.currentGrateCrusher.mark : undefined,
					label: 'Марка решеток-дробилок'
				},
				amountOfGrateCrusher: {value: this.amountOfGrateCrusher, label: 'Количество решеток-дробилок, шт'},
				amountAdditionalGrates: {value: this.amountAdditionalGrates, label: 'Количество резервных решеток-дробилок, шт'},
			}
		}
		dataModel.setGrateResult(this.grateResult);
	}

	private resultCounting = () => {
		const { secondMaxFlow, type } = this.props;
		const { speedOfWaterInChannel, speedOfWaterInSection, widthSection, rodThickness,
			amountOfGrates, inclineAngle, formOfRod, middleValueBPK5,
			middleVolumeWasteWater, markOfGrate, markOfGrateCrusher, markOfHammerCrusher,
		} = this.state;

		if (type === GrateTypes.hand) {
			// formula 1 n = qmax / (hk * vp * b), hk = qmax / speedWaterInChannel
			const hk = Math.sqrt(secondMaxFlow / speedOfWaterInChannel);
			this.amountOfSection = Math.ceil(secondMaxFlow / (hk * speedOfWaterInSection * widthSection));
			if (this.amountOfSection % 2 !== 0) {
				this.amountOfSection++;
			}
			// formula 2 Bp = S * (n - 1) + b * n
			this.generalGrateWidth = rodThickness * (this.amountOfSection - 1) + widthSection * this.amountOfSection;
			// formula 3 B1 = Bp / N, n1 = n / N
			this.countingWidthOfGrate = this.generalGrateWidth / Math.ceil(amountOfGrates);
			this.countingAmountOfSection = Math.ceil(this.amountOfSection / Math.ceil(amountOfGrates));
			// formula 4 vp = qmax / (hk * n1 * b * N)
			this.realWaterSpeedInSection = secondMaxFlow / (hk * this.countingAmountOfSection * widthSection *  Math.ceil(amountOfGrates));
			this.amountAdditionalGrates = this.selectAdditionalFacilities(Math.ceil(amountOfGrates));
			// formula 5 l1 = (B1 - B) / 2 * tgFi, l2 = 0.5 * l1
			const standardChannelWidth = selectValueFromDiapasonOfFilteredArray(
				GrateSource.standardChannelWidth, this.countingWidthOfGrate, 'less');
			this.sizeOfInputChannel = (this.countingWidthOfGrate - standardChannelWidth) /
				(2 * Math.tan(GrateSource.transferRadiansToDegrees(GrateSource.anglePhi)));
			this.sizeOfOutputChannel = 0.5 * this.sizeOfInputChannel;
			// formula 6 l = 1.8 * B + hk / tgAlpha
			this.lengthOfExtendPartOfChannel = 1.8 * standardChannelWidth + hk / Math.tan(GrateSource.transferRadiansToDegrees(inclineAngle));
			// formula 7 L = l1 + l2 + l
			this.commonLengthOfCamera = this.sizeOfInputChannel + this.sizeOfOutputChannel + this.lengthOfExtendPartOfChannel;
			// formula 8 psi = beta * sinAlpha * (S / b)^(4/3)
			this.coefficientLocalPressure = formOfRod * Math.sin(GrateSource.transferRadiansToDegrees(inclineAngle)) *
				Math.pow((rodThickness / widthSection), 4 / 3);
			// formula 9 hp = psi * vp^2 / (2 * g) * P
			this.sizeOfLedge = this.coefficientLocalPressure * (Math.pow(this.realWaterSpeedInSection, 2) / (2 * GrateSource.gravityConst)) *
				GrateSource.coefficientLooseIncrease;
		}

		if (type === GrateTypes.mechanic) {
			this.currentGrate = GrateSource.grates.find(grate => markOfGrate === grate.mark);
			// formula 12 Nреш = qmax / qреш1
			const amount = secondMaxFlow / (this.currentGrate.countingFlow / 1000);
			this.amountOfGrate = amount <= 1 ? 2 : Math.ceil(amount);
			this.amountAdditionalGrates = this.selectAdditionalFacilities(this.amountOfGrate);
		}

		if (type === GrateTypes.crusher) {
			this.currentGrateCrusher = GrateSource.grateCrushers[0];
			this.amountOfGrateCrusher = Math.ceil(secondMaxFlow / (this.currentGrateCrusher.maxPerformance / 3600));
			this.amountAdditionalGrates = this.selectAdditionalFacilities(this.amountOfGrateCrusher);
			// formula 14 v = qmax / (F * N)
			this.realWaterSpeedInSection = secondMaxFlow / (this.currentGrateCrusher.squareHeliumHole * this.amountOfGrateCrusher);
		}

		if (type === GrateTypes.hand || type === GrateTypes.mechanic) {
			// formula 10 Npeq = (Cbpk5 * Wct) / (365 * 60)
			this.amountOfDwellers = (middleValueBPK5 * middleVolumeWasteWater) / (365 * 60);
			// formula 11 Wotb = qotb * Npeq / 365000, Potb = 750 * Wotb / 1000
			const amountOfWaste = this.linearInterpalation(
				GrateSource.AmountOfWaste.startX,
				GrateSource.AmountOfWaste.endX,
				GrateSource.AmountOfWaste.startY,
				GrateSource.AmountOfWaste.endY,
				widthSection
			);
			this.volumeOfWaste = (amountOfWaste * this.amountOfDwellers) / 365000;
			this.massOfWaste = 750 * this.volumeOfWaste / 1000;
		}

		if (type === GrateTypes.mechanic) {
			const necessaryPerformance = this.massOfWaste * 1000 / 24;
			this.currentHammerCrusher = GrateSource.hammerCrushers.find(crusher => markOfHammerCrusher === crusher.mark);
			this.amountOfHammerCrusher = Math.ceil(necessaryPerformance / this.currentHammerCrusher.performance.min);
			this.amountAdditionalHammerCrusher = this.selectAdditionalFacilities(this.amountOfHammerCrusher);
			// formula 13
			this.amountOfTechnicWaterFlow = Math.round(40 * this.massOfWaste);
		}

		this.setCurrentResult();

		this.setState({ isResult: true });
	}

	private selectAdditionalFacilities(amountOfFacilities: number): number {
		return amountOfFacilities <= GrateSource.AmountOfAdditionalGrates.limit
		? GrateSource.AmountOfAdditionalGrates.min
		: GrateSource.AmountOfAdditionalGrates.max;
	}

	private linearInterpalation(startX: number, endX: number, startY: number, endY: number, existX: number) {
		return startY + ((endY - startY) / (endX - startX)) * (existX - startX);
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return renderGrateResult(this.grateResult, false);
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
					{type === GrateTypes.mechanic ?
						<div className={'count-title'}>Механизированная очистка</div> :
						type === GrateTypes.hand ?
							<div className={'count-title'}>Ручная очистка</div> :
							<div className={'count-title'}>Решетки-дробилки</div>}
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

export function selectValueFromDiapasonOfFilteredArray(
	array: number[], valueToCompare: number, direction: 'greater' | 'less'
): number {
	for (let index = 0; index < array.length; index++) {
		if (valueToCompare >= array[index] && valueToCompare <= array[index + 1]) {
			if (direction === 'greater') {
				return array[index + 1];
			} else {
				return array[index];
			}
		}
	}
}

export function renderGrateResult(
	grateResult: GrateResultData,
	isGeneralResult: boolean,
) {
	if (!grateResult) {
		return null;
	}
	const hand = grateResult.hand;
	const mechanic = grateResult.mechanic;
	const crusher = grateResult.crusher;
	const deviceType = grateResult.deviceType === GrateTypes.hand
	? 'Ручная очистка'
	: grateResult.deviceType === GrateTypes.mechanic
	? 'Механизированная очистка'
	: 'Решетки-дробилки';
	return (
		<div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					{isGeneralResult
						? <TableRow value={deviceType} label={'Тип'} />
						: null}
					{grateResult.deviceType === GrateTypes.hand
						? <>
							<TableRow value={hand.amountOfGrates.value} label={hand.amountOfGrates.label} />
							<TableRow value={hand.amountAdditionalGrates.value} label={hand.amountAdditionalGrates.label} />
							<TableRow value={hand.countingWidthOfGrate.value} label={hand.countingWidthOfGrate.label} />
							<TableRow value={hand.countingAmountOfSection.value} label={hand.countingAmountOfSection.label} />
							<TableRow value={hand.commonLengthOfCamera.value} label={hand.commonLengthOfCamera.label} />
							<TableRow value={hand.sizeOfInputChannel.value} label={hand.sizeOfInputChannel.label} />
							<TableRow value={hand.sizeOfOutputChannel.value} label={hand.sizeOfOutputChannel.label} />
							<TableRow value={hand.lengthOfExtendPartOfChannel.value} label={hand.lengthOfExtendPartOfChannel.label} />
							<TableRow value={hand.sizeOfLedge.value} label={hand.sizeOfLedge.label} />
							<TableRow value={hand.volumeOfWaste.value} label={hand.volumeOfWaste.label} />
							<TableRow value={hand.massOfWaste.value} label={hand.massOfWaste.label} />
						</>
						: null}
					{grateResult.deviceType === GrateTypes.mechanic
						? <>
							<TableRow value={mechanic.currentGrate.value} label={mechanic.currentGrate.label} />
							<TableRow value={mechanic.amountOfGrate.value} label={mechanic.amountOfGrate.label} />
							<TableRow value={mechanic.amountAdditionalGrates.value} label={mechanic.amountAdditionalGrates.label} />
							<TableRow value={mechanic.currentHammerCrusher.value} label={mechanic.currentHammerCrusher.label} />
							<TableRow value={mechanic.amountOfHammerCrusher.value} label={mechanic.amountOfHammerCrusher.label} />
							<TableRow value={mechanic.amountAdditionalHammerCrusher.value} label={mechanic.amountAdditionalHammerCrusher.label} />
							<TableRow value={mechanic.amountOfTechnicWaterFlow.value} label={mechanic.amountOfTechnicWaterFlow.label} />
							<TableRow value={mechanic.massOfWaste.value} label={mechanic.massOfWaste.label} />
						</>
						: null}
					{grateResult.deviceType === GrateTypes.crusher
						? <>
							<TableRow value={crusher.currentGrateCrusher.value} label={crusher.currentGrateCrusher.label} />
							<TableRow value={crusher.amountOfGrateCrusher.value} label={crusher.amountOfGrateCrusher.label} />
							<TableRow value={crusher.amountAdditionalGrates.value} label={crusher.amountAdditionalGrates.label} />
						</>
						: null}
				</tbody>
			</Table>
		</div>
	);
}

// Отрисовка кнопки расчета
export function renderCheckingButton(
	clearPage: () => void,
	isInputReadyToCounting: () => boolean,
	resultCounting: () => void) {
	const isNotReadyToCount = !isInputReadyToCounting();
	return (
		<div className='bottom-btn-bar'>
			{isNotReadyToCount
			? <button className={'btn btn-primary not-active-btn'} disabled>
					Показать результаты данной выборки
				</button>
			: <button className={'btn btn-primary'} onClick={() => resultCounting()}>
					Показать результаты данной выборки
				</button>}
			{resetData(clearPage)}
		</div>
	);
}
// Отрисовка кнопки очистки
export function resetData(clearPage: () => void) {
	return <button className={'btn btn-danger'}
		title={'Очистить входные данные'}
		onClick={() => clearPage()}>
		<span className='space-between-text-image'>Очистить входные данные</span>
		<i className={'far fa-trash-alt'}></i>
	</button>;
}
// Отрисовка toolbar с кнопками возврата в начало расчета и переход к результатам
export function renderToolbar(
	returnToScheme: () => void,
	goToResult: () => void,
	openChangeScheme: () => void,
	closeChangeScheme: () => void,
	openShowResult: () => void,
	closeShowResult: () => void,
	showChangeScheme: boolean,
	showOpenResult: boolean,
) {
	return (
		<div className={'device-count-toolbar'}>
			<Button className={'btn btn-primary space-between-text-image'} title={'Изменить расчетную схему'}
				onClick={openChangeScheme}>
				<span className='space-between-text-image'>Изменить расчетную схему</span>
				<i className={'fas fa-reply'}></i>
			</Button>
			<Button className={'merge-result btn btn-success'}
				onClick={openShowResult}
				title={'Cводная схема очиcтных сооружений'}>
				<span className='space-between-text-image'>Cводная схема очиcтных сооружений</span>
				<i className={'fas fa-trophy'}></i>
			</Button>

			<Modal show={showChangeScheme}>
				<Modal.Header>
					<Modal.Title>Подтвержение</Modal.Title>
				</Modal.Header>
				<Modal.Body>Введенные данные сооружений не сохранятся, изменить схему?</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeChangeScheme}>
						Отменить
					</Button>
					<Button variant='primary' onClick={returnToScheme}>
						Изменить схему
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showOpenResult}>
				<Modal.Header>
					<Modal.Title>Подтвержение</Modal.Title>
				</Modal.Header>
				<Modal.Body>Вы уверены, что произведены все расчеты?</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeShowResult}>
						Отменить
					</Button>
					<Button variant='primary' onClick={goToResult}>
						Перейти к результатам
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export function renderBaseData(secondMaxFlow: number, dailyWaterFlow: number) {
	return <div>
		<div className={'input-data-title'}>Входные данные</div>
		{labelTemplate('Максимальный секундный расход сточных вод, м³/с', secondMaxFlow)}
		{labelTemplate('Суточный расход сточных вод, м³/сут', dailyWaterFlow)}
	</div>;
}