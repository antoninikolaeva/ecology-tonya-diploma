import * as React from 'react';
import { OilTrapTypes, KindOfDevices } from '../general-resources';
import { resetSelectToDefault, ItemList, NULLSTR } from '../utils/utils';
import { InputTemplate } from '../utils/input-template';
import { SelectTemplate } from '../utils/select-template';
import { TableRow } from '../utils/table-row';
import { Table } from 'react-bootstrap';
import { dataModel, OilTrapResultData } from '../data-model';
import { OilTrapSource } from './oilTrap-resource';
import { selectValueFromDiapason } from '../sump/sump';
import { ErrorAlert } from '../error/error';
import { renderCheckingButton, renderToolbar, renderBaseData } from '../grate/grate';

export interface OilTrapProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: OilTrapTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface OilTrapState {
	amountOfSection: number;
	widthSection: number;
	waterLayerDeep: number;
	hydraulicParticleSize: number;
	waterSpeed: number;
	impurityBlockEffect: number;
	oilBaseConcentrate: number;
	oilFinalConcentrate: number;
	borderHeight: number;
	sedimentType: number;
	mechanicImpurity: number;
	isValidateError: boolean;
	isResult: boolean;
	showChangeScheme: boolean;
	showOpenResult: boolean;
}

export class OilTrapComponent extends React.Component<OilTrapProps, OilTrapState> {
	private amountOfSectionRef: HTMLInputElement;
	private widthSectionRef: HTMLInputElement;
	private waterLayerDeepRef: HTMLInputElement;
	private hydraulicParticleSizeRef: HTMLInputElement;
	private waterSpeedRef: HTMLInputElement;
	private impurityBlockEffectRef: HTMLInputElement;
	private oilBaseConcentrateRef: HTMLInputElement;
	private oilFinalConcentrateRef: HTMLInputElement;
	private borderHeightRef: HTMLInputElement;
	private mechanicImpurityRef: HTMLInputElement;
	private sedimentTypeListRef: HTMLOptionElement[] = [];

	private periodUpOilParticle: number;
	private sumpPartLengthOfOilTrap: number;
	private layPeriod: number;
	private amountOfSediment: number;
	private amountOfOilProduct: number;
	private oilTrapDeep: number;
	private widthSectionResult: number;
	private oilTrapDiameter: number;
	private fullOilTrapHeight: number;
	private sedimentTypeList: ItemList[] = [
		{ value: undefined, label: 'Выберите тип осадка' },
		{ value: OilTrapSource.SedimentType.freshDrop, label: 'Свежевыпавший' },
		{ value: OilTrapSource.SedimentType.pressureSediment, label: 'Слежавшийся' },
	];

	private oilTrapResult: OilTrapResultData;

	constructor(props: OilTrapProps) {
		super(props);

		this.state = {
			amountOfSection: undefined,
			widthSection: undefined,
			waterLayerDeep: undefined,
			hydraulicParticleSize: undefined,
			waterSpeed: undefined,
			impurityBlockEffect: undefined,
			oilBaseConcentrate: undefined,
			oilFinalConcentrate: undefined,
			borderHeight: undefined,
			sedimentType: undefined,
			mechanicImpurity: undefined,
			isValidateError: false,
			isResult: false,
			showChangeScheme: false,
			showOpenResult: false,
		};
	}

	private clearPage = () => {
		if (this.amountOfSectionRef) { this.amountOfSectionRef.value = NULLSTR; }
		if (this.widthSectionRef) { this.widthSectionRef.value = NULLSTR; }
		if (this.waterLayerDeepRef) { this.waterLayerDeepRef.value = NULLSTR; }
		if (this.hydraulicParticleSizeRef) { this.hydraulicParticleSizeRef.value = NULLSTR; }
		if (this.waterSpeedRef) { this.waterSpeedRef.value = NULLSTR; }
		if (this.impurityBlockEffectRef) { this.impurityBlockEffectRef.value = NULLSTR; }
		if (this.oilBaseConcentrateRef) { this.oilBaseConcentrateRef.value = NULLSTR; }
		if (this.oilFinalConcentrateRef) { this.oilFinalConcentrateRef.value = NULLSTR; }
		if (this.borderHeightRef) { this.borderHeightRef.value = NULLSTR; }
		if (this.mechanicImpurityRef) { this.mechanicImpurityRef.value = NULLSTR; }
		resetSelectToDefault(this.sedimentTypeListRef, this.sedimentTypeList);
		this.setState({
			amountOfSection: undefined,
			widthSection: undefined,
			waterLayerDeep: undefined,
			hydraulicParticleSize: undefined,
			waterSpeed: undefined,
			impurityBlockEffect: undefined,
			oilBaseConcentrate: undefined,
			oilFinalConcentrate: undefined,
			borderHeight: undefined,
			sedimentType: undefined,
			isValidateError: false,
			isResult: false,
			showChangeScheme: false,
			showOpenResult: false,
		});
	}

