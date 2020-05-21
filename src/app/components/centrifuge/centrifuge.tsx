import * as React from 'react';
import { CentrifugeTypes, KindOfDevices } from '../general-resources';
import { labelTemplate, resetSelectToDefault, NULLSTR, ItemList, SelectTemplate, InputTemplate, TableRow } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, CentrifugeResultData } from '../data-model';
import { CentrifugeSource } from './centrifuge-resource';
import { renderToolbar, renderCheckingButton } from '../grate/grate';

export interface CentrifugeProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: CentrifugeTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface CentrifugeState {
	currentOpenHydrocycloneType: CentrifugeSource.HydrocycloneOpenTypes;
	diameterHydrocyclone: number;
	amountOfLayer: number;
	diameterCentralHole: number;
	periodCentrifugeWorks: number;
	hydraulicHugest: number;
	coefficientCentrifugeVolume: number;
	isValidateError: boolean;
	isResult: boolean;
}

export class CentrifugeComponent extends React.Component<CentrifugeProps, CentrifugeState> {
	private diameterHydrocycloneRef: HTMLInputElement;
	private amountOfLayerRef: HTMLInputElement;
	private diameterCentralHoleRef: HTMLInputElement;
	private hydraulicHugestRef: HTMLInputElement;
	private periodCentrifugeWorksRef: HTMLInputElement;
	private coefficientCentrifugeVolumeRef: HTMLInputElement;
	private openHydrocycloneRef: HTMLOptionElement[] = [];
	private pressureHydrocycloneRef: HTMLOptionElement[] = [];
	private centrifugeRef: HTMLOptionElement[] = [];

	private coefficientProportion: number;
	private hydraulicPressure: number;
	private performance: number;
	private amountOfDevice: number;
	private necessaryPressureHydrocyclones: CentrifugeSource.PressureHydrocycloneTable[] = [];
	private currentPressureHydrocyclone: CentrifugeSource.PressureHydrocycloneTable;
	private amountOfAdditionalDevice: number;
	private currentCentrifuge: CentrifugeSource.CentrifugeTable;
	private currentHydrocyclone: CentrifugeSource.OpenHydrocycloneConfig;

	private openHydrocycloneList: ItemList[] = [
		{value: undefined, label: 'Выберите тип открытого гидроциклона'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.withoutDevice, label: 'Без внутренних устройств'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder, label: 'С конической диафрагмой и внутренним цилиндром'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter, label: 'Многоярусные с центральным выпуском'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.highLevelExternal, label: 'Многоярусные с периферийным отводом воды'},
	];

	private centrifugeResult: CentrifugeResultData;

