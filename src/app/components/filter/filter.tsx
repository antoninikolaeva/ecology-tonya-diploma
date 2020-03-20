import * as React from 'react';
import { FilterTypes } from '../general-resources';
import { labelTemplate, NULLSTR, InputTemplate, ItemList, SelectTemplate, resetSelectToDefault } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, FilterResultData } from '../data-model';
import { FilterSource } from './filter-resource';
import { ErrorAlert } from '../error/error';

export interface FilterProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: FilterTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface FilterState {
	baseSubstanceConcentrate: number;
	finalSubstanceConcentrate: number;
	baseBPKConcentrate: number;
	finalBPKConcentrate: number;
	coefficientDrumNetsClean: number;
	periodFilterCycle: number;
	filteringSpeed: number;
	performanceFilter: number;
	coefficientIncreasePerformance: number;
	coefficientSquareBackGround: number;
	currentMicroFilterPerformance: number;
	currentDrumNetsPerformance: number;
	amountOfWaterClean: number;
	cleanWaterFlow: number;
	isValidateError: boolean;
	isResult: boolean;
}

export class FilterComponent extends React.Component<FilterProps, FilterState> {
	private baseSubstanceConcentrateRef: HTMLInputElement;
	private finalSubstanceConcentrateRef: HTMLInputElement;
	private baseBPKConcentrateRef: HTMLInputElement;
	private finalBPKConcentrateRef: HTMLInputElement;
	private coefficientDrumNetsCleanRef: HTMLInputElement;
	private filteringSpeedRef: HTMLInputElement;
	private performanceFilterRef: HTMLInputElement;
	private coefficientIncreasePerformanceRef: HTMLInputElement;
	private microFilterSpeedFilteringRef: HTMLInputElement;
	private periodFilterCycleRef: HTMLInputElement;
	private amountOfWaterCleanRef: HTMLInputElement;
	private cleanWaterFlowRef: HTMLInputElement;
	private filterTypesListRef: HTMLOptionElement[] = [];
	private periodFilterCycleListRef: HTMLOptionElement[] = [];
	private dumpDeepListRef: HTMLOptionElement[] = [];
	private necessaryMicroFiltersRef: HTMLOptionElement[] = [];
	private necessaryDrumNetsRef: HTMLOptionElement[] = [];

	private levelOfCleanSubstance: number;
	private levelOfCleanBPK: number;
	private filterTypesList: ItemList[] = [];
	private currentFilterType: FilterSource.FilterTypes;
	private isGrainy: boolean = false;
	private isSwimPressure: boolean = false;
	private isMicroFilter: boolean = false;
	private isDrumNets: boolean = false;
	private currentGrainyType: FilterSource.GrainyFilterParameters;
	private countingWaterFlow: number;
	private amountOfFilterClean: number;
	private filterSquare: number;
	private amountOfFilterSection: number;
	private filterSectionSquare: number;
	private forcedWaterSpeed: number;
	private periodFilterCycleList: ItemList[] = [
		{value: undefined, label: 'Выберите продолжительность фильтроцикла'},
		{value: 12, label: '12'},
		{value: 24, label: '24'},
	];
	private dumpDeepList: ItemList[] = [
		{value: undefined, label: 'Выберите погружение барабана на часть от диаметра'},
		{value: FilterSource.DrumDeep.coefficientFirst, label: `${FilterSource.DrumDeep.deepFirst}`},
		{value: FilterSource.DrumDeep.coefficientSecond, label: `${FilterSource.DrumDeep.deepSecond}`},
	];
	private necessaryMicroFilters: FilterSource.MicroFilter[] = [];
	private currentMicroFilter: FilterSource.MicroFilter;
	private amountOfAdditionalFilters: number;
	private dailyAmountOfWasteWater: number;
	private necessaryDrumNets: FilterSource.DrumNets[] = [];
	private currentDrumNet: FilterSource.DrumNets;