	private setOilTrapResult = () => {
		const {type} = this.props;
		const {amountOfSection} = this.state;
		this.oilTrapResult = {
			type: KindOfDevices.oilTrap,
			complete: true,
			deviceType: type,
			amountOfSection: {value: amountOfSection, label: 'Количество секций, шт'},
			oilTrapDeep: {
				value: this.oilTrapDeep ? Number(this.oilTrapDeep.toFixed(2)) : undefined,
				label: 'Глубина отстаиваемого слоя, м'
			},
			amountOfSediment: {
				value: this.amountOfSediment ? Number(this.amountOfSediment.toFixed(2)) : undefined,
				label: 'Количество осадка, м³/сут'
			},
			amountOfOilProduct: {
				value: this.amountOfOilProduct ? Number(this.amountOfOilProduct.toFixed(2)) : undefined,
				label: 'Количество нефтепродуктов, м³/сут'
			},
			horizontal: {
				widthSectionResult: {
					value: this.widthSectionResult ? Number(this.widthSectionResult.toFixed(2)) : undefined,
					label: 'Ширина секции нефтеловушки, м'
				},
				sumpPartLengthOfOilTrap: {value: this.sumpPartLengthOfOilTrap, label: 'Длина отстойной части нефтеловушки, м'},
				layPeriod: {
					value: this.layPeriod ? Number(this.layPeriod.toFixed(2)) : undefined,
					label: 'Продолжительность отстаивания, ч'
				},
			},
			radial: {
				oilTrapDiameter: {value: this.oilTrapDiameter, label: 'Диаметр нефтеловушки, м'},
				fullOilTrapHeight: {
					value: this.fullOilTrapHeight ? Number(this.fullOilTrapHeight.toFixed(2)) : undefined,
					label: 'Полная строительная высота нефтеловушки, м'
				},
			}
		};
		dataModel.setOilTrapResult(this.oilTrapResult);
	}

