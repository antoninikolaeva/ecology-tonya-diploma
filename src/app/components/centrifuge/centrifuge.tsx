import * as React from 'react';
import { CentrifugeTypes } from '../general-resources';
import { labelTemplate, resetSelectToDefault, NULLSTR, ItemList, SelectTemplate, InputTemplate } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, CentrifugeResultData } from '../data-model';
import { CentrifugeSource } from './centrifuge-resource';

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
	private necessaryPressureHydrocyclone: CentrifugeSource.PressureHydrocycloneTable[] = [];
	private currentPressureHydrocyclone: CentrifugeSource.PressureHydrocycloneTable;
	private amountOfAdditionalDevice: number;
	private currentCentrifuge: CentrifugeSource.CentrifugeTable;

	private openHydrocycloneList: ItemList[] = [
		{value: undefined, label: 'Выберите тип открытого гидроциклона'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.withoutDevice, label: 'Без внутренних устройств'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.conusAndCylinder, label: 'С конической диафрагмой и внутренним цилиндром'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.highLevelCenter, label: 'Многоярусные с центральным выпуском'},
		{value: CentrifugeSource.HydrocycloneOpenTypes.highLevelExternal, label: 'Многоярусные с периферийным отводом воды'},
	];

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
		resetSelectToDefault(this.pressureHydrocycloneRef, this.necessaryPressureHydrocyclone);
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
		const centrifugeResult: CentrifugeResultData = {
		};
		dataModel.setCentrifugeResult(centrifugeResult);
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

						{this.necessaryPressureHydrocyclone.length > 0
							? <SelectTemplate title={'Выбор типа открытого гидроциклона'} itemList={this.necessaryPressureHydrocyclone}
									onSelect={(value) => {
									this.currentPressureHydrocyclone = this.necessaryPressureHydrocyclone.find(device =>
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
									? CentrifugeSource.centrifugeTableContinuous.find(device => device.rotorVolume === value as number)
									: CentrifugeSource.centrifugeTableDeterminate.find(device => device.rotorVolume === value as number);
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

				{this.renderCheckingButton()}
			</>
		);
	}

	private isInputReadyToCounting = (): boolean => {
		const {type} = this.props;
		const {
			amountOfLayer, coefficientCentrifugeVolume, currentOpenHydrocycloneType,
			diameterCentralHole, diameterHydrocyclone, hydraulicHugest,
			periodCentrifugeWorks
		} = this.state;
		const isOpenHydrocyclone = amountOfLayer && currentOpenHydrocycloneType && diameterCentralHole &&
			diameterHydrocyclone && hydraulicHugest ? true : false;
		const isPressureHydrocyclone = hydraulicHugest ? true : false;
		const isCentrifuge = periodCentrifugeWorks && coefficientCentrifugeVolume ? true : false;
		if (type === CentrifugeTypes.opened) {
			return isOpenHydrocyclone;
		}
		if (type === CentrifugeTypes.pressure) {
			return isPressureHydrocyclone;
		}
		if (type === CentrifugeTypes.continuous || type === CentrifugeTypes.determinate) {
			return isCentrifuge;
		}
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
		this.necessaryPressureHydrocyclone = CentrifugeSource.pressureHydrocycloneTable.filter(device =>
			device.particleHugest.min < hydraulicHugest && device.particleHugest.max > hydraulicHugest);
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
				this.coefficientProportion = (1.5 * amountOfLayer * (Math.pow(diameterHydrocyclone, 2) - Math.pow(diameterCentralHole, 2))) /
					Math.pow(diameterHydrocyclone, 2);
			}
			// formula 2 qhc = 3.6 * Khc * u0
			this.hydraulicPressure = 3.6 * this.coefficientProportion * hydraulicHugest;
			// formula 3 Qhc = 0.785 * qhc * Dhc^2
			this.performance = 0.785 * this.hydraulicPressure * Math.pow(diameterHydrocyclone, 2);
			// formula 3 n = qw/Ohc
			this.amountOfDevice = Math.ceil((secondMaxFlow * 3600) / this.performance);
		}

		if (type === CentrifugeTypes.pressure) {
			if (this.currentPressureHydrocyclone) {
				const HCP = this.currentPressureHydrocyclone;
				// formula 4 Qhc = 9.58 * 10^-3 * den * dex * sqrt(g * deltaP)
				this.performance = 9.58 * Math.pow(10, -3) * HCP.diameterInPipe * HCP.diameterOutPipe *
					Math.sqrt(CentrifugeSource.gravityAcceleration * HCP.deltaP);
				// formula 3 n = qw/Ohc
				this.amountOfDevice = Math.ceil((secondMaxFlow * 3600) / this.performance);
				this.amountOfAdditionalDevice = this.amountOfDevice <= 10 ? 1 : this.amountOfDevice <= 15 ? 2 : Math.ceil(this.amountOfDevice / 10);
			}
		}

		if (type === CentrifugeTypes.continuous || type === CentrifugeTypes.determinate) {
			// formula 5 Qcf = 3600 * Wcf * Kcf / tcf
			this.performance = (3600 * this.currentCentrifuge.rotorVolume * coefficientCentrifugeVolume) / periodCentrifugeWorks;
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
		const {type} = this.props;
		return (
			<div className={'table-result'}>
				<Table bordered hover>
					<tbody>
						{type === CentrifugeTypes.opened
							? <>
								<tr><td>Коэффициент пропорциональности</td>
									<td>{this.coefficientProportion ? this.coefficientProportion.toFixed(3) : undefined}</td></tr>
								<tr><td>Удельная гидравлическая нагрузка, м3/(м2/ч)</td>
									<td>{this.hydraulicPressure ? this.hydraulicPressure.toFixed(3) : undefined}</td></tr>
								<tr><td>Производительность гидроциклона, м3/ч</td>
									<td>{this.performance ? this.performance.toFixed(3) : undefined}</td></tr>
								<tr><td>Количество рабочих гидроциклонов, шт</td>
									<td>{this.amountOfDevice ? this.amountOfDevice : undefined}</td></tr>
							</>
							: null}
						{type === CentrifugeTypes.pressure
							? <>
								<tr><td>Марка гидроциклона</td>
									<td>{this.currentPressureHydrocyclone ? this.currentPressureHydrocyclone.mark : undefined}</td></tr>
								<tr><td>Производительность гидроциклона, м3/ч</td>
									<td>{this.performance ? this.performance.toFixed(3) : undefined}</td></tr>
								<tr><td>Количество рабочих гидроциклонов, шт</td>
									<td>{this.amountOfDevice ? this.amountOfDevice : undefined}</td></tr>
								<tr><td>Количество резервных гидроциклонов, шт</td>
									<td>{this.amountOfAdditionalDevice ? this.amountOfAdditionalDevice : undefined}</td></tr>
							</>
							: null}
						{type === CentrifugeTypes.continuous || type === CentrifugeTypes.determinate
							? <>
								<tr><td>Марка центрифуги</td>
									<td>{this.currentCentrifuge ? this.currentCentrifuge.mark : undefined}</td></tr>
								<tr><td>Производительность центрифуги, м3/ч</td>
									<td>{this.performance ? this.performance.toFixed(3) : undefined}</td></tr>
								<tr><td>Количество рабочих центрифуг, шт</td>
									<td>{this.amountOfDevice ? this.amountOfDevice : undefined}</td></tr>
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
				title={'Cводная схема очитных сооружений'}>
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
					{type === CentrifugeTypes.opened
						? <div className={'count-title'}>Открытые гидроциклоны</div>
						: type === CentrifugeTypes.pressure
							? <div className={'count-title'}>Напорные гидроциклоны</div>
							: type === CentrifugeTypes.continuous
								? <div className={'count-title'}>Центрифуги непрерывного действия</div>
								: <div className={'count-title'}>Центрифуги периодического действия</div>}
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