	constructor(props: FilterProps) {
		super(props);

		this.state = {
			baseSubstanceConcentrate: undefined,
			finalSubstanceConcentrate: undefined,
			baseBPKConcentrate: undefined,
			finalBPKConcentrate: undefined,
			coefficientDrumNetsClean: undefined,
			periodFilterCycle: undefined,
			filteringSpeed: undefined,
			performanceFilter: undefined,
			coefficientIncreasePerformance: undefined,
			coefficientSquareBackGround: undefined,
			currentMicroFilterPerformance: undefined,
			currentDrumNetsPerformance: undefined,
			amountOfWaterClean: undefined,
			cleanWaterFlow: undefined,
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		if (this.baseSubstanceConcentrateRef) { this.baseSubstanceConcentrateRef.value = NULLSTR; }
		if (this.finalSubstanceConcentrateRef) { this.finalSubstanceConcentrateRef.value = NULLSTR; }
		if (this.baseBPKConcentrateRef) { this.baseBPKConcentrateRef.value = NULLSTR; }
		if (this.finalBPKConcentrateRef) { this.finalBPKConcentrateRef.value = NULLSTR; }
		if (this.coefficientDrumNetsCleanRef) { this.coefficientDrumNetsCleanRef.value = NULLSTR; }
		if (this.filteringSpeedRef) { this.filteringSpeedRef.value = NULLSTR; }
		if (this.performanceFilterRef) { this.performanceFilterRef.value = NULLSTR; }
		if (this.coefficientIncreasePerformanceRef) { this.coefficientIncreasePerformanceRef.value = NULLSTR; }
		if (this.microFilterSpeedFilteringRef) { this.microFilterSpeedFilteringRef.value = NULLSTR; }
		if (this.periodFilterCycleRef) { this.periodFilterCycleRef.value = NULLSTR; }
		if (this.amountOfWaterCleanRef) { this.amountOfWaterCleanRef.value = NULLSTR; }
		if (this.cleanWaterFlowRef) { this.cleanWaterFlowRef.value = NULLSTR; }
		resetSelectToDefault(this.filterTypesListRef, this.filterTypesList);
		resetSelectToDefault(this.periodFilterCycleListRef, this.periodFilterCycleList);
		resetSelectToDefault(this.dumpDeepListRef, this.dumpDeepList);
		resetSelectToDefault(this.necessaryMicroFiltersRef, this.necessaryMicroFilters);
		resetSelectToDefault(this.necessaryMicroFiltersRef, this.necessaryMicroFilters);
		this.setState({
			baseSubstanceConcentrate: undefined,
			finalSubstanceConcentrate: undefined,
			baseBPKConcentrate: undefined,
			finalBPKConcentrate: undefined,
			coefficientDrumNetsClean: undefined,
			periodFilterCycle: undefined,
			filteringSpeed: undefined,
			performanceFilter: undefined,
			coefficientIncreasePerformance: undefined,
			coefficientSquareBackGround: undefined,
			currentMicroFilterPerformance: undefined,
			currentDrumNetsPerformance: undefined,
			amountOfWaterClean: undefined,
			cleanWaterFlow: undefined,
			isValidateError: false,
			isResult: false,
		});
	}

	private setFilterResult = () => {
		const filterResult: FilterResultData = {
		};
		dataModel.setFilterResult(filterResult);
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
		const { baseSubstanceConcentrate, baseBPKConcentrate, filteringSpeed } = this.state;
		return (
			<>
				<InputTemplate title={`Начальная концентрация взвешенных веществ в сточной воде, мг/л,
					диапазон[${FilterSource.BaseConcentrate.min} - ${FilterSource.BaseConcentrate.max}]`}
					range={{ minValue: FilterSource.BaseConcentrate.min, maxValue: FilterSource.BaseConcentrate.max }}
					placeholder={'Введите начальную концентрацию...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseSubstanceConcentrateRef = input; }}
					onInput={(value) => {
						this.selectSuitableFilterTypes();
						this.setState({ baseSubstanceConcentrate: value });
					}} />

				{baseSubstanceConcentrate
					? <InputTemplate title={`Допустимая конечная концентрация взвешенных веществ в осветленной воде, мг/л,
						диапазон[0 - ${baseSubstanceConcentrate}]`}
						range={{ minValue: 0, maxValue: baseSubstanceConcentrate }}
						placeholder={'Введите допустимую конечную концентрацию...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalSubstanceConcentrateRef = input; }}
						onInput={(value) => {
							this.selectSuitableFilterTypes();
							this.setState({ finalSubstanceConcentrate: value });
						}} />
					: null}

				<InputTemplate title={`Начальная концентрация БПКполн в сточной воде, мг/л,
					диапазон[${FilterSource.BaseConcentrate.min} - ${FilterSource.BaseConcentrate.max}]`}
					range={{ minValue: FilterSource.BaseConcentrate.min, maxValue: FilterSource.BaseConcentrate.max }}
					placeholder={'Введите начальную концентрацию...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseBPKConcentrateRef = input; }}
					onInput={(value) => {
						this.selectSuitableFilterTypes();
						this.setState({ baseBPKConcentrate: value });
					}} />

				{baseBPKConcentrate
					? <InputTemplate title={`Допустимая конечная концентрация БПКполн в осветленной воде, мг/л,
						диапазон[0 - ${baseBPKConcentrate}]`}
						range={{ minValue: 0, maxValue: baseBPKConcentrate }}
						placeholder={'Введите допустимую конечную концентрацию...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalBPKConcentrateRef = input; }}
						onInput={(value) => {
							this.selectSuitableFilterTypes(value);
							this.setState({ finalBPKConcentrate: value });
						}} />
					: null}

				{this.levelOfCleanSubstance && this.levelOfCleanBPK
					? <SelectTemplate title={'Тип фильтра'} itemList={this.filterTypesList}
						onSelect={(value) => { this.selectCurrentFilterType(value as unknown as FilterSource.FilterTypes); }}
						onSelectRef={(optionList) => { this.filterTypesListRef = optionList; }} />
					: null}

				{this.isGrainy
					? <>
						<InputTemplate title={`Коэффициент, учитывающий расход воды на промывку барабанных сеток,
						диапазон[${FilterSource.CoefficientDrumNetsClean.min} - ${FilterSource.CoefficientDrumNetsClean.max}]`}
							range={{ minValue: FilterSource.CoefficientDrumNetsClean.min, maxValue: FilterSource.CoefficientDrumNetsClean.max }}
							placeholder={'Введите коэффициент...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.coefficientDrumNetsCleanRef = input; }}
							onInput={(value) => { this.setState({ coefficientDrumNetsClean: value }); }} />

						{this.amountOfFilterSection < FilterSource.minAmountFilterSection
							? <ErrorAlert errorMessage={`Общее количество секций фильтров : ${this.amountOfFilterSection},
							должно быть не меньше : ${FilterSource.minAmountFilterSection}.`} />
							: null}

						{this.forcedWaterSpeed < this.currentGrainyType.speedForced.max
							? <ErrorAlert errorMessage={`Скорость фильтрования при форсированном режиме работы: ${this.forcedWaterSpeed},
							должно быть меньше : ${this.currentGrainyType.speedForced.max}, иначе необходимо изменить количество рабочих фильтров.`} />
							: null}
					</>
					: null}

				{this.isSwimPressure
					? <>
						<SelectTemplate title={'Период фильтроцикла, ч'} itemList={this.periodFilterCycleList}
							onSelect={(value) => { this.setState({ periodFilterCycle: value as number }); }}
							onSelectRef={(optionList) => { this.periodFilterCycleListRef = optionList; }} />

						<InputTemplate title={`Скорость фильтрирования при нормальном режиме,
							диапазон[${FilterSource.FilteringSpeedNormal.min} - ${FilterSource.FilteringSpeedNormal.max}]`}
							range={{ minValue: FilterSource.FilteringSpeedNormal.min, maxValue: FilterSource.FilteringSpeedNormal.max }}
							placeholder={'Введите скорость фильтрирования при нормальном режиме...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.filteringSpeedRef = input; }}
							onInput={(value) => { this.setState({ filteringSpeed: value }); }} />

						{this.forcedWaterSpeed < (filteringSpeed * FilterSource.performanceForcedSpeed)
							? <ErrorAlert errorMessage={`Скорость фильтрования при форсированном режиме работы: ${this.forcedWaterSpeed},
							должно быть меньше : ${filteringSpeed * FilterSource.performanceForcedSpeed},
							иначе необходимо изменить количество рабочих фильтров.`} />
							: null}
					</>
					: null}

				{this.isMicroFilter
					? <>
						<InputTemplate title={`Производительность очистной станции, м3/ч,
							диапазон[${FilterSource.minMicroFilterPerformance} - n]`}
							range={{ minValue: FilterSource.minMicroFilterPerformance, maxValue: Infinity }}
							placeholder={'Введите производительность очистной станции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.performanceFilterRef = input; }}
							onInput={(value) => {
								this.filterMictofilters();
								this.setState({ performanceFilter: value });
							}} />

						<InputTemplate title={`Коэффициент, учитывающий увеличение производительности микрофильтров,
							диапазон[${FilterSource.CoefficientIncreasePerformance.min} - ${FilterSource.CoefficientIncreasePerformance.max}]`}
							range={{ minValue: FilterSource.CoefficientIncreasePerformance.min, maxValue: FilterSource.CoefficientIncreasePerformance.max }}
							placeholder={'Введите коэффициент...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.coefficientIncreasePerformanceRef = input; }}
							onInput={(value) => {
								this.filterMictofilters();
								this.setState({ coefficientIncreasePerformance: value });
							}} />

						<SelectTemplate title={'Глубина погружения барабана, на часть от диаметра'}
							itemList={this.dumpDeepList}
							onSelect={(value) => {
								this.filterMictofilters();
								this.setState({ coefficientSquareBackGround: value as number });
							}}
							onSelectRef={(optionList) => { this.dumpDeepListRef = optionList; }} />

						<InputTemplate title={`Скорость фильтрования, м/ч,
							диапазон[${FilterSource.MicroFilterSpeedFiltering.min} - ${FilterSource.MicroFilterSpeedFiltering.max}]`}
							range={{ minValue: FilterSource.MicroFilterSpeedFiltering.min, maxValue: FilterSource.MicroFilterSpeedFiltering.max }}
							placeholder={'Введите коэффициент...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.filteringSpeedRef = input; }}
							onInput={(value) => {
								this.filterMictofilters();
								this.setState({ filteringSpeed: value });
							}} />

						<InputTemplate title={`Период работы станции в течении суток, ч, диапазон[0 - 24]`}
							range={{ minValue: 0, maxValue: 24 }}
							placeholder={'Введите период работы станции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.periodFilterCycleRef = input; }}
							onInput={(value) => {
								this.filterMictofilters(value);
								this.setState({ periodFilterCycle: value });
							}} />

						{this.necessaryMicroFilters.length > 0
							? <>
								<SelectTemplate title={'Фильтры удовлетворяющие входным параметрам'}
									itemList={this.necessaryMicroFilters}
									onSelect={(value) => { this.setState({ currentMicroFilterPerformance: value as number }); }}
									onSelectRef={(optionList) => { this.necessaryMicroFiltersRef = optionList; }} />
							</>
							: null}

					</>
					: null}

				{this.isDrumNets
				? <>
						<InputTemplate title={`Производительность очистной станции, м3/ч,
							диапазон[${FilterSource.minDrumNetsPerformance} - n]`}
							range={{ minValue: FilterSource.minDrumNetsPerformance, maxValue: Infinity }}
							placeholder={'Введите производительность очистной станции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.performanceFilterRef = input; }}
							onInput={(value) => {
								this.filterDrumNets(value);
								this.setState({ performanceFilter: value });
							}} />

						{this.necessaryDrumNets.length > 0
							? <>
								<SelectTemplate title={'Сетки удовлетворяющие входным параметрам'}
									itemList={this.necessaryDrumNets}
									onSelect={(value) => { this.setState({ currentDrumNetsPerformance: value as number }); }}
									onSelectRef={(optionList) => { this.necessaryDrumNetsRef = optionList; }} />
							</>
							: null}

						<InputTemplate title={`Количество промывок в сутки, шт,
							диапазон[${FilterSource.AmountFilterWaterClean.min} - ${FilterSource.AmountFilterWaterClean.max}]`}
							range={{ minValue: FilterSource.AmountFilterWaterClean.min, maxValue: FilterSource.AmountFilterWaterClean.max }}
							placeholder={'Введите количество промывок...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.amountOfWaterCleanRef = input; }}
							onInput={(value) => { this.setState({ amountOfWaterClean: value }); }} />

						<InputTemplate title={`Расход промывной воды, %,
							диапазон[${FilterSource.CleanWaterFlow.min} - ${FilterSource.CleanWaterFlow.max}]`}
							range={{ minValue: FilterSource.CleanWaterFlow.min, maxValue: FilterSource.CleanWaterFlow.max }}
							placeholder={'Введите расход промывной воды...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.cleanWaterFlowRef = input; }}
							onInput={(value) => { this.setState({ cleanWaterFlow: value }); }} />

				</>
			: null}

				{this.renderCheckingButton()}
			</>
		);
	}

	private selectSuitableFilterTypes = (finalBPKConcentrateNoState?: number) => {
		const { baseBPKConcentrate, baseSubstanceConcentrate, finalSubstanceConcentrate, finalBPKConcentrate } = this.state;
		const areConcentratesNotExists = !baseBPKConcentrate || !baseSubstanceConcentrate ||
			!finalSubstanceConcentrate || !(finalBPKConcentrateNoState || finalBPKConcentrate);
		if (areConcentratesNotExists) {
			return;
		}
		this.levelOfCleanSubstance = 100 * (baseSubstanceConcentrate - finalSubstanceConcentrate) / baseSubstanceConcentrate;
		if (finalBPKConcentrateNoState) {
			this.levelOfCleanBPK = 100 * (baseBPKConcentrate - finalBPKConcentrateNoState) / baseBPKConcentrate;
		} else if (finalBPKConcentrate) {
			this.levelOfCleanBPK = 100 * (baseBPKConcentrate - finalBPKConcentrate) / baseBPKConcentrate;
		}
		this.filterTypesList = [];
		this.filterTypesList.push({ value: undefined, label: 'Выберите тип фильтра' })
		FilterSource.filterTypes.forEach(filterType => {
			if (this.levelOfCleanSubstance >= this.levelOfCleanBPK) {
				if (filterType.clearEffectSubstance.min < this.levelOfCleanSubstance &&
					filterType.clearEffectSubstance.max > this.levelOfCleanSubstance) {
					this.filterTypesList.push({ value: filterType.type, label: filterType.name });
				}
			}
			if (this.levelOfCleanSubstance < this.levelOfCleanBPK) {
				if (filterType.clearEffectBPK.min < this.levelOfCleanBPK && filterType.clearEffectBPK.max > this.levelOfCleanBPK) {
					this.filterTypesList.push({ value: filterType.type, label: filterType.name });
				}
			}
		});
	}

	private selectCurrentFilterType = (filterType: FilterSource.FilterTypes) => {
		this.isGrainy = filterType === FilterSource.FilterTypes.grainyOneLayerUpThread ||
			filterType === FilterSource.FilterTypes.grainyHugeOneLayerDownThread ||
			filterType === FilterSource.FilterTypes.grainyLittleOneLayerDownThread ||
			filterType === FilterSource.FilterTypes.grainyTwoLayers ||
			filterType === FilterSource.FilterTypes.grainyCarcase ||
			filterType === FilterSource.FilterTypes.grainyAerated;
		this.isSwimPressure = filterType === FilterSource.FilterTypes.swimPressure;
		this.isMicroFilter = filterType === FilterSource.FilterTypes.microFilter;
		this.isDrumNets = filterType === FilterSource.FilterTypes.drumNets;
		this.currentFilterType = filterType;
	}

	private filterMictofilters = (periodFilterCycleNoState?: number) => {
		const {
			periodFilterCycle, filteringSpeed, coefficientIncreasePerformance,
			coefficientSquareBackGround, performanceFilter
		} = this.state;
		const period = periodFilterCycleNoState || periodFilterCycle;
		const areParametersExist = period && filteringSpeed && coefficientIncreasePerformance &&
			coefficientSquareBackGround && performanceFilter;
		if (!areParametersExist) {
			return;
		}
		// formula 8 Fmf = (k1 * Q) / (k2 * T * vf)
		this.filterSquare = (coefficientIncreasePerformance * performanceFilter) /
			(coefficientSquareBackGround * period * filteringSpeed);
		this.necessaryMicroFilters = FilterSource.microFilters.filter(filter => {
			const amountOfFilter = Math.ceil(this.filterSquare / filter.square);
			const maxPerformance = filter.performance * amountOfFilter;
			return maxPerformance > performanceFilter && amountOfFilter > 1;
		});
	}

	private filterDrumNets = (performanceFilter: number) => {
		this.necessaryDrumNets = FilterSource.drumNets.filter(drumNet => {
			const amountOfFilters = Math.ceil(performanceFilter / drumNet.performance);
			return amountOfFilters > 1;
		});
	}

	private isInputReadyToCounting = (): boolean => {
		return true;
	}

	private resultCounting = () => {
		const { secondMaxFlow, type, dailyWaterFlow } = this.props;
		const {
			coefficientDrumNetsClean, periodFilterCycle, filteringSpeed,
			currentMicroFilterPerformance, performanceFilter, currentDrumNetsPerformance,
			amountOfWaterClean, cleanWaterFlow,
		} = this.state;

		if (this.isGrainy) {
			// formula 1 Qf = 20.4 * qw; qw = qmax * 3600 (1 hour)
			this.countingWaterFlow = 20.4 * (secondMaxFlow * 3600);
			this.currentGrainyType = FilterSource.grainyFilters.find(filter => filter.type === this.currentFilterType);
			// formula 2 n = 24 / Tf;
			this.amountOfFilterClean = 24 / this.currentGrainyType.periodFilterCycle;
			// formula 3 Ff = (Qf * (1 + m)) / (vf * (T - n * t4/60) - 0.06 * n * (w1 * t1 + w2 * t2 + w3 * t3))
			// always take a middle value from diapason
			const vf = (this.currentGrainyType.speedNormal.max - this.currentGrainyType.speedNormal.min) / 2;
			const w1 = (this.currentGrainyType.intensiveFirst.max - this.currentGrainyType.intensiveFirst.min) / 2;
			const w2 = (this.currentGrainyType.intensiveSecond.max - this.currentGrainyType.intensiveSecond.min) / 2;
			const w3 = (this.currentGrainyType.intensiveThird.max - this.currentGrainyType.intensiveThird.min) / 2;
			const t1 = (this.currentGrainyType.periodFirst.max - this.currentGrainyType.periodFirst.min) / 2;
			const t2 = (this.currentGrainyType.periodSecond.max - this.currentGrainyType.periodSecond.min) / 2;
			const t3 = (this.currentGrainyType.periodThird.max - this.currentGrainyType.periodThird.min) / 2;
			this.filterSquare = (this.countingWaterFlow * (1 + coefficientDrumNetsClean)) /
				(vf * (this.currentGrainyType.periodFilterCycle - this.amountOfFilterClean * (FilterSource.stayPeriodToClean / 60)) -
					0.06 * this.amountOfFilterClean * (w1 * t1 + w2 * t2 + w3 * t3));
			// formula 4 N = 0.5 * sqrt(Ff);
			this.amountOfFilterSection = 0.5 * Math.sqrt(this.filterSquare);
			// formula 5 F1 = Ff / N
			this.filterSectionSquare = this.filterSquare / this.amountOfFilterSection;
			// formula 6 vff = vf * N / (N - Np)
			this.amountOfAdditionalFilters = this.amountOfFilterSection === FilterSource.minAmountFilterSection
				? 1 : this.amountOfFilterSection > FilterSource.minAmountFilterSection
					? (this.amountOfFilterSection - FilterSource.minAmountFilterSection) : 0;
			this.forcedWaterSpeed = (vf * this.amountOfFilterSection) /
				(this.amountOfFilterSection - this.amountOfAdditionalFilters);
		}

		if (this.isSwimPressure) {
			// formula 1 Qf = 20.4 * qw; qw = qmax * 3600 (1 hour)
			this.countingWaterFlow = 20.4 * (secondMaxFlow * 3600);
			// formula 2 n = 24 / Tf;
			this.amountOfFilterClean = 24 / periodFilterCycle;
			// formula 7 Ff = Qf * 24 / vf
			this.filterSquare = (this.countingWaterFlow * 24) / filteringSpeed;
			// formula 4 N = 0.5 * sqrt(Ff);
			this.amountOfFilterSection = 0.5 * Math.sqrt(this.filterSquare);
			// formula 5 F1 = Ff / N
			this.filterSectionSquare = this.filterSquare / this.amountOfFilterSection;
			// formula 6 vff = vf * N / (N - Np)
			this.amountOfAdditionalFilters = this.amountOfFilterSection === FilterSource.minAmountFilterSection
				? 1 : this.amountOfFilterSection > FilterSource.minAmountFilterSection
					? (this.amountOfFilterSection - FilterSource.minAmountFilterSection) : 0;
			this.forcedWaterSpeed = (filteringSpeed * this.amountOfFilterSection) /
				(this.amountOfFilterSection - this.amountOfAdditionalFilters);
		}

		if (this.isMicroFilter) {
			this.currentMicroFilter = FilterSource.microFilters.find(filter =>
				filter.performance === currentMicroFilterPerformance);
			this.amountOfFilterSection = Math.ceil(performanceFilter / this.currentMicroFilter.performance);
			this.amountOfAdditionalFilters = this.amountOfFilterSection < FilterSource.minAmountFilterSection ? 1 : 2;
			this.dailyAmountOfWasteWater = 0.035 * performanceFilter;
		}

		if (this.isDrumNets) {
			this.currentDrumNet = FilterSource.drumNets.find(drumNet => drumNet.performance === currentDrumNetsPerformance);
			this.amountOfFilterSection = Math.ceil(performanceFilter / this.currentDrumNet.performance);
			this.amountOfAdditionalFilters = this.amountOfFilterSection < FilterSource.minAmountDrumNetsSection ? 1 : 2;
			this.dailyAmountOfWasteWater = amountOfWaterClean * FilterSource.periodOfWaterClean * cleanWaterFlow * performanceFilter / 144000;
		}

		this.setFilterResult();

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return (
			<div className={'table-result'}>
				<Table bordered hover>
					<tbody>
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
					<div className={'count-title'}>Типовой фильтр</div>
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