	private renderInputArea = () => {
		const { type, secondMaxFlow } = this.props;
		const { oilBaseConcentrate } = this.state;
		return (
			<>
				<InputTemplate title={`Количество секций нефтеловушки, шт,
					диапазон [${type === OilTrapTypes.horizontal
						? OilTrapSource.minAmountOfSection.horizontal
						: OilTrapSource.minAmountOfSection.radial} - n]`}
					range={{
						minValue: type === OilTrapTypes.horizontal
							? OilTrapSource.minAmountOfSection.horizontal
							: OilTrapSource.minAmountOfSection.radial, maxValue: Infinity
					}}
					placeholder={'Введите количество секций нефтеловушки...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.amountOfSectionRef = input; }}
					onInput={(value) => { this.setState({ amountOfSection: value }); }} />

				{secondMaxFlow < OilTrapSource.capacityMark && type === OilTrapTypes.horizontal
					? <>
						<InputTemplate title={`Ширина секции, м, диапазон [${OilTrapSource.SectionWidth.min} - ${OilTrapSource.SectionWidth.max}]`}
							range={{ minValue: OilTrapSource.SectionWidth.min, maxValue: OilTrapSource.SectionWidth.max }}
							placeholder={'Введите ширину секции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.widthSectionRef = input; }}
							onInput={(value) => { this.setState({ widthSection: value }); }} />

						<InputTemplate title={`Глубина отстаиваемого слоя воды, м, диапазон [${OilTrapSource.SectionDeep.min} - ${OilTrapSource.SectionDeep.max}]`}
							range={{ minValue: OilTrapSource.SectionDeep.min, maxValue: OilTrapSource.SectionDeep.max }}
							placeholder={'Введите глубину отстаиваемого слоя воды...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.waterLayerDeepRef = input; }}
							onInput={(value) => { this.setState({ waterLayerDeep: value }); }} />
					</>
					: null}

				{type === OilTrapTypes.horizontal
					? <>
						<InputTemplate title={`Гидравлическая крупность частиц нефти, мм/с,
							диапазон [${OilTrapSource.HydraulicParticleSize.min} - ${OilTrapSource.HydraulicParticleSize.max}]`}
							range={{ minValue: OilTrapSource.HydraulicParticleSize.min, maxValue: OilTrapSource.HydraulicParticleSize.max }}
							placeholder={'Введите гидравлическую крупность частиц нефти...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.hydraulicParticleSizeRef = input; }}
							onInput={(value) => { this.setState({ hydraulicParticleSize: value }); }} />
						<InputTemplate title={`Скорость движения воды, мм/с, диапазон [${OilTrapSource.WaterSpeed.min} - ${OilTrapSource.WaterSpeed.max}]`}
							range={{ minValue: OilTrapSource.WaterSpeed.min, maxValue: OilTrapSource.WaterSpeed.max }}
							placeholder={'Введите скорость движения воды...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.waterSpeedRef = input; }}
							onInput={(value) => { this.setState({ waterSpeed: value }); }} />
					</>
					: null}

				{this.layPeriod <= this.periodUpOilParticle
					? <ErrorAlert errorMessage={`Продолжительность отстаивания: ${this.layPeriod.toFixed(2)},
						должна быть не менее продолжительности всплывания нефтяных частиц: ${this.periodUpOilParticle}.
						Для урегулирования можно изменить глубину слоя или скорость движения воды.`} />
					: null}

				<SelectTemplate title={'Тип осадка'} itemList={this.sedimentTypeList}
					onSelect={(value) => { this.setState({ sedimentType: value as number }); }}
					onSelectRef={(optionList) => { this.sedimentTypeListRef = optionList; }} />

				<InputTemplate title={`Эффект задержания осаждающихся примесей, %,
					диапазон [${OilTrapSource.ImpurityEffectBlock.min} - ${type === OilTrapTypes.horizontal
						? OilTrapSource.ImpurityEffectBlock.max_horizontal
						: OilTrapSource.ImpurityEffectBlock.max_radial}]`}
					range={{
						minValue: OilTrapSource.ImpurityEffectBlock.min, maxValue: type === OilTrapTypes.horizontal
							? OilTrapSource.ImpurityEffectBlock.max_horizontal
							: OilTrapSource.ImpurityEffectBlock.max_radial
					}}
					placeholder={'Введите эффект задержания осаждающихся примесей...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.impurityBlockEffectRef = input; }}
					onInput={(value) => { this.setState({ impurityBlockEffect: value }); }} />

				<InputTemplate title={`Содержание механических примесей в сточной воде, мг/л`}
					range={{ minValue: 0, maxValue: Infinity }}
					placeholder={'Введите содержание механических примесей...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.mechanicImpurityRef = input; }}
					onInput={(value) => { this.setState({ mechanicImpurity: value }); }} />

				<InputTemplate title={`Концентрация нефтепродуктов в исходной воде, мг/л`}
					range={{ minValue: 0, maxValue: Infinity }}
					placeholder={'Введите концентрацию нефтепродуктов в исходной воде...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.oilBaseConcentrateRef = input; }}
					onInput={(value) => { this.setState({ oilBaseConcentrate: value }); }} />

				{oilBaseConcentrate
					? <InputTemplate title={`Концентрация нефтепродуктов в осветленой воде, мг/л, диапазон [0 - ${oilBaseConcentrate}]`}
							range={{ minValue: 0, maxValue: oilBaseConcentrate }}
							placeholder={'Введите концентрацию нефтепродуктов в осветленой воде...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.oilFinalConcentrateRef = input; }}
							onInput={(value) => { this.setState({ oilFinalConcentrate: value }); }} />
					: null}

				{type === OilTrapTypes.radial
					? <InputTemplate title={`Высота борта над слоем воды, м, диапазон [${OilTrapSource.borderHeight.min} - ${OilTrapSource.borderHeight.max}]`}
						range={{ minValue: OilTrapSource.borderHeight.min, maxValue: OilTrapSource.borderHeight.max }}
						placeholder={'Введите высота борта над слоем воды...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.borderHeightRef = input; }}
						onInput={(value) => { this.setState({ borderHeight: value }); }} />
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
		const {secondMaxFlow} = this.props;
		const {
			amountOfSection, borderHeight, hydraulicParticleSize, impurityBlockEffect, sedimentType,
			oilBaseConcentrate, oilFinalConcentrate, waterLayerDeep, waterSpeed, widthSection, mechanicImpurity
		} = this.state;
		const commonInputs = amountOfSection && impurityBlockEffect && oilBaseConcentrate &&
			oilFinalConcentrate && sedimentType && mechanicImpurity ? true : false;
		const onlyHorizontal = hydraulicParticleSize && waterSpeed &&
			(secondMaxFlow < OilTrapSource.capacityMark ? waterLayerDeep && widthSection : true) ? true : false;
		const onlyRadial = borderHeight ? true : false;
		return (commonInputs && onlyHorizontal) || commonInputs && onlyRadial;
	}

	private resultCounting = () => {
		const { secondMaxFlow, type, dailyWaterFlow } = this.props;
		const {
			hydraulicParticleSize, waterSpeed, waterLayerDeep, widthSection, sedimentType, mechanicImpurity,
			impurityBlockEffect, oilBaseConcentrate, oilFinalConcentrate, amountOfSection, borderHeight
		} = this.state;

		if (type === OilTrapTypes.horizontal) {
			this.oilTrapDeep = secondMaxFlow < OilTrapSource.capacityMark ? waterLayerDeep : OilTrapSource.deepSection;
			this.widthSectionResult = secondMaxFlow < OilTrapSource.capacityMark ? widthSection : OilTrapSource.widthSection;
			// formula 1 tp = Hset / 3.6 * v
			this.periodUpOilParticle = this.oilTrapDeep / (3.6 * waterSpeed);
			const proportion = selectValueFromDiapason(OilTrapSource.proportionSpeedHydraulic, (waterSpeed / hydraulicParticleSize));
			const turbulentCoefficient = OilTrapSource.turbulentCoefficient.find(item => item.proportion === proportion);
			// formula 2 L = a * v/ u0 * Hset
			this.sumpPartLengthOfOilTrap = Math.round(turbulentCoefficient.coefficient *
				(waterSpeed / hydraulicParticleSize) * this.oilTrapDeep);
			// formula 3 t'p = L / (3.6 * v)
			this.layPeriod = this.sumpPartLengthOfOilTrap / (3.6 * waterSpeed);
		}
		if (type === OilTrapTypes.radial) {
			// formula 6 Hset = 3.6 * Kset * Tset * u0;
			this.oilTrapDeep = 3.6 * OilTrapSource.volumeCoefficient * OilTrapSource.layPeriod * OilTrapSource.hydraulicParticleSize;
			// formula 7 D = sqrt((4 * q * Tset) / (pi * n * Hset * Kset));
			this.oilTrapDiameter = Math.round(Math.sqrt((4 * secondMaxFlow * 3600 * OilTrapSource.layPeriod) /
				(Math.PI * amountOfSection * this.oilTrapDeep * OilTrapSource.volumeCoefficient)));
			// formula 8 H = Hset + H1 + H2 + H3;
			this.fullOilTrapHeight = this.oilTrapDeep + borderHeight + OilTrapSource.sedimentZoneHeight + OilTrapSource.heightOilProductLayer;
		}

		// formula 4 Qmud = (Q * C * Э) / ((100 - pmud) * gammamud * 10^6)
		this.amountOfSediment = (dailyWaterFlow * mechanicImpurity * impurityBlockEffect) /
			((100 - sedimentType) * OilTrapSource.volumeMassSediment * Math.pow(10, 6));
		// formula 5 t'p = L / (3.6 * v)
		this.amountOfOilProduct = (dailyWaterFlow * (oilBaseConcentrate - oilFinalConcentrate)) /
			(OilTrapSource.volumeMassOilProduct * 30 * Math.pow(10, 4));

		this.setOilTrapResult();

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return renderOilTrapResult(this.oilTrapResult, false);
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
					{type === OilTrapTypes.horizontal ?
						<div className={'count-title'}>Горизонтальные</div> :
						<div className={'count-title'}>Радиальные</div>}
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

export function renderOilTrapResult(
	oiltrapResult: OilTrapResultData,
	isGeneralResult: boolean,
) {
	if (!oiltrapResult) {
		return null;
	}
	const horizontal = oiltrapResult.horizontal;
	const radial = oiltrapResult.radial;
	const deviceType = oiltrapResult.deviceType === OilTrapTypes.horizontal ? 'Горизонтальные' : 'Радиальные';
	return (
		<div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					{isGeneralResult
						? <TableRow value={deviceType} label={'Тип'} />
						: null}
					<TableRow value={oiltrapResult.amountOfSection.value} label={oiltrapResult.amountOfSection.label} />
					<TableRow value={oiltrapResult.oilTrapDeep.value} label={oiltrapResult.oilTrapDeep.label} />
					{oiltrapResult.deviceType === OilTrapTypes.horizontal
						? <>
							<TableRow value={horizontal.widthSectionResult.value} label={horizontal.widthSectionResult.label} />
							<TableRow value={horizontal.sumpPartLengthOfOilTrap.value} label={horizontal.sumpPartLengthOfOilTrap.label} />
						</>
						: null}
					{oiltrapResult.deviceType === OilTrapTypes.radial
						? <>
							<TableRow value={radial.oilTrapDiameter.value} label={radial.oilTrapDiameter.label} />
							<TableRow value={radial.fullOilTrapHeight.value} label={radial.fullOilTrapHeight.label} />
						</>
						: null}
					<TableRow value={oiltrapResult.amountOfSediment.value} label={oiltrapResult.amountOfSediment.label} />
					<TableRow value={oiltrapResult.amountOfOilProduct.value} label={oiltrapResult.amountOfOilProduct.label} />

					{oiltrapResult.deviceType === OilTrapTypes.horizontal
						? <>
							<TableRow value={horizontal.layPeriod.value} label={horizontal.layPeriod.label} />
						</>
						: null}
				</tbody>
			</Table>
		</div>
	);
}
