import * as React from 'react';
import { OilTrapTypes } from '../general-resources';
import { labelTemplate, NULLSTR, InputTemplate } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, OilTrapResultData } from '../data-model';
import { OilTrapSource } from './oilTrap-resource';
import { selectValueFromDiapason } from '../sump/sump';
import { ErrorAlert } from '../error/error';

export interface OilTrapProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: OilTrapTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface OilTrapState {
	amountOfSection: number;
	capacity: number;
	widthSection: number;
	waterLayerDeep: number;
	hydraulicParticleSize: number;
	waterSpeed: number;
	impurityBlockEffect: number;
	oilBaseConcentrate: number;
	oilFinalConcentrate: number;
	borderHeight: number;
	isValidateError: boolean;
	isResult: boolean;
}

export class OilTrapComponent extends React.Component<OilTrapProps, OilTrapState> {
	private amountOfSectionRef: HTMLInputElement;
	private capacityRef: HTMLInputElement;
	private widthSectionRef: HTMLInputElement;
	private waterLayerDeepRef: HTMLInputElement;
	private hydraulicParticleSizeRef: HTMLInputElement;
	private waterSpeedRef: HTMLInputElement;
	private impurityBlockEffectRef: HTMLInputElement;
	private oilBaseConcentrateRef: HTMLInputElement;
	private oilFinalConcentrateRef: HTMLInputElement;
	private borderHeightRef: HTMLInputElement;

	private periodUpOilParticle: number;
	private sumpPartLengthOfOilTrap: number;
	private layPeriod: number;
	private amountOfSediment: number;
	private amountOfOilProduct: number;
	private oilTrapDeep: number;
	private widthSectionResult: number;
	private oilTrapDiameter: number;
	private fullOilTrapHeight: number;

