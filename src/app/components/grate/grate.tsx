import * as React from 'react';
import { GrateTypes } from '../general-resources';
import {
	InputTemplate,
	labelTemplate,
	SelectTemplate,
	ItemList,
	NULLSTR,
	resetSelectToDefault
} from '../utils';
import { GrateSource } from './grate-resources';
import { Table } from 'react-bootstrap';
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
		});
	}

	private renderBaseData = () => {
		const { secondMaxFlow, dailyWaterFlow } = this.props;
		return <div>
			<div className={'input-data-title'}>Входные данные</div>
			{labelTemplate('Максимальный секундный расход сточных вод, м3/с', secondMaxFlow)}
			{labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
		</div>;
	}

	private renderInputArea = () => {
		const { type, dailyWaterFlow } = this.props;
		const {  } = this.state;
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
				<InputTemplate title={`Угол наклона решетки к горизонту, диапазон [${GrateSource.InclineAngle.min} - ${GrateSource.InclineAngle.max}]`}
					placeholder={'Введите угол наклона решетки...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					range={{ minValue: GrateSource.InclineAngle.min, maxValue: GrateSource.InclineAngle.max }}
					onInputRef={(input) => { this.inclineAngleRef = input; }}
					onInput={(value) => { this.setState({ inclineAngle: value }); }} />
				<SelectTemplate title={'Форма стержней'} itemList={this.formOfRodList}
					onSelect={(value) => {this.setState({formOfRod: value as number}); }}
					onSelectRef={(optionList) => { this.formOfRodListRef = optionList; }} />
				{this.realWaterSpeedInSection < GrateSource.CheckSpeedInSection.min ||
				this.realWaterSpeedInSection > GrateSource.CheckSpeedInSection.max
				? <ErrorAlert errorMessage={`Действительная скорость движения воды в прозорах решетки:
					${this.realWaterSpeedInSection} м/с, должна быть в пределах от ${GrateSource.CheckSpeedInSection.min} до
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
			</>
			: null}
			{type === GrateTypes.crusher
			? <>
				<SelectTemplate title={'Марка решетки'} itemList={this.grateCrusherList}
					onSelect={(value) => {this.setState({markOfGrateCrusher: value as string}); }}
					onSelectRef={(optionList) => { this.grateCrusherListRef = optionList; }} />
				{(this.currentGrateCrusher && (this.realWaterSpeedInSection < this.currentGrateCrusher.speedWater.min ||
				this.realWaterSpeedInSection > this.currentGrateCrusher.speedWater.max))
				? <ErrorAlert errorMessage={`Действительная скорость движения воды в прозорах решетки:
					${this.realWaterSpeedInSection} м/с, должна быть в пределах от ${this.currentGrateCrusher.speedWater.min} до
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
			{this.renderCheckingButton()}
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
		const grateResult: GrateResultData = dataModel.getGrateResult();
		dataModel.setGrateResult(grateResult);
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
			this.countingAmountOfSection = this.amountOfSection / Math.ceil(amountOfGrates);
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
			this.currentGrateCrusher = GrateSource.grateCrushers.find(grate => markOfGrateCrusher === grate.mark);
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
		const { type } = this.props;
		const { amountOfGrates } = this.state;
		return (
			<div className={'table-result'}>
				<Table bordered hover>
					<tbody>
					{(type === GrateTypes.hand)
							? <>
								<tr><td>Количество решеток, шт</td>
									<td>{amountOfGrates ? amountOfGrates : undefined}</td></tr>
								<tr><td>Количество резервных решеток, шт</td>
									<td>{this.amountAdditionalGrates ? this.amountAdditionalGrates : undefined}</td></tr>
								<tr><td>Ширина одной решетки, м</td>
									<td>{this.countingWidthOfGrate ? this.countingWidthOfGrate.toFixed(2) : undefined}</td></tr>
								<tr><td>Количество прозоров одной решетки, шт</td>
									<td>{this.countingAmountOfSection ? this.countingAmountOfSection : undefined}</td></tr>
								<tr><td>Общая длина камеры решетки, м</td>
									<td>{this.commonLengthOfCamera ? this.commonLengthOfCamera.toFixed(2) : undefined}</td></tr>
								<tr><td>Размер входной части канала, м</td>
									<td>{this.sizeOfInputChannel ? this.sizeOfInputChannel.toFixed(3) : undefined}</td></tr>
								<tr><td>Размер выходной части канала, м</td>
									<td>{this.sizeOfOutputChannel ? this.sizeOfOutputChannel.toFixed(3) : undefined}</td></tr>
								<tr><td>Длина расширенной части канала, м</td>
									<td>{this.lengthOfExtendPartOfChannel ? this.lengthOfExtendPartOfChannel.toFixed(3) : undefined}</td></tr>
								<tr><td>Величина уступа в месте установки решетки, м</td>
									<td>{this.sizeOfLedge ? this.sizeOfLedge.toFixed(3) : undefined}</td></tr>
								<tr><td>Объем снимаемых отбросов, м3/сут</td>
									<td>{this.volumeOfWaste ? this.volumeOfWaste.toFixed(2) : undefined}</td></tr>
							</>
							: null}
							{(type === GrateTypes.mechanic)
							? <>
								<tr><td>Марка решетки</td>
									<td>{this.currentGrate ? this.currentGrate.mark : undefined}</td></tr>
								<tr><td>Количество решеток, шт</td>
									<td>{this.amountOfGrate ? this.amountOfGrate : undefined}</td></tr>
								<tr><td>Количество резервных решеток, шт</td>
									<td>{this.amountAdditionalGrates ? this.amountAdditionalGrates : undefined}</td></tr>
								<tr><td>Марка молотковой дробилки</td>
									<td>{this.currentHammerCrusher ? this.currentHammerCrusher.mark : undefined}</td></tr>
								<tr><td>Количество молотковых дробилок, шт</td>
									<td>{this.amountOfHammerCrusher ? this.amountOfHammerCrusher : undefined}</td></tr>
								<tr><td>Количество резервных молотковых дробилок, шт</td>
									<td>{this.amountAdditionalHammerCrusher ? this.amountAdditionalHammerCrusher : undefined}</td></tr>
								<tr><td>Расход технической воды, подводимой к дробилкам, м3/сут</td>
									<td>{this.amountOfTechnicWaterFlow ? this.amountOfTechnicWaterFlow : undefined}</td></tr>
							</>
							: null}
							{(type === GrateTypes.crusher)
							? <>
								<tr><td>Марка решеток-дробилок</td>
									<td>{this.currentGrateCrusher ? this.currentGrateCrusher.mark : undefined}</td></tr>
								<tr><td>Количество решеток-дробилок, шт</td>
									<td>{this.amountOfGrateCrusher ? this.amountOfGrateCrusher : undefined}</td></tr>
								<tr><td>Количество резервных решеток-дробилок, шт</td>
									<td>{this.amountAdditionalGrates ? this.amountAdditionalGrates : undefined}</td></tr>
							</>
							: null}
							{(type === GrateTypes.hand || type === GrateTypes.mechanic)
							? <>
								<tr><td>Масса снимаемых отбросов за сутки, т/сут</td>
									<td>{this.massOfWaste ? this.massOfWaste.toFixed(2) : undefined}</td></tr>
							</>
							: null}
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
					{type === GrateTypes.mechanic ?
						<div className={'count-title'}>Механизированная очистка</div> :
						type === GrateTypes.hand ?
							<div className={'count-title'}>Ручная очистка</div> :
							<div className={'count-title'}>Решетки-дробилки</div>}
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

export function selectValueFromDiapasonOfFilteredArray(
	array: number[], valueToCompare: number, direction: 'greater' | 'less'
): number {
	for (let index = 0; index < array.length; index++) {
		if (valueToCompare >= array[index] && valueToCompare <= array[index + 1]) {
			if (((array[index + 1] + array[index]) / 2) > valueToCompare) {
				if (direction === 'greater') {
					return array[index + 1];
				} else {
					return array[index];
				}
			} else if (valueToCompare >= array[index]) {
				if (index === array.length - 1) {
					return array[index];
				}
				continue;
			} else if (valueToCompare <= array[index]) {
				return array[index];
			}
		}
	}
}