	constructor(props: CentrifugeProps) {
		super(props);

		this.state = {
			currentOpenHydrocycloneType: undefined,
			diameterHydrocyclone: undefined,
			amountOfLayer: undefined,
			diameterCentralHole: undefined,
			hydraulicHugest: undefined,
			periodCentrifugeWorks: undefined,
			coefficientCentrifugeVolume: undefined,
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		if (this.diameterHydrocycloneRef) { this.diameterHydrocycloneRef.value = NULLSTR; }
		if (this.amountOfLayerRef) { this.amountOfLayerRef.value = NULLSTR; }
		if (this.diameterCentralHoleRef) { this.diameterCentralHoleRef.value = NULLSTR; }
		if (this.hydraulicHugestRef) { this.hydraulicHugestRef.value = NULLSTR; }
		if (this.periodCentrifugeWorksRef) { this.periodCentrifugeWorksRef.value = NULLSTR; }
		if (this.coefficientCentrifugeVolumeRef) { this.coefficientCentrifugeVolumeRef.value = NULLSTR; }
		resetSelectToDefault(this.openHydrocycloneRef, this.openHydrocycloneList);
		resetSelectToDefault(this.pressureHydrocycloneRef, this.necessaryPressureHydrocyclones);
		resetSelectToDefault(this.centrifugeRef, []);
		this.setState({
			currentOpenHydrocycloneType: undefined,
			diameterHydrocyclone: undefined,
			amountOfLayer: undefined,
			diameterCentralHole: undefined,
			hydraulicHugest: undefined,
			periodCentrifugeWorks: undefined,
			coefficientCentrifugeVolume: undefined,
			isValidateError: false,
			isResult: false,
		});
	}

	private setCentrifugeResult = () => {
		const { type } = this.props;
		const { diameterHydrocyclone, currentOpenHydrocycloneType } = this.state;
		this.centrifugeResult = {
			type: KindOfDevices.centrifuge,
			complete: true,
			deviceType: type,
			openHydrocycloneType: currentOpenHydrocycloneType,
			hOpened: {
				amountOfHydrocyclones: {value: this.amountOfDevice, label: 'Количество рабочих гидроциклонов, шт'},
				coefficientProportion: {
					value: this.coefficientProportion ? Number(this.coefficientProportion.toFixed(3)) : undefined,
					label: 'Коэффициент пропорциональности'
				},
				currentHydrocyclone: this.currentHydrocyclone,
				diameterHydrocyclone: {value: diameterHydrocyclone, label: 'Диаметр гидроциклона, м'},
				hydraulicPressure: {
					value: this.hydraulicPressure ? Number(this.hydraulicPressure.toFixed(3)) : undefined,
					label: 'Удельная гидравлическая нагрузка, м³/(м²/ч)'
				},
				performance: {
					value: this.performance ? Number(this.performance.toFixed(3)) : undefined,
					label: 'Производительность гидроциклона, м³/ч'
				},
			},
			hPressure: {
				amountOfHydrocyclones: {value: this.amountOfDevice, label: 'Количество рабочих гидроциклонов, шт'},
				amountOfAdditionalHydrocyclones: {value: this.amountOfAdditionalDevice, label: 'Количество резервных гидроциклонов, шт'},
				currentPressureHydrocyclone: this.currentPressureHydrocyclone,
				performance: {
					value: this.performance ? Number(this.performance.toFixed(3)) : undefined,
					label: 'Производительность гидроциклона, м³/ч'
				},
			},
			centrifuge: {
				amountOfCentrifuges: {value: this.amountOfDevice, label: 'Количество рабочих центрифуг, шт'},
				performance: {
					value: this.performance ? Number(this.performance.toFixed(3)) : undefined,
					label: 'Производительность центрифуги, м³/ч'
				},
				currentCentrifuge: this.currentCentrifuge,
			}
		};
		dataModel.setCentrifugeResult(this.centrifugeResult);
	}

	private renderBaseData = () => {
		const { secondMaxFlow, dailyWaterFlow } = this.props;
		return <div>
			<div className={'input-data-title'}>Входные данные</div>
			{labelTemplate('Секундный максимальный расход', secondMaxFlow)}
			{labelTemplate('Суточный расход сточных вод, м³/сут', dailyWaterFlow)}
		</div>;
	}

	private renderInputArea = () => {
		const { type } = this.props;
		const { currentOpenHydrocycloneType } = this.state;
		return (
			<>
				{type === CentrifugeTypes.opened
					? <>
						<SelectTemplate title={'Выбор типа открытого гидроциклона'} itemList={this.openHydrocycloneList}
							onSelect={(value) => { this.selectOpenHydrocyclone(value as string as CentrifugeSource.HydrocycloneOpenTypes); }}
							onSelectRef={(optionList) => { this.openHydrocycloneRef = optionList; }} />

						{currentOpenHydrocycloneType
							? <InputTemplate title={`Диаметр гидроциклона, м,
								диапазон[${CentrifugeSource.DiameterOpenHydrocyclone.min}
								-
								${currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.withoutDevice
									? CentrifugeSource.DiameterOpenHydrocyclone.maxWithoutDevice
									: CentrifugeSource.DiameterOpenHydrocyclone.maxAnother}]`}
								range={{
									minValue: CentrifugeSource.DiameterOpenHydrocyclone.min,
									maxValue: currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.withoutDevice
										? CentrifugeSource.DiameterOpenHydrocyclone.maxWithoutDevice
										: CentrifugeSource.DiameterOpenHydrocyclone.maxAnother
								}}
								placeholder={'Введите диаметр гидроциклона...'}
								onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
								onInputRef={(input) => { this.diameterHydrocycloneRef = input; }}
								onInput={(value) => { this.setState({ diameterHydrocyclone: value }); }} />
							: null}

						<InputTemplate title={`Гидравлическая крупность частиц, мм/с,
							диапазон[${CentrifugeSource.HydraulicHugest.min} - ${CentrifugeSource.HydraulicHugest.max}]`}
							range={{ minValue: CentrifugeSource.HydraulicHugest.min, maxValue: CentrifugeSource.HydraulicHugest.max }}
							placeholder={'Введите гидравлическая крупность частиц...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.hydraulicHugestRef = input; }}
							onInput={(value) => { this.setState({ hydraulicHugest: value }); }} />

						{currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter ||
							currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelExternal
							? <>
								<InputTemplate title={`Диаметр центрального отверстия в диафрагме, м,
									диапазон[${currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter
										? CentrifugeSource.DiameterCentralHole.minCentral
										: CentrifugeSource.DiameterCentralHole.minExternal}
									-
									${currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter
										? CentrifugeSource.DiameterCentralHole.maxCentral
										: CentrifugeSource.DiameterCentralHole.maxExternal}]`}
									range={{
										minValue: currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter
											? CentrifugeSource.DiameterCentralHole.minCentral
											: CentrifugeSource.DiameterCentralHole.minExternal,
										maxValue: currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter
											? CentrifugeSource.DiameterCentralHole.maxCentral
											: CentrifugeSource.DiameterCentralHole.maxExternal
									}}
									placeholder={'Введите диаметр центрального отверстия в диафрагме...'}
									onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
									onInputRef={(input) => { this.diameterCentralHoleRef = input; }}
									onInput={(value) => { this.setState({ diameterCentralHole: value }); }} />

								<InputTemplate title={`Число ярусов, шт,
									диапазон[${CentrifugeSource.AmountOfLayer.min} - ${CentrifugeSource.AmountOfLayer.max}]`}
									range={{ minValue: CentrifugeSource.AmountOfLayer.min, maxValue: CentrifugeSource.AmountOfLayer.max }}
									placeholder={'Введите число ярусов...'}
									onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
									onInputRef={(input) => { this.amountOfLayerRef = input; }}
									onInput={(value) => { this.setState({ amountOfLayer: value }); }} />
							</>
							: null}
					</>
					: null}

				{type === CentrifugeTypes.pressure
					? <>
						<InputTemplate title={`Задерживаемая крупность частиц, мкм,
							диапазон[${CentrifugeSource.ParticleHugest.min} - ${CentrifugeSource.ParticleHugest.max}]`}
							range={{ minValue: CentrifugeSource.ParticleHugest.min, maxValue: CentrifugeSource.ParticleHugest.max }}
							placeholder={'Введите задерживаемая крупность частиц...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.hydraulicHugestRef = input; }}
							onInput={(value) => {
								this.selectNecessaryPressureHydrocyclone(value);
								this.setState({ hydraulicHugest: value });
							}} />

						{this.necessaryPressureHydrocyclones.length > 0
							? <SelectTemplate title={'Выбор напорного гидроциклона'} itemList={this.necessaryPressureHydrocyclones}
									onSelect={(value) => {
									this.currentPressureHydrocyclone = this.necessaryPressureHydrocyclones.find(device =>
										device.diameter === value as number); }}
									onSelectRef={(optionList) => { this.pressureHydrocycloneRef = optionList; }} />
							: null}
					</>
					: null}

				{type === CentrifugeTypes.continuous || type === CentrifugeTypes.determinate
					? <>
						<SelectTemplate title={'Выбор центрифугу'} itemList={type === CentrifugeTypes.continuous
							? CentrifugeSource.centrifugeTableContinuous
							: CentrifugeSource.centrifugeTableDeterminate}
							onSelect={(value) => {
								this.currentCentrifuge = type === CentrifugeTypes.continuous
									? CentrifugeSource.centrifugeTableContinuous.find(device => device.rotorDiameter === value as number)
									: CentrifugeSource.centrifugeTableDeterminate.find(device => device.rotorDiameter === value as number);
							}}
							onSelectRef={(optionList) => { this.pressureHydrocycloneRef = optionList; }} />

						<InputTemplate title={`Продолжительность центрифугирования, с, диапазон[0 - n]`}
							range={{ minValue: 0, maxValue: Infinity }}
							placeholder={'Введите продолжительность центрифугирования...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.periodCentrifugeWorksRef = input; }}
							onInput={(value) => { this.setState({ periodCentrifugeWorks: value }); }} />

						<InputTemplate title={`Коэффициент использования объема центрифуги,
							диапазон[${CentrifugeSource.CoefficientCentrifugeVolume.min} - ${CentrifugeSource.CoefficientCentrifugeVolume.max}]`}
							range={{ minValue: CentrifugeSource.CoefficientCentrifugeVolume.min, maxValue: CentrifugeSource.CoefficientCentrifugeVolume.max }}
							placeholder={'Введите коэффициент использования объема центрифуги...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.coefficientCentrifugeVolumeRef = input; }}
							onInput={(value) => { this.setState({ coefficientCentrifugeVolume: value }); }} />
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
		const {
			amountOfLayer, coefficientCentrifugeVolume, currentOpenHydrocycloneType,
			diameterCentralHole, diameterHydrocyclone, hydraulicHugest,
			periodCentrifugeWorks
		} = this.state;
		const isOpenHydrocyclone = currentOpenHydrocycloneType &&
			(currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter ||
			currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelExternal
			? amountOfLayer && diameterCentralHole : true) &&
			diameterHydrocyclone && hydraulicHugest ? true : false;
		const isPressureHydrocyclone = hydraulicHugest ? true : false;
		const isCentrifuge = periodCentrifugeWorks && coefficientCentrifugeVolume ? true : false;
		return isOpenHydrocyclone || isPressureHydrocyclone || isCentrifuge;
	}

	private selectOpenHydrocyclone = (openHydrocycloneType: CentrifugeSource.HydrocycloneOpenTypes) => {
		if (CentrifugeSource.HydrocycloneOpenTypes.withoutDevice === openHydrocycloneType) {
			this.coefficientProportion = CentrifugeSource.coefficientWithoutDevice;
		} else if (CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder === openHydrocycloneType) {
			this.coefficientProportion = CentrifugeSource.coefficientConusAndCylinder;
		}
		this.setState({currentOpenHydrocycloneType: openHydrocycloneType});
	}

	private selectNecessaryPressureHydrocyclone = (hydraulicHugest: number) => {
		this.necessaryPressureHydrocyclones = CentrifugeSource.pressureHydrocycloneTable.filter(device =>
			device.hugestParticular.min < hydraulicHugest && device.hugestParticular.max > hydraulicHugest);
		this.necessaryPressureHydrocyclones.unshift({
			label: 'Выберите гидроциклон', value: undefined, mark: undefined,
			diameter: undefined, diameterInPipe: undefined,
			hugestParticular: {min: undefined, max: undefined},
			diameterSpecialPipe: [], diameterOutPipe: undefined, alpha: undefined,
			cylinderHeight: [], deltaP: undefined, iri: undefined,
		});
	}

	private resultCounting = () => {
		const { secondMaxFlow, type } = this.props;
		const {
			amountOfLayer, currentOpenHydrocycloneType, diameterCentralHole,
			diameterHydrocyclone, hydraulicHugest, coefficientCentrifugeVolume,
			periodCentrifugeWorks
		} = this.state;

		if (type === CentrifugeTypes.opened) {
			// formula 1 Khc = 0.75(1,5) * nti * (Dhc^2 - dd^2) / Dhc^2
			if (currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter) {
				this.coefficientProportion = (0.75 * amountOfLayer * (Math.pow(diameterHydrocyclone, 2) - Math.pow(diameterCentralHole, 2))) /
					Math.pow(diameterHydrocyclone, 2);
			}
			if (currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelExternal) {
				this.coefficientProportion = (1.5 * Math.floor(amountOfLayer / 2) *
					(Math.pow(diameterHydrocyclone, 2) - Math.pow(diameterCentralHole, 2))) /
					Math.pow(diameterHydrocyclone, 2);
			}
			// formula 2 qhc = 3.6 * Khc * u0
			this.hydraulicPressure = 3.6 * this.coefficientProportion * hydraulicHugest;
			// formula 3 Qhc = 0.785 * qhc * Dhc^2
			this.performance = 0.785 * this.hydraulicPressure * Math.pow(diameterHydrocyclone, 2);
			// formula 3 n = qw/Ohc
			this.amountOfDevice = Math.ceil((secondMaxFlow * 3600) / this.performance);
			// current Hydrocyclone
			this.currentHydrocyclone = CentrifugeSource.openHydrocycloneConfiguration.find(device => device.type === currentOpenHydrocycloneType);
			this.currentHydrocyclone.diameter = diameterHydrocyclone;
			this.currentHydrocyclone.heightCylinderPart =
				currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.withoutDevice
					? diameterHydrocyclone
					: currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder
						? diameterHydrocyclone + 0.5
						: undefined;
			this.currentHydrocyclone.sizeOfInPipe =
				currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.withoutDevice
					? diameterHydrocyclone * 0.07
					: currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder
						? diameterHydrocyclone * 0.05
						: undefined;
			this.currentHydrocyclone.diameterCentralHole =
				currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder
					? [diameterHydrocyclone * 0.5]
					: currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter
						? [diameterHydrocyclone * 0.6, diameterHydrocyclone * 1.4]
						: currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.highLevelExternal
							? [diameterHydrocyclone * 0.9, diameterHydrocyclone * 1.6, diameterHydrocyclone * 0.6, diameterHydrocyclone]
							: undefined;
			this.currentHydrocyclone.diameterInsideCylinder =
				currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder ? diameterHydrocyclone * 0.88 : undefined;
			this.currentHydrocyclone.heightInsideCylinder =
				currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder ? diameterHydrocyclone : undefined;
			this.currentHydrocyclone.diameterWaterOutWall =
				currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.withoutDevice
					? diameterHydrocyclone
					: diameterHydrocyclone + 0.2;
			this.currentHydrocyclone.diameterCircleWall =
				currentOpenHydrocycloneType === CentrifugeSource.HydrocycloneOpenTypes.withoutDevice
					? diameterHydrocyclone - 0.2
					: diameterHydrocyclone;
		}

		if (type === CentrifugeTypes.pressure) {
			if (this.currentPressureHydrocyclone) {
				const HCP = this.currentPressureHydrocyclone;
				// formula 4 Qhc = 9.58 * 10^-3 * den * dex * sqrt(g * deltaP)
				this.performance = 9.58 * Math.pow(10, -3) * (HCP.diameterInPipe * 1000) * (HCP.diameterOutPipe * 1000) *
					Math.sqrt(CentrifugeSource.gravityAcceleration * HCP.deltaP);
				// formula 3 n = qw/Ohc
				this.amountOfDevice = Math.ceil((secondMaxFlow * 3600) / this.performance);
				this.amountOfAdditionalDevice = this.amountOfDevice <= 10 ? 1 : this.amountOfDevice <= 15 ? 2 : Math.ceil(this.amountOfDevice / 10);
			}
		}

		if (type === CentrifugeTypes.continuous || type === CentrifugeTypes.determinate) {
			// formula 5.01 Lcf = 3.76 * Dcf
			const Lcf = 3.76 * this.currentCentrifuge.rotorDiameter;
			// formula 5.01 Wcf = 0.25 Pi * Dcf^2 * Lcf
			const rotorVolume = 0.25 * Math.PI * Math.pow(this.currentCentrifuge.rotorDiameter, 2) * Lcf;
			// formula 5 Qcf = 3600 * Wcf * Kcf / tcf
			this.performance = (3600 * rotorVolume * coefficientCentrifugeVolume) / periodCentrifugeWorks;
			this.currentCentrifuge.rotorLength = Lcf;
			this.currentCentrifuge.rotorVolume = rotorVolume;
			// formula 3 n = qw/Ohc
			this.amountOfDevice = Math.ceil((secondMaxFlow * 3600) / this.performance);
		}

		this.setCentrifugeResult();

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return renderCentrifugeResult(this.centrifugeResult, false);
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
					{type === CentrifugeTypes.opened
						? <div className={'count-title'}>Открытые гидроциклоны</div>
						: type === CentrifugeTypes.pressure
							? <div className={'count-title'}>Напорные гидроциклоны</div>
							: type === CentrifugeTypes.continuous
								? <div className={'count-title'}>Центрифуги непрерывного действия</div>
								: <div className={'count-title'}>Центрифуги периодического действия</div>}
					{renderToolbar(
						this.returnToScheme,
						this.goToResult,
					)}
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

export function renderCentrifugeResult(
	centrifugeResult: CentrifugeResultData,
	isGeneralResult: boolean,
) {
	if (!centrifugeResult) {
		return null;
	}
	const opened = centrifugeResult.hOpened;
	const pressure = centrifugeResult.hPressure;
	const centriguge = centrifugeResult.centrifuge;
	const openHydType = CentrifugeSource.HydrocycloneOpenTypes;
	return (
		<div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					{isGeneralResult
						? <TableRow value={
							centrifugeResult.deviceType === CentrifugeTypes.opened
								? 'Открытый гидроциклон'
								: centrifugeResult.deviceType === CentrifugeTypes.pressure
									? 'Напорный гидроциклон'
									: centrifugeResult.deviceType === CentrifugeTypes.continuous
										? 'Центрифуга непрерывного действия'
										: 'Центрифуга периодического действия'
						} label={'Тип'} />
						: null}
					{centrifugeResult.deviceType === CentrifugeTypes.opened
						? <>
							<TableRow value={opened.coefficientProportion.value} label={opened.coefficientProportion.label} />
							<TableRow value={opened.hydraulicPressure.value} label={opened.hydraulicPressure.label} />
							<TableRow value={opened.performance.value} label={opened.performance.label} />
							<TableRow value={opened.amountOfHydrocyclones.value} label={opened.amountOfHydrocyclones.label} />
							<TableRow value={opened.diameterHydrocyclone.value} label={opened.diameterHydrocyclone.label} />
							<TableRow value={opened.currentHydrocyclone.heightCylinderPart} label={'Высота цилиндрической части, м'} />
							<TableRow value={opened.currentHydrocyclone.sizeOfInPipe} label={'Размер впускного патрубка, м'} />
							<TableRow value={'Определяется по скорости входа'} label={'Размер выпускного патрубка, м'} />
							<TableRow value={opened.currentHydrocyclone.amountOfDropIn} label={'Количество впусков, шт'} />
							<TableRow value={opened.currentHydrocyclone.angleOfConusPart} label={'Угол конической части, град'} />
							<TableRow value={opened.currentHydrocyclone.angleConusDiaphragm[0] && opened.currentHydrocyclone.angleConusDiaphragm[1]
							? `${opened.currentHydrocyclone.angleConusDiaphragm[0]} - ${opened.currentHydrocyclone.angleConusDiaphragm[1]}`
							: opened.currentHydrocyclone.angleConusDiaphragm[0]
								? `${opened.currentHydrocyclone.angleConusDiaphragm[0]}`
								: opened.currentHydrocyclone.angleConusDiaphragm[1]
									? `${opened.currentHydrocyclone.angleConusDiaphragm[1]}`
									: null}
								label={'Угол конуса диафрагм, град'} />
							{centrifugeResult.openHydrocycloneType === openHydType.conusAndCylinder
								? <TableRow value={opened.currentHydrocyclone.diameterCentralHole[0]}
									label={'Диаметр центрального отверстия в диафрагме, м'} />
								: centrifugeResult.openHydrocycloneType === openHydType.highLevelCenter
									? <TableRow value={`${opened.currentHydrocyclone.diameterCentralHole[0]} -
										${opened.currentHydrocyclone.diameterCentralHole[1]}`}
										label={'Диаметр центрального отверстия в диафрагме, м'} />
									: centrifugeResult.openHydrocycloneType === openHydType.highLevelExternal
										? <TableRow value={`${opened.currentHydrocyclone.diameterCentralHole[0]} -
											${opened.currentHydrocyclone.diameterCentralHole[1]} /
											${opened.currentHydrocyclone.diameterCentralHole[2]} -
											${opened.currentHydrocyclone.diameterCentralHole[3]}`}
											label={'Диаметр центрального отверстия в диафрагме, нижней/верхней, м'} />
										: null}
							<TableRow value={opened.currentHydrocyclone.diameterInsideCylinder} label={'Диаметр внутреннего цилиндра, м'} />
							<TableRow value={opened.currentHydrocyclone.heightInsideCylinder} label={'Высота внутреннего цилиндра, м'} />
							<TableRow value={opened.currentHydrocyclone.heightWaterOutWall} label={'Высота водосливной стенки над диафрагмой, м'} />
							<TableRow value={opened.currentHydrocyclone.diameterWaterOutWall} label={'Диаметр водосливной стенки, м'} />
							<TableRow value={`${opened.currentHydrocyclone.flowSpeed[0]} -
								${opened.currentHydrocyclone.flowSpeed[1]}`}
								label={'Скорость потока на входе в аппарат, м/с'} />
						</>
						: null}
					{centrifugeResult.deviceType === CentrifugeTypes.pressure
						? <>
							<TableRow value={pressure.currentPressureHydrocyclone.mark} label={'Марка гидроциклона'} />
							<TableRow value={pressure.performance.value} label={pressure.performance.label} />
							<TableRow value={pressure.amountOfHydrocyclones.value} label={pressure.amountOfHydrocyclones.label} />
							<TableRow value={pressure.amountOfAdditionalHydrocyclones.value} label={pressure.amountOfAdditionalHydrocyclones.label} />
							<TableRow value={pressure.currentPressureHydrocyclone.diameterInPipe} label={'Диаметр питающего патрубка, м'} />
							<TableRow value={pressure.currentPressureHydrocyclone.diameterOutPipe} label={'Диаметр сливного патрубка, м'} />
							<TableRow value={pressure.currentPressureHydrocyclone.diameterSpecialPipe.map(diameter => `${diameter}`).join(',')}
								label={'Диаметр шламового патрубка, м'} />
							<TableRow value={pressure.currentPressureHydrocyclone.alpha} label={'Угол конической части, град'} />
							<TableRow value={`${pressure.currentPressureHydrocyclone.cylinderHeight[0]} -
								${pressure.currentPressureHydrocyclone.cylinderHeight[1]}`} label={'Высота цилиндрической части, м'} />
						</>
						: null}
					{centrifugeResult.deviceType === CentrifugeTypes.continuous || centrifugeResult.deviceType === CentrifugeTypes.determinate
						? <>
							<TableRow value={centriguge.currentCentrifuge.mark} label={'Марка центрифуги'} />
							<TableRow value={centriguge.performance.value} label={centriguge.performance.label} />
							<TableRow value={centriguge.amountOfCentrifuges.value} label={centriguge.amountOfCentrifuges.label} />
							<TableRow value={centriguge.currentCentrifuge.rotorDiameter} label={'Диаметр ротора, м'} />
							<TableRow value={centriguge.currentCentrifuge.rotorLength} label={'Длина ротора, м'} />
							<TableRow value={centriguge.currentCentrifuge.rotorVolume} label={'Объем ротора, м³'} />
							<TableRow value={centriguge.currentCentrifuge.separateFactor} label={'Фактор разделения'} />
						</>
						: null}
				</tbody>
			</Table>
		</div>
	);
}