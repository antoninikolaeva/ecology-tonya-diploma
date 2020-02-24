import * as React from 'react';
import { SandTrapTypes } from '../general-resources';
import { InputTemplate, labelTemplate, SelectTemplate, ItemList } from '../utils';
import {
	HydraulicFinenessSand,
	hydraulicFinenessSandList,
	CoefficientOfSandTrapLength,
	SandTrapDeep,
	minSpeedFlowLimit,
	maxSpeedFlowLimit,
	minWaterFlowPeriod,
	AmountOfBlockedSand,
	minPeriodRemoveSediment,
	maxPeriodRemoveSediment,
	coefficientDispersionOfSediment,
} from './sandTrap-resources';
import { ErrorAlert } from '../error/error';
import { SourceOfWasteWater } from '../grate/grate-resources';
import { Table } from 'react-bootstrap';

export interface SandTrapProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: SandTrapTypes;
}

export interface SandTrapState {
	squareOneCompartmentOfSandTrap: number;
	speedOfWaterFlow: number;
	hydraulicFinenessSand: number;
	coefficientOfSandTrapLength: number;
	sandTrapDeep: number;
	secondMinFlow: number;
	sourceWaterList: SourceOfWasteWater;
	population: number;
	dailyVolumeOfSediment: number;
	periodRemoveSediment: number;
	isValidateError: boolean;
}

export class SandTrapComponent extends React.Component<SandTrapProps, SandTrapState> {
	private speedOfWaterFlowRef: HTMLInputElement;
	private sandTrapDeepRef: HTMLInputElement;
	private secondMinFlowRef: HTMLInputElement;
	private populationRef: HTMLInputElement;
	private dailyVolumeOfSedimentRef: HTMLInputElement;
	private coefficientOfSandTrapLengthRef: HTMLOptionElement[] = [];
	private sourceWaterListRef: HTMLOptionElement[] = [];
	private amountOfSandTrapSection: number;
	private lengthOfSandTrap: number;
	private widthOfSandTrap: number;
	private minSpeedFlow: number;
	private maxSpeedFlow: number;
	private waterFlowPeriod: number;
	private volumeOfSandTrapSection: number;
	private deepSandTrapSection: number;
	private heightSedimentLayout: number;
	private fullSandTrapHeight: number;

	constructor(props: SandTrapProps) {
		super(props);

		this.state = {
			squareOneCompartmentOfSandTrap: undefined,
			speedOfWaterFlow: undefined,
			hydraulicFinenessSand: undefined,
			coefficientOfSandTrapLength: undefined,
			sandTrapDeep: undefined,
			secondMinFlow: undefined,
			sourceWaterList: undefined,
			population: undefined,
			dailyVolumeOfSediment: undefined,
			periodRemoveSediment: undefined,
			isValidateError: false,
		};
	}