	constructor(props: OilTrapProps) {
		super(props);

		this.state = {
			amountOfSection: undefined,
			capacity: undefined,
			widthSection: undefined,
			waterLayerDeep: undefined,
			hydraulicParticleSize: undefined,
			waterSpeed: undefined,
			impurityBlockEffect: undefined,
			oilBaseConcentrate: undefined,
			oilFinalConcentrate: undefined,
			borderHeight: undefined,
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		if (this.amountOfSectionRef) { this.amountOfSectionRef.value = NULLSTR; }
		if (this.capacityRef) { this.capacityRef.value = NULLSTR; }
		if (this.widthSectionRef) { this.widthSectionRef.value = NULLSTR; }
		if (this.waterLayerDeepRef) { this.waterLayerDeepRef.value = NULLSTR; }
		if (this.hydraulicParticleSizeRef) { this.hydraulicParticleSizeRef.value = NULLSTR; }
		if (this.waterSpeedRef) { this.waterSpeedRef.value = NULLSTR; }
		if (this.impurityBlockEffectRef) { this.impurityBlockEffectRef.value = NULLSTR; }
		if (this.oilBaseConcentrateRef) { this.oilBaseConcentrateRef.value = NULLSTR; }
		if (this.oilFinalConcentrateRef) { this.oilFinalConcentrateRef.value = NULLSTR; }
		if (this.borderHeightRef) { this.borderHeightRef.value = NULLSTR; }
		this.setState({
			amountOfSection: undefined,
			capacity: undefined,
			widthSection: undefined,
			waterLayerDeep: undefined,
			hydraulicParticleSize: undefined,
			waterSpeed: undefined,
			impurityBlockEffect: undefined,
			oilBaseConcentrate: undefined,
			oilFinalConcentrate: undefined,
			borderHeight: undefined,
			isValidateError: false,
			isResult: false,
		});
	}

	private setOilTrapResult = () => {
		const oilTrapResult: OilTrapResultData = {
		};
		dataModel.setOilTrapResult(oilTrapResult);
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
		const { capacity, oilBaseConcentrate } = this.state;
		return (
			<>
				<InputTemplate title={`Количество секций нефтеловушки, шт,
					диапазон[${type === OilTrapTypes.horizontal
						? OilTrapSource.minAmountOfSection.horizontal
						: OilTrapSource.minAmountOfSection.radial} - n]`}
					// 1000 is artificial value, safety from broken system
					range={{
						minValue: type === OilTrapTypes.horizontal
							? OilTrapSource.minAmountOfSection.horizontal
							: OilTrapSource.minAmountOfSection.radial, maxValue: 1000
					}}
					placeholder={'Введите количество секций нефтеловушки...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.amountOfSectionRef = input; }}
					onInput={(value) => { this.setState({ amountOfSection: value }); }} />

				<InputTemplate title={`Пропускная способность нефтеловушки, м3/ч,
						значение ${OilTrapSource.capacityMark} является переходным для выбора ширины и глубины секции`}
					placeholder={'Введите пропускную способность нефтеловушки...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.capacityRef = input; }}
					onInput={(value) => { this.setState({ capacity: value }); }} />

				{capacity < OilTrapSource.capacityMark && type === OilTrapTypes.horizontal
					? <>
						<InputTemplate title={`Ширина секции, м, диапазон[${OilTrapSource.SectionWidth.min} - ${OilTrapSource.SectionWidth.max}]`}
							range={{ minValue: OilTrapSource.SectionWidth.min, maxValue: OilTrapSource.SectionWidth.max }}
							placeholder={'Введите ширину секции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.widthSectionRef = input; }}
							onInput={(value) => { this.setState({ widthSection: value }); }} />

						<InputTemplate title={`Глубина отстаиваемого слоя воды, м, диапазон[${OilTrapSource.SectionDeep.min} - ${OilTrapSource.SectionDeep.max}]`}
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
							диапазон[${OilTrapSource.HydraulicParticleSize.min} - ${OilTrapSource.HydraulicParticleSize.max}]`}
							range={{ minValue: OilTrapSource.HydraulicParticleSize.min, maxValue: OilTrapSource.HydraulicParticleSize.max }}
							placeholder={'Введите гидравлическую крупность частиц нефти...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.hydraulicParticleSizeRef = input; }}
							onInput={(value) => { this.setState({ hydraulicParticleSize: value }); }} />
						<InputTemplate title={`Скорость движения воды, мм/с, диапазон[${OilTrapSource.WaterSpeed.min} - ${OilTrapSource.WaterSpeed.max}]`}
							range={{ minValue: OilTrapSource.WaterSpeed.min, maxValue: OilTrapSource.WaterSpeed.max }}
							placeholder={'Введите скорость движения воды...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.waterSpeedRef = input; }}
							onInput={(value) => { this.setState({ waterSpeed: value }); }} />
					</>
					: null}

				{this.layPeriod < this.periodUpOilParticle
					? <ErrorAlert errorMessage={`Продолжительность отстаивания: ${this.layPeriod},
						должна быть не менее продолжительности всплывания нефтяных частиц: ${this.periodUpOilParticle}.
						Для урегулирования можно изменить глубину слоя или скорость движения воды.`} />
					: null}

				<InputTemplate title={`Эффект задержания осаждающихся примесей, %,
					диапазон[${OilTrapSource.ImpurityEffectBlock.min} - ${type === OilTrapTypes.horizontal
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

				<InputTemplate title={`Концентрация нефтепродуктов в исходной воде, мг/л`}
					placeholder={'Введите концентрацию нефтепродуктов в исходной воде...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.oilBaseConcentrateRef = input; }}
					onInput={(value) => { this.setState({ oilBaseConcentrate: value }); }} />

				{oilBaseConcentrate
					? <InputTemplate title={`Концентрация нефтепродуктов в осветленой воде, мг/л, , диапазон[0 - ${oilBaseConcentrate}]`}
							range={{ minValue: 0, maxValue: oilBaseConcentrate }}
							placeholder={'Введите концентрацию нефтепродуктов в осветленой воде...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.oilFinalConcentrateRef = input; }}
							onInput={(value) => { this.setState({ oilFinalConcentrate: value }); }} />
					: null}

				{type === OilTrapTypes.radial
					? <InputTemplate title={`Высота борта над слоем воды, м, , диапазон[${OilTrapSource.borderHeight.min} - ${OilTrapSource.borderHeight.max}]`}
						range={{ minValue: OilTrapSource.borderHeight.min, maxValue: OilTrapSource.borderHeight.max }}
						placeholder={'Введите высота борта над слоем воды...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.borderHeightRef = input; }}
						onInput={(value) => { this.setState({ borderHeight: value }); }} />
					: null}

				{this.renderCheckingButton()}
			</>
		);
	}

	private isInputReadyToCounting = (): boolean => {
		const {type} = this.props;
		const {
			amountOfSection, borderHeight, capacity, hydraulicParticleSize, impurityBlockEffect,
			oilBaseConcentrate, oilFinalConcentrate, waterLayerDeep, waterSpeed, widthSection,
		} = this.state;
		const commonInputs = amountOfSection && impurityBlockEffect && oilBaseConcentrate && oilFinalConcentrate && capacity ? true : false;
		const onlyHorizontal = hydraulicParticleSize && waterLayerDeep && waterSpeed && widthSection ? true : false;
		const onlyRadial = borderHeight ? true : false;
		if (type === OilTrapTypes.horizontal) {
			return commonInputs && onlyHorizontal;
		} else if (type === OilTrapTypes.radial) {
			return commonInputs && onlyRadial;
		}
	}

	private resultCounting = () => {
		const { secondMaxFlow, type, dailyWaterFlow } = this.props;
		const {
			capacity, hydraulicParticleSize, waterSpeed, waterLayerDeep, widthSection,
			impurityBlockEffect, oilBaseConcentrate, oilFinalConcentrate, amountOfSection, borderHeight
		} = this.state;

		if (type === OilTrapTypes.horizontal) {
			this.oilTrapDeep = capacity < OilTrapSource.capacityMark ? waterLayerDeep : OilTrapSource.deepSection;
			this.widthSectionResult = capacity < OilTrapSource.capacityMark ? widthSection : OilTrapSource.widthSection;
			// formula 1 tp = Hset / 3.6 * v
			this.periodUpOilParticle = this.oilTrapDeep / (3.6 * waterSpeed);
			const proportion = selectValueFromDiapason(OilTrapSource.proportionSpeedHydraulic, (waterSpeed / hydraulicParticleSize));
			const turbulentCoefficient = OilTrapSource.turbulentCoefficient.find(item => item.proportion === proportion);
			// formula 2 L = a * v/ u0 * Hset
			this.sumpPartLengthOfOilTrap = turbulentCoefficient.coefficient * proportion * this.oilTrapDeep;
			// formula 3 t'p = L / (3.6 * v)
			this.layPeriod = this.sumpPartLengthOfOilTrap / (3.6 * waterSpeed);
		} else if (type === OilTrapTypes.radial) {
			// formula 6 Hset = 3.6 * Kset * T set * u0;
			this.oilTrapDeep = 3.6 * OilTrapSource.volumeCoefficient * OilTrapSource.layPeriod * OilTrapSource.hydraulicParticleSize;
			// formula 7 D = sqrt((4 * q * Tset) / (pi * n * Hset * Kset));
			this.oilTrapDiameter = Math.sqrt((4 * capacity * OilTrapSource.layPeriod) /
				(Math.PI * amountOfSection * this.oilTrapDeep * OilTrapSource.volumeCoefficient));
			// formula 8 H = Hset + H1 + H2 + H3;
			this.fullOilTrapHeight = this.oilTrapDeep + borderHeight + OilTrapSource.sedimentZoneHeight + OilTrapSource.heightOilProductLayer;
		}

		// formula 4 Qmud = (Q * C * Э) / ((100 - pmud) * gammamud * 10^6)
		this.amountOfSediment = (dailyWaterFlow * OilTrapSource.mechanicImpurityConcentrate * impurityBlockEffect) /
			((100 - OilTrapSource.sedimentWet) * OilTrapSource.volumeMassSediment * Math.pow(10, 6));
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
		const {type} = this.props;
		return (
			<div className={'table-result'}>
				<Table bordered hover>
					<tbody>
						<tr><td>Глубина отстаиваемого слоя, м</td>
							<td>{this.oilTrapDeep ? this.oilTrapDeep.toFixed(3) : undefined}</td></tr>
						<tr><td>Количество осадка, м3/сут</td>
							<td>{this.amountOfSediment ? this.amountOfSediment.toFixed(3) : undefined}</td></tr>
						<tr><td>Количество нефтепродуктов, м3/сут</td>
							<td>{this.amountOfOilProduct ? this.amountOfOilProduct.toFixed(3) : undefined}</td></tr>
						{type === OilTrapTypes.horizontal
							? <>
								<tr><td>Ширина секции нефтеловушки, м</td>
									<td>{this.widthSectionResult ? this.widthSectionResult.toFixed(3) : undefined}</td></tr>
								<tr><td>Продолжительность всплытия нефтяных частиц, ч</td>
									<td>{this.periodUpOilParticle ? this.periodUpOilParticle.toFixed(3) : undefined}</td></tr>
								<tr><td>Длина отстойной части нефтеловушки, м</td>
									<td>{this.sumpPartLengthOfOilTrap ? this.sumpPartLengthOfOilTrap.toFixed(3) : undefined}</td></tr>
								<tr><td>Продолжительность отсаивания, ч</td>
									<td>{this.layPeriod ? this.layPeriod.toFixed(3) : undefined}</td></tr>
							</>
							: null}
						{type === OilTrapTypes.radial
							? <>
								<tr><td>Диаметр нефтеловушки, м</td>
									<td>{this.oilTrapDiameter ? this.oilTrapDiameter.toFixed(3) : undefined}</td></tr>
								<tr><td>Полная строительная высота нефтеловушки, м </td>
									<td>{this.fullOilTrapHeight ? this.fullOilTrapHeight.toFixed(3) : undefined}</td></tr>
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
					{type === OilTrapTypes.horizontal ?
						<div className={'count-title'}>Горизонтальные</div> :
						<div className={'count-title'}>Радиальные</div>}
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