	private renderBaseData = () => {
		const {secondMaxFlow, dailyWaterFlow} = this.props;
		return <div>
			<div className={'input-data-title'}>Входные данные</div>
			{labelTemplate('Секундный максимальный расход', secondMaxFlow)}
			{labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
		</div>;
	}

	// Horizontal forward water move compartment
	private horizontalForwardWaterMove = () => {
		this.defineAmountOfSandTrapSection();
		return <div>
			<InputTemplate title={'Скорость течения воды, м/c'}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				onInputRef={(input) => { this.speedOfWaterFlowRef = input; }}
				onInput={(value) => { this.squareOneCompartmentOfSandTrap(value); }} />
				{this.sandTrapLength()}
				{this.widthOfSandTrapCount()}
				{this.minMaxSpeedOfWater()}
				{(this.minSpeedFlow < minSpeedFlowLimit || this.minSpeedFlow > maxSpeedFlowLimit) ||
				 (this.maxSpeedFlow < minSpeedFlowLimit || this.maxSpeedFlow > maxSpeedFlowLimit) ?
					<ErrorAlert errorMessage={`Скорость течения сточных вод при максимальном или минимальном притоке неудовлетворительна:
						минимальный приток - ${minSpeedFlowLimit} < ${this.minSpeedFlow} < ${maxSpeedFlowLimit} или
						максимальный приток ${minSpeedFlowLimit} < ${this.maxSpeedFlow} < ${maxSpeedFlowLimit}`} /> : null}
				{this.waterFlowPeriodCount()}
				{(this.waterFlowPeriod < minWaterFlowPeriod) ?
					<ErrorAlert errorMessage={`Продолжительность потока сточных вод неудовлетворительна:
						${this.waterFlowPeriod} < ${minWaterFlowPeriod}`} /> : null}
				{this.dailyVolumeOfSedimentCount()}
				{this.volumeOfSandTrapSectionSelect()}
				{this.deepSandTrapSectionCount()}
				{this.heightSedimentLayoutCount()}
				{this.fullSandTrapHeightCount()}
		</div>;
	}

	private defineAmountOfSandTrapSection = () => {
		const { dailyWaterFlow } = this.props;
		this.amountOfSandTrapSection = dailyWaterFlow / 40000;
		this.amountOfSandTrapSection = this.amountOfSandTrapSection < 2 ? 2 : Math.round(this.amountOfSandTrapSection);
	}

	private squareOneCompartmentOfSandTrap = (speedOfWaterFlow: number) => {
		const { secondMaxFlow } = this.props;
		const { secondMinFlow } = this.state;
		const squareOneCompartmentOfSandTrap = secondMaxFlow / (this.amountOfSandTrapSection * speedOfWaterFlow);
		if (this.minSpeedFlow && this.maxSpeedFlow) {
			this.minMaxSpeedOfWaterCheck(secondMinFlow);
		}
		this.setState({squareOneCompartmentOfSandTrap, speedOfWaterFlow});
	}

	private sandTrapLength = () => {
		const {type} = this.props;
		const minDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle ?
			SandTrapDeep.horizontalMin : type === SandTrapTypes.aerated ? SandTrapDeep.aeratedMin : SandTrapDeep.tangential;
		const maxDeep = type === SandTrapTypes.horizontalForward || type === SandTrapTypes.horizontalCircle ?
			SandTrapDeep.horizontalMax : type === SandTrapTypes.aerated ? SandTrapDeep.aeratedMax : SandTrapDeep.tangential;
		const hydraulicFinenessSand: ItemList[] = hydraulicFinenessSandList.map(fineness => {
			return { value: fineness, label: `${fineness}` };
		});
		hydraulicFinenessSand.unshift({value: undefined, label: 'Выберите гидровлическую крупность песка'});
		return <div>
			<SelectTemplate title={'Выбор гидровлической крупности песка, мм/с'} itemList={hydraulicFinenessSand}
				onSelect={(value) => this.coefficientOfSandTrapLength(value)}
				onSelectRef={(optionList) => { this.coefficientOfSandTrapLengthRef = optionList; }} />
			<InputTemplate title={`Глубина песколовки, м/c, диапазон [${minDeep} - ${maxDeep}]`}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: minDeep, maxValue: maxDeep }}
				onInputRef={(input) => { this.sandTrapDeepRef = input; }}
				onInput={(value) => { this.countSandTrapLength(value); }} />
		</div>;
	}

	private coefficientOfSandTrapLength = (hydraulicFinenessSand: string | number) => {
		const coefficientOfSandTrapLength = hydraulicFinenessSand === HydraulicFinenessSand.middle ?
			CoefficientOfSandTrapLength.middle :
			CoefficientOfSandTrapLength.high;
		this.setState({hydraulicFinenessSand: (hydraulicFinenessSand as number),
			coefficientOfSandTrapLength: (coefficientOfSandTrapLength as number)});
	}

	private countSandTrapLength = (sandTrapDeep: number) => {
		const {coefficientOfSandTrapLength, hydraulicFinenessSand, speedOfWaterFlow} = this.state;
		this.lengthOfSandTrap = 1000 * coefficientOfSandTrapLength * sandTrapDeep * speedOfWaterFlow / hydraulicFinenessSand;
		this.setState({sandTrapDeep});
	}

	private widthOfSandTrapCount = () => {
		const {squareOneCompartmentOfSandTrap, sandTrapDeep} = this.state;
		this.widthOfSandTrap = squareOneCompartmentOfSandTrap / sandTrapDeep;
	}

	private minMaxSpeedOfWater = () => {
		const {secondMaxFlow} = this.props;
		return <div>
			<InputTemplate title={`Минимальный секундный расход сточных вод, м3/c, диапазон [0 - ${secondMaxFlow}]`}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: 0, maxValue: secondMaxFlow }}
				onInputRef={(input) => { this.secondMinFlowRef = input; }}
				onInput={(value) => { this.minMaxSpeedOfWaterCheck(value); }} />
		</div>;
	}

	private minMaxSpeedOfWaterCheck = (secondMinFlow: number) => {
		const {secondMaxFlow} = this.props;
		const {sandTrapDeep} = this.state;
		this.minSpeedFlow = secondMinFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
		this.maxSpeedFlow = secondMaxFlow / (this.widthOfSandTrap * this.amountOfSandTrapSection * sandTrapDeep);
		this.setState({secondMinFlow});
	}

	private waterFlowPeriodCount = () => {
		this.waterFlowPeriod = this.lengthOfSandTrap / this.maxSpeedFlow;
	}

	private dailyVolumeOfSedimentCount = () => {
		const {sourceWaterList} = this.state;
		const selectSourceWaterList: ItemList[] = [
			{ value: undefined, label: 'Выберите источник сточных вод' },
			{ value: SourceOfWasteWater.manufacture, label: 'Производсвенный сток' },
			{ value: SourceOfWasteWater.city, label: 'Городской сток' },
		];
		return <div>
			<SelectTemplate title={'Выбор источника сточных вод'} itemList={selectSourceWaterList}
				onSelect={(value) => this.selectSourceWaterList(value)}
				onSelectRef={(optionList) => { this.sourceWaterListRef = optionList; }} />
			{sourceWaterList === SourceOfWasteWater.city ?
				<InputTemplate title={`Население, чел.`}
					placeholder={''}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.populationRef = input; }}
					onInput={(value) => { this.dailyVolumeOfSedimentCity(value); }} /> :
				<InputTemplate title={`Суточный объем осадкаб накапливающийся в песколовках, м3/сут.`}
					placeholder={''}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.dailyVolumeOfSedimentRef = input; }}
					onInput={(value) => { this.setState({dailyVolumeOfSediment: value}); }} />
			}
		</div>;
	}

	private selectSourceWaterList = (sourceWaterList: string | number) => {
		this.setState({sourceWaterList: sourceWaterList as SourceOfWasteWater});
	}

	private dailyVolumeOfSedimentCity = (population: number) => {
		const { type } = this.props;
		const amountOfBlockedSand = type === SandTrapTypes.horizontalCircle ||
			type === SandTrapTypes.horizontalForward ||
			type === SandTrapTypes.tangential ?
				AmountOfBlockedSand.horizontalAndTangential :
				AmountOfBlockedSand.aerated;
		const dailyVolumeOfSediment = population * amountOfBlockedSand / 1000;
		this.setState({population, dailyVolumeOfSediment});
	}

	private volumeOfSandTrapSectionSelect = () => {
		return <div>
			<InputTemplate title={`Интервал времени между выгрузками осадка из песколовки, сут,
				диапазон [${minPeriodRemoveSediment} - ${maxPeriodRemoveSediment}]`}
				placeholder={''}
				onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
				range={{ minValue: minPeriodRemoveSediment, maxValue: maxPeriodRemoveSediment }}
				onInputRef={(input) => { this.sandTrapDeepRef = input; }}
				onInput={(value) => { this.volumeOfSandTrapSectionCount(value); }} />
		</div>;
	}

	private volumeOfSandTrapSectionCount = (periodRemoveSediment: number) => {
		const { dailyVolumeOfSediment } = this.state;
		this.volumeOfSandTrapSection = dailyVolumeOfSediment * periodRemoveSediment / this.amountOfSandTrapSection;
		this.setState({periodRemoveSediment});
	}

	private deepSandTrapSectionCount = () => {
		this.deepSandTrapSection = this.volumeOfSandTrapSection / Math.pow(this.widthOfSandTrap, 2);
	}

	private heightSedimentLayoutCount = () => {
		const { dailyVolumeOfSediment } = this.state;
		this.heightSedimentLayout = (coefficientDispersionOfSediment * dailyVolumeOfSediment) /
			(this.widthOfSandTrap * this.amountOfSandTrapSection * this.lengthOfSandTrap);
	}

	private fullSandTrapHeightCount = () => {
		const { sandTrapDeep } = this.state;
		this.fullSandTrapHeight = sandTrapDeep + this.heightSedimentLayout + 0.5;
	}

	private renderResult = () => {
		const { squareOneCompartmentOfSandTrap, dailyVolumeOfSediment} = this.state;
		if (!this.checkResultDataExists()) {
			return;
		}
		return <div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					<tr>
						<td>Необходимая площадь живого сечения одного отделения песколовки, м2</td>
						<td>{squareOneCompartmentOfSandTrap.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Длина песколовки, м</td>
						<td>{this.lengthOfSandTrap.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Ширина одного отделения песколовки, м</td>
						<td>{this.widthOfSandTrap.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Скорость течения сточных вод в песколовке при минимальном притоке, м/с</td>
						<td>{this.minSpeedFlow.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Скорость течения сточных вод в песколовке при максимальном притоке, м/с</td>
						<td>{this.maxSpeedFlow.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Продолжительность протекания сточных вод, с</td>
						<td>{this.waterFlowPeriod.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Суточный объем осадка накапливаемого в песколовках, м3/сут.</td>
						<td>{dailyVolumeOfSediment.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Объем бункера одного отделения песколовки, м3</td>
						<td>{this.volumeOfSandTrapSection.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Глубина бункера песколовки, м</td>
						<td>{this.deepSandTrapSection.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Высота слоя осадка на дне песколовки, м</td>
						<td>{this.heightSedimentLayout.toFixed(3)}</td>
					</tr>
					<tr>
						<td>Полная строительная высота песколовки, м</td>
						<td>{this.fullSandTrapHeight.toFixed(3)}</td>
					</tr>
				</tbody>
			</Table>
		</div>;
	}

	private checkResultDataExists = (): boolean => {
		const { squareOneCompartmentOfSandTrap, dailyVolumeOfSediment} = this.state;
		if (squareOneCompartmentOfSandTrap &&
				dailyVolumeOfSediment &&
				this.lengthOfSandTrap &&
				this.widthOfSandTrap &&
				this.minSpeedFlow &&
				this.maxSpeedFlow &&
				this.waterFlowPeriod &&
				dailyVolumeOfSediment &&
				this.volumeOfSandTrapSection &&
				this.deepSandTrapSection &&
				this.heightSedimentLayout &&
				this.fullSandTrapHeight
			) {
				return true;
			} else {
				return false;
			}
	}

	render() {
		const {type} = this.props;
		return <div>
			<div className={'title-container'}>
			{type === SandTrapTypes.horizontalForward ?
				<div className={'count-title'}>Горизонтальные с прямолинейным движением воды</div> :
				type === SandTrapTypes.horizontalCircle ?
					<div className={'count-title'}>Горизонтальные с круговым движением воды</div> :
					type === SandTrapTypes.vertical ?
						<div className={'count-title'}>Вертикальные</div> :
						type === SandTrapTypes.tangential ?
							<div className={'count-title'}>Тангенциальные</div> :
							<div className={'count-title'}>Аэрируемые</div>}
			</div>
			<div className={'device-container'}>
				<div className={'device-input'}>
					{this.renderBaseData()}
					{this.horizontalForwardWaterMove()}
				</div>
				<div className={'device-result'}>
					<div className={'input-data-title'}>Результаты расчета</div>
						{this.renderResult()}
				</div>
			</div>
		</div>;
	}
}
