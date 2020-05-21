import * as React from 'react';
import { FilterTypes, KindOfDevices } from '../general-resources';
import {
	labelTemplate, NULLSTR, InputTemplate, ItemList, SelectTemplate, resetSelectToDefault, TableRow
} from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, FilterResultData } from '../data-model';
import { FilterSource } from './filter-resource';
import { ErrorAlert } from '../error/error';
import { renderCheckingButton, renderToolbar } from '../grate/grate';

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
	coefficientIncreasePerformance: number;
	coefficientSquareBackGround: number;
	currentMicroFilterPerformance: number;
	currentDrumNetsPerformance: number;
	amountOfWaterClean: number;
	cleanWaterFlow: number;
	grainyCleanType: FilterSource.TypeOfCleanGrainyFilter;
	workStationPeriod: number;
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
	private coefficientIncreasePerformanceRef: HTMLInputElement;
	private microFilterSpeedFilteringRef: HTMLInputElement;
	private periodFilterCycleRef: HTMLInputElement;
	private amountOfWaterCleanRef: HTMLInputElement;
	private cleanWaterFlowRef: HTMLInputElement;
	private workStationPeriodRef: HTMLInputElement;
	private filterTypesListRef: HTMLOptionElement[] = [];
	private periodFilterCycleListRef: HTMLOptionElement[] = [];
	private dumpDeepListRef: HTMLOptionElement[] = [];
	private necessaryMicroFiltersRef: HTMLOptionElement[] = [];
	private necessaryDrumNetsRef: HTMLOptionElement[] = [];
	private typeOfCleanGrainyFilterListRef: HTMLOptionElement[] = [];

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
	private typeOfCleanGrainyFilterList: ItemList[] = [
		{value: undefined, label: 'Выберите способ промывки фильтров с зернистой нагрузкой'},
		{value: FilterSource.TypeOfCleanGrainyFilter.air, label: `Воздух`},
		{value: FilterSource.TypeOfCleanGrainyFilter.airAndWater, label: `Воздух и вода`},
		{value: FilterSource.TypeOfCleanGrainyFilter.water, label: `Вода`},
	];
	private necessaryMicroFilters: FilterSource.MicroFilter[] = [];
	private currentMicroFilter: FilterSource.MicroFilter;
	private amountOfAdditionalFilters: number;
	private dailyAmountOfWasteWater: number;
	private necessaryDrumNets: FilterSource.DrumNets[] = [];
	private currentDrumNet: FilterSource.DrumNets;

	private filterResult: FilterResultData;

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
			coefficientIncreasePerformance: undefined,
			coefficientSquareBackGround: undefined,
			currentMicroFilterPerformance: undefined,
			currentDrumNetsPerformance: undefined,
			amountOfWaterClean: undefined,
			cleanWaterFlow: undefined,
			grainyCleanType: undefined,
			workStationPeriod: undefined,
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
		if (this.coefficientIncreasePerformanceRef) { this.coefficientIncreasePerformanceRef.value = NULLSTR; }
		if (this.microFilterSpeedFilteringRef) { this.microFilterSpeedFilteringRef.value = NULLSTR; }
		if (this.periodFilterCycleRef) { this.periodFilterCycleRef.value = NULLSTR; }
		if (this.amountOfWaterCleanRef) { this.amountOfWaterCleanRef.value = NULLSTR; }
		if (this.cleanWaterFlowRef) { this.cleanWaterFlowRef.value = NULLSTR; }
		if (this.workStationPeriodRef) { this.workStationPeriodRef.value = NULLSTR; }
		resetSelectToDefault(this.filterTypesListRef, this.filterTypesList);
		resetSelectToDefault(this.periodFilterCycleListRef, this.periodFilterCycleList);
		resetSelectToDefault(this.dumpDeepListRef, this.dumpDeepList);
		resetSelectToDefault(this.necessaryMicroFiltersRef, this.necessaryMicroFilters);
		resetSelectToDefault(this.necessaryDrumNetsRef, []);
		resetSelectToDefault(this.typeOfCleanGrainyFilterListRef, this.typeOfCleanGrainyFilterList);
		this.setState({
			baseSubstanceConcentrate: undefined,
			finalSubstanceConcentrate: undefined,
			baseBPKConcentrate: undefined,
			finalBPKConcentrate: undefined,
			coefficientDrumNetsClean: undefined,
			periodFilterCycle: undefined,
			filteringSpeed: undefined,
			coefficientIncreasePerformance: undefined,
			coefficientSquareBackGround: undefined,
			currentMicroFilterPerformance: undefined,
			currentDrumNetsPerformance: undefined,
			amountOfWaterClean: undefined,
			cleanWaterFlow: undefined,
			grainyCleanType: undefined,
			workStationPeriod: undefined,
			isValidateError: false,
			isResult: false,
		});
		this.isGrainy = false;
		this.isSwimPressure = false;
		this.isMicroFilter = false;
		this.isDrumNets = false;
	}

	private setFilterResult = (
		onlyGrainy?: {
			t1: number; t2: number; t3: number;
			w1: number; w2: number; w3: number;
		},
		waterSpeed?: number,
		filterCyclePeriod?: number,
	) => {
		this.filterResult = {
			type: KindOfDevices.filter,
			complete: true,
			deviceType: this.isGrainy
			? FilterSource.FilterGlobalTypes.grainy
			: this.isSwimPressure
				? FilterSource.FilterGlobalTypes.swimLoad
				: this.isMicroFilter
					? FilterSource.FilterGlobalTypes.microFilter
					: FilterSource.FilterGlobalTypes.drumNets,
			levelOfBPKClean: {
				value: this.levelOfCleanBPK ? Number(this.levelOfCleanBPK.toFixed(3)) : undefined,
				label: 'Уровень очистки для БПК, %'
			},
			levelOfSubstanceClean: {
				value: this.levelOfCleanSubstance ? Number(this.levelOfCleanSubstance.toFixed(3)) : undefined,
				label: 'Уровень очистки для взвешенных веществ, %'
			},
			grainyAndSwimLoad: {
				amountOfAdditionalFilters: {value: this.amountOfAdditionalFilters, label: 'Количество секций фильтров находящихся в ремонте, шт'},
				amountOfFilterClean: {value: this.amountOfFilterClean, label: 'Количество промывок каждого фильтра за сутки, раз'},
				amountOfFilters: {value: this.amountOfFilterSection, label: 'Число секций фильтров, шт'},
				commonFilterSquare: {
					value: this.filterSquare ? Number(this.filterSquare.toFixed(3)) : undefined,
					label: 'Общая площадь фильтров, м²'
				},
				countingWaterFlow: {
					value: this.countingWaterFlow ? Number(this.countingWaterFlow.toFixed(3)) : undefined,
					label: 'Расчетный расход сточной воды подаваемой на фильтры, м³/сут'
				},
				filterCyclePeriod: {value: filterCyclePeriod, label: 'Продолжительность фильтроцикла, ч'},
				filterSectionSquare: {
					value: this.filterSectionSquare ? Number(this.filterSectionSquare.toFixed(3)) : undefined,
					label: 'Площадь каждой секции, м²'
				},
				forcedWaterSpeed: {
					value: this.forcedWaterSpeed ? Number(this.forcedWaterSpeed.toFixed(3)) : undefined,
					label: 'Скорость фильтрования воды при форсированном режиме, м/с'
				},
				waterSpeed: {value: waterSpeed, label: 'Скорость фильтрования воды при нормальном режиме, м/с'},
				onlyGrainyVariable: {
					t1: {value: onlyGrainy.t1, label: 'Продолжительность начального взрыхления, мин'},
					t2: {value: onlyGrainy.t2, label: 'Продолжительность промывки(t2), мин'},
					t3: {value: onlyGrainy.t3, label: 'Продолжительность промывки(t3), мин'},
					w1: {value: onlyGrainy.w1, label: 'Интенсивность начального взрыхления верхнего слоя, л/(с*м²)'},
					w2: {value: onlyGrainy.w2, label: 'Интенсивность промывки водой(w2), л/(с*м²)'},
					w3: {value: onlyGrainy.w3, label: 'Интенсивность промывки водой(w3), л/(с*м²)'},
				},
			},
			microFilter: {
				amountOfAdditionalFilters: {value: this.amountOfAdditionalFilters, label: 'Количество резервных микрофильтров, шт'},
				amountOfMicroFilters: {value: this.amountOfFilterSection, label: 'Количество микрофильтров, шт'},
				commonFilterSquare: {
					value: this.filterSquare ? Number(this.filterSquare.toFixed(3)) : undefined,
					label: 'Площадь фильтрующей поверхности микрофильтра, м²'
				},
				dailyAmountOfWasteWater: {
					value: this.dailyAmountOfWasteWater ? Number(this.dailyAmountOfWasteWater.toFixed(3)) : undefined,
					label: 'Суточное количество промывной воды, м³/сут'
				},
				microFilter: this.currentMicroFilter,
			},
			drumNet: {
				amountOfAdditionalFilters: {value: this.amountOfAdditionalFilters, label: 'Количество резервных барабанных сеток, шт'},
				amountOfDrumNets: {value: this.amountOfFilterSection, label: 'Количество барабанных сеток, шт'},
				dailyAmountOfWasteWater: {
					value: this.dailyAmountOfWasteWater ? Number(this.dailyAmountOfWasteWater.toFixed(3)) : undefined,
					label: 'Суточное количество промывной воды, м³/сут'
				},
				drumNet: this.currentDrumNet,
			}
		};
		dataModel.setFilterResult(this.filterResult);
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
		const { baseSubstanceConcentrate, baseBPKConcentrate, filteringSpeed } = this.state;
		return (
			<>
				<InputTemplate title={`Начальная концентрация взвешенных веществ в сточной воде, мг/л`}
					range={{ minValue: 0, maxValue: Infinity }}
					placeholder={'Введите начальную концентрацию...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseSubstanceConcentrateRef = input; }}
					onInput={(value) => {
						this.selectSuitableFilterTypes({baseSubstanceConcentrate: value});
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
							this.selectSuitableFilterTypes({finalSubstanceConcentrate: value});
							this.setState({ finalSubstanceConcentrate: value });
						}} />
					: null}

				<InputTemplate title={`Начальная концентрация БПКполн в сточной воде, мг/л`}
					range={{ minValue: 0, maxValue: Infinity }}
					placeholder={'Введите начальную концентрацию...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseBPKConcentrateRef = input; }}
					onInput={(value) => {
						this.selectSuitableFilterTypes({baseBPKConcentrate: value});
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
							this.selectSuitableFilterTypes({finalBPKConcentrate: value});
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
						<SelectTemplate title={'Тип очистки фильтра с зернистой загрузкой'} itemList={this.typeOfCleanGrainyFilterList}
							onSelect={(value) => {
								this.currentGrainyType = FilterSource.grainyFilters.find(filter => filter.type === this.currentFilterType);
								this.setState({ grainyCleanType: value as FilterSource.TypeOfCleanGrainyFilter });
							}}
							onSelectRef={(optionList) => { this.typeOfCleanGrainyFilterListRef = optionList; }} />

						<InputTemplate title={`Продолжительность работы станции в течении суток, ч, диапазон[0 - ${FilterSource.day}]`}
							range={{ minValue: 0, maxValue: FilterSource.day }}
							placeholder={'Введите продолжительность работы станции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.workStationPeriodRef = input; }}
							onInput={(value) => { this.setState({ workStationPeriod: value }); }} />

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

						{this.currentGrainyType && this.forcedWaterSpeed > this.currentGrainyType.speedForced.max
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
						<InputTemplate title={`Коэффициент, учитывающий увеличение производительности микрофильтров,
							диапазон[${FilterSource.CoefficientIncreasePerformance.min} - ${FilterSource.CoefficientIncreasePerformance.max}]`}
							range={{ minValue: FilterSource.CoefficientIncreasePerformance.min, maxValue: FilterSource.CoefficientIncreasePerformance.max }}
							placeholder={'Введите коэффициент...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.coefficientIncreasePerformanceRef = input; }}
							onInput={(value) => {
								this.filterMictofilters({coefficientIncreasePerformance: value});
								this.setState({ coefficientIncreasePerformance: value });
							}} />

						<SelectTemplate title={'Глубина погружения барабана, на часть от диаметра'}
							itemList={this.dumpDeepList}
							onSelect={(value) => {
								this.filterMictofilters({coefficientSquareBackGround: value as number});
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
								this.filterMictofilters({filteringSpeed: value});
								this.setState({ filteringSpeed: value });
							}} />

						<InputTemplate title={`Период работы станции в течении суток, ч, диапазон[0 - 24]`}
							range={{ minValue: 0, maxValue: 24 }}
							placeholder={'Введите период работы станции...'}
							onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
							onInputRef={(input) => { this.periodFilterCycleRef = input; }}
							onInput={(value) => {
								this.filterMictofilters({periodFilterCycle: value});
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

				{renderCheckingButton(
					this.clearPage,
					this.isInputReadyToCounting,
					this.resultCounting,
				)}
			</>
		);
	}

	private selectSuitableFilterTypes = (
		concentrates: {
			baseSubstanceConcentrate?: number;
			finalSubstanceConcentrate?: number;
			baseBPKConcentrate?: number;
			finalBPKConcentrate?: number;
		}
	) => {
		const { baseBPKConcentrate, baseSubstanceConcentrate, finalSubstanceConcentrate, finalBPKConcentrate } = this.state;
		const baseSubstance = concentrates.baseSubstanceConcentrate || baseSubstanceConcentrate;
		const finalSubstance = concentrates.finalSubstanceConcentrate || finalSubstanceConcentrate;
		const baseBPK = concentrates.baseBPKConcentrate || baseBPKConcentrate;
		const finalBPK = concentrates.finalBPKConcentrate || finalBPKConcentrate;
		if (!baseSubstance || !finalSubstance || !baseBPK || !finalBPK) {
			return;
		}
		this.levelOfCleanSubstance = 100 * (baseSubstance - finalSubstance) / baseSubstance;
		this.levelOfCleanBPK = 100 * (baseBPK - finalBPK) / baseBPK;
		this.filterTypesList = [];
		this.filterTypesList.push({ value: undefined, label: 'Выберите тип фильтра' });
		FilterSource.filterTypes.forEach(filterType => {
			if (this.levelOfCleanSubstance >= this.levelOfCleanBPK) {
				if (filterType.clearEffectSubstance.min <= this.levelOfCleanSubstance &&
					filterType.clearEffectSubstance.max >= this.levelOfCleanSubstance) {
					this.filterTypesList.push({ value: filterType.type, label: filterType.name });
				}
			}
			if (this.levelOfCleanSubstance < this.levelOfCleanBPK) {
				if (filterType.clearEffectBPK.min <= this.levelOfCleanBPK &&
					filterType.clearEffectBPK.max >= this.levelOfCleanBPK) {
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
		if (this.isDrumNets) {
			this.filterDrumNets();
		}
		if (filterType === FilterSource.FilterTypes.grainyOneLayerUpThread ||
			FilterSource.FilterTypes.grainyHugeOneLayerDownThread ||
			FilterSource.FilterTypes.grainyLittleOneLayerDownThread) {
			this.typeOfCleanGrainyFilterList = [
				{value: undefined, label: 'Выберите способ промывки фильтров с зернистой нагрузкой'},
				{value: FilterSource.TypeOfCleanGrainyFilter.air, label: `Воздух`},
				{value: FilterSource.TypeOfCleanGrainyFilter.airAndWater, label: `Воздух и вода`},
				{value: FilterSource.TypeOfCleanGrainyFilter.water, label: `Вода`},
			];
		}
		if (filterType === FilterSource.FilterTypes.grainyTwoLayers || filterType === FilterSource.FilterTypes.grainyAerated) {
			this.typeOfCleanGrainyFilterList = [
				{value: undefined, label: 'Выберите способ промывки фильтров с зернистой нагрузкой'},
				{value: FilterSource.TypeOfCleanGrainyFilter.water, label: `Вода`},
			];
		}
		if (filterType === FilterSource.FilterTypes.grainyCarcase) {
			this.typeOfCleanGrainyFilterList = [
				{value: undefined, label: 'Выберите способ промывки фильтров с зернистой нагрузкой'},
				{value: FilterSource.TypeOfCleanGrainyFilter.airAndWater, label: `Воздух и вода`},
				{value: FilterSource.TypeOfCleanGrainyFilter.water, label: `Вода`},
			];
		}
		this.clearDataAfterFilterType();
	}

	private clearDataAfterFilterType = () => {
		if (this.coefficientDrumNetsCleanRef) { this.coefficientDrumNetsCleanRef.value = NULLSTR; }
		if (this.filteringSpeedRef) { this.filteringSpeedRef.value = NULLSTR; }
		if (this.coefficientIncreasePerformanceRef) { this.coefficientIncreasePerformanceRef.value = NULLSTR; }
		if (this.microFilterSpeedFilteringRef) { this.microFilterSpeedFilteringRef.value = NULLSTR; }
		if (this.periodFilterCycleRef) { this.periodFilterCycleRef.value = NULLSTR; }
		if (this.amountOfWaterCleanRef) { this.amountOfWaterCleanRef.value = NULLSTR; }
		if (this.cleanWaterFlowRef) { this.cleanWaterFlowRef.value = NULLSTR; }
		if (this.workStationPeriodRef) { this.workStationPeriodRef.value = NULLSTR; }
		resetSelectToDefault(this.periodFilterCycleListRef, this.periodFilterCycleList);
		resetSelectToDefault(this.dumpDeepListRef, this.dumpDeepList);
		resetSelectToDefault(this.necessaryMicroFiltersRef, this.necessaryMicroFilters);
		resetSelectToDefault(this.necessaryDrumNetsRef, []);
		resetSelectToDefault(this.typeOfCleanGrainyFilterListRef, this.typeOfCleanGrainyFilterList);
		this.setState({
			coefficientDrumNetsClean: undefined,
			periodFilterCycle: undefined,
			filteringSpeed: undefined,
			coefficientIncreasePerformance: undefined,
			coefficientSquareBackGround: undefined,
			currentMicroFilterPerformance: undefined,
			currentDrumNetsPerformance: undefined,
			amountOfWaterClean: undefined,
			cleanWaterFlow: undefined,
			grainyCleanType: undefined,
			workStationPeriod: undefined,
		});
	}

	private filterMictofilters = (variables: {
		periodFilterCycle?: number;
		filteringSpeed?: number;
		coefficientIncreasePerformance?: number;
		coefficientSquareBackGround?: number;
	}) => { // TO DO like selectSuitableFilterTypes
		const {dailyWaterFlow} = this.props;
		const {
			periodFilterCycle, filteringSpeed, coefficientIncreasePerformance,
			coefficientSquareBackGround,
		} = this.state;
		const period = variables.periodFilterCycle || periodFilterCycle;
		const speed = variables.filteringSpeed || filteringSpeed;
		const coefficientIncrease = variables.coefficientIncreasePerformance || coefficientIncreasePerformance;
		const coefficientSquare = variables.coefficientSquareBackGround || coefficientSquareBackGround;
		const areParametersExist = period && speed && coefficientIncrease && coefficientSquare;
		if (!areParametersExist) {
			return;
		}
		// formula 8 Fmf = (k1 * Q) / (k2 * T * vf)
		this.filterSquare = (coefficientIncrease * dailyWaterFlow) / (coefficientSquare * period * speed);
		this.necessaryMicroFilters = FilterSource.microFilters.filter(filter => {
			const amountOfFilter = Math.ceil(this.filterSquare / filter.square);
			const maxPerformance = filter.performance * amountOfFilter;
			return maxPerformance > dailyWaterFlow;
		});
		this.necessaryMicroFilters.unshift({
			label: 'Выберите табличный микрофильтр',
			performance: undefined,
			relation: {width: undefined, height: undefined},
			square: undefined,
			value: undefined,
			drumSpeedRotation: undefined,
			filterSquare: undefined,
			iri: undefined,
			mark: undefined,
		});
	}

	private filterDrumNets = () => {
		const {dailyWaterFlow} = this.props;
		this.necessaryDrumNets = FilterSource.drumNets.filter(drumNet => {
			const amountOfFilters = Math.ceil(dailyWaterFlow / drumNet.performance);
			return amountOfFilters > 1;
		});
		this.necessaryDrumNets.unshift({
			label: 'Выберите табличную барабанную сетку',
			performance: undefined,
			value: undefined,
			drumSpeedRotation: undefined,
			filterSquare: undefined,
			relation: {width: undefined, height: undefined},
			iri: undefined,
			mark: undefined,
		});
	}

	private isInputReadyToCounting = (): boolean => {
		const {
			amountOfWaterClean, baseBPKConcentrate, baseSubstanceConcentrate,
			cleanWaterFlow, coefficientDrumNetsClean, coefficientIncreasePerformance,
			coefficientSquareBackGround, currentDrumNetsPerformance, currentMicroFilterPerformance,
			filteringSpeed, finalBPKConcentrate, finalSubstanceConcentrate,
			periodFilterCycle, workStationPeriod, grainyCleanType
		} = this.state;
		const commonInputs = baseSubstanceConcentrate && baseBPKConcentrate && finalSubstanceConcentrate &&
			finalBPKConcentrate ? true : false;
		const grainyInputs = coefficientDrumNetsClean && grainyCleanType && workStationPeriod ? true : false;
		const swimPressureInputs = periodFilterCycle && filteringSpeed ? true : false;
		const microFilterInputs = coefficientIncreasePerformance && coefficientSquareBackGround &&
			filteringSpeed && periodFilterCycle && currentMicroFilterPerformance ? true : false;
		const drumNetsInputs = amountOfWaterClean && currentDrumNetsPerformance && cleanWaterFlow ? true : false;
		return (commonInputs && grainyInputs) || (commonInputs && swimPressureInputs) ||
			(commonInputs && microFilterInputs) || (commonInputs && drumNetsInputs);
	}

	private resultCounting = () => {
		const { secondMaxFlow, type, dailyWaterFlow } = this.props;
		const {
			coefficientDrumNetsClean, periodFilterCycle, filteringSpeed,
			currentMicroFilterPerformance, currentDrumNetsPerformance,
			amountOfWaterClean, cleanWaterFlow, grainyCleanType, workStationPeriod
		} = this.state;
		let w1 = 0, t1 = 0, w2 = 0, w3 = 0, t2 = 0, t3 = 0, vf = 0;

		if (this.isGrainy) {
			// formula 1 Qf = 20,4 * qw; qw = qmax * 3600 (1 hour)
			this.countingWaterFlow = 20.4 * (secondMaxFlow * 3600);
			// this.currentGrainyType = FilterSource.grainyFilters.find(filter => filter.type === this.currentFilterType);

			// formula 2 n = 24 / Tf;
			this.amountOfFilterClean = Math.ceil(24 / this.currentGrainyType.periodFilterCycle);
			// formula 3 Ff = (Qf * (1 + m)) / (vf * (T - n * t4/60) - 0.06 * n * (w1 * t1 + w2 * t2 + w3 * t3))
			// always take a middle value from diapason
			vf = (this.currentGrainyType.speedNormal.max + this.currentGrainyType.speedNormal.min) / 2;
			if (this.currentFilterType === FilterSource.FilterTypes.grainyLittleOneLayerDownThread ||
				this.currentFilterType === FilterSource.FilterTypes.grainyHugeOneLayerDownThread ||
				this.currentFilterType === FilterSource.FilterTypes.grainyTwoLayers) {
				w1 = (this.currentGrainyType.intensiveFirst.max + this.currentGrainyType.intensiveFirst.min) / 2;
				t1 = (this.currentGrainyType.periodFirst.max + this.currentGrainyType.periodFirst.min) / 2;
			}
			if (FilterSource.TypeOfCleanGrainyFilter.air === grainyCleanType) {
				w3 = (this.currentGrainyType.intensiveThirdAir.max + this.currentGrainyType.intensiveThirdAir.min) / 2;
				t3 = (this.currentGrainyType.periodThirdAir.max + this.currentGrainyType.periodThirdAir.min) / 2;
			}
			if (FilterSource.TypeOfCleanGrainyFilter.water === grainyCleanType) {
				w3 = (this.currentGrainyType.intensiveThirdWater.max + this.currentGrainyType.intensiveThirdWater.min) / 2;
				t3 = (this.currentGrainyType.periodThirdWater.max + this.currentGrainyType.periodThirdWater.min) / 2;
			}
			if (FilterSource.TypeOfCleanGrainyFilter.airAndWater === grainyCleanType) {
				w2 = (this.currentGrainyType.intensiveSecond.max + this.currentGrainyType.intensiveSecond.min) / 2;
				t2 = (this.currentGrainyType.periodSecond.max + this.currentGrainyType.periodSecond.min) / 2;
				w3 = (this.currentGrainyType.intensiveThirdAir.max + this.currentGrainyType.intensiveThirdAir.min) / 2;
				t3 = (this.currentGrainyType.periodSecond.max + this.currentGrainyType.periodSecond.min) / 2;
			}
			this.filterSquare = (this.countingWaterFlow * (1 + coefficientDrumNetsClean)) /
				(vf * (workStationPeriod - this.amountOfFilterClean * (FilterSource.stayPeriodToClean / 60)) -
				0.06 * this.amountOfFilterClean * (w1 * t1 + w2 * t2 + w3 * t3));

			// formula 4 N = 0.5 * sqrt(Ff);
			const amount = Math.ceil(0.5 * Math.sqrt(this.filterSquare));
			this.amountOfFilterSection = amount < 4 ? 4 : amount;
			// formula 5 F1 = Ff / N
			this.filterSectionSquare = this.filterSquare / this.amountOfFilterSection;
			// formula 6 vff = vf * N / (N - Np)
			this.amountOfAdditionalFilters = 1;
			this.forcedWaterSpeed = (vf * this.amountOfFilterSection) /
				(this.amountOfFilterSection - this.amountOfAdditionalFilters);
		}

		if (this.isSwimPressure) {
			// formula 1 Qf = 20,4 * qw; qw = qmax * 3600 (1 hour)
			this.countingWaterFlow = 20.4 * (secondMaxFlow * 3600);
			// formula 2 n = 24 / Tf;
			this.amountOfFilterClean = 24 / periodFilterCycle;
			// formula 7 Ff = Qf / Tf * vf
			this.filterSquare = (this.countingWaterFlow) / (periodFilterCycle * filteringSpeed);
			// formula 4 N = 0.5 * sqrt(Ff);
			this.amountOfFilterSection = Math.ceil(0.5 * Math.sqrt(this.filterSquare));
			// formula 5 F1 = Ff / N
			this.filterSectionSquare = this.filterSquare / this.amountOfFilterSection;
			// formula 6 vff = vf * N / (N - Np)
			this.amountOfAdditionalFilters = 1;
			this.forcedWaterSpeed = (filteringSpeed * this.amountOfFilterSection) /
				(this.amountOfFilterSection - this.amountOfAdditionalFilters);
		}

		if (this.isMicroFilter) {
			this.currentMicroFilter = FilterSource.microFilters.find(filter =>
				filter.performance === currentMicroFilterPerformance);
			this.amountOfFilterSection = Math.ceil(dailyWaterFlow / this.currentMicroFilter.performance);
			this.amountOfAdditionalFilters = this.amountOfFilterSection < FilterSource.minAmountFilterSection ? 1 : 2;
			this.dailyAmountOfWasteWater = 0.035 * dailyWaterFlow;
		}

		if (this.isDrumNets) {
			this.currentDrumNet = FilterSource.drumNets.find(drumNet => drumNet.performance === currentDrumNetsPerformance);
			this.amountOfFilterSection = Math.ceil(dailyWaterFlow / this.currentDrumNet.performance);
			this.amountOfAdditionalFilters = this.amountOfFilterSection < FilterSource.minAmountDrumNetsSection ? 1 : 2;
			this.dailyAmountOfWasteWater = amountOfWaterClean * FilterSource.periodOfWaterClean * cleanWaterFlow * dailyWaterFlow / 144000;
		}

		this.setFilterResult({t1, t2, t3, w1, w2, w3}, vf, this.currentGrainyType ? this.currentGrainyType.periodFilterCycle : undefined);

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return renderFilterResult(this.filterResult, false);
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

export function renderFilterResult(
	filterResult: FilterResultData,
	isGeneralResult: boolean,
) {
	if (!filterResult) {
		return null;
	}
	const common = filterResult;
	const grainyOrLoad = common.grainyAndSwimLoad;
	const onlyGrainy = common.grainyAndSwimLoad.onlyGrainyVariable;
	const micro = common.microFilter;
	const drumNet = common.drumNet;
	return (
		<div className={'table-result'}>
			<Table bordered hover>
				<tbody>
					{isGeneralResult
						? <TableRow value={
							filterResult.deviceType === FilterSource.FilterGlobalTypes.grainy
								? 'Зернистый фильтр'
								: filterResult.deviceType === FilterSource.FilterGlobalTypes.swimLoad
									? 'С плавающей загрузкой'
									: filterResult.deviceType === FilterSource.FilterGlobalTypes.microFilter
										? 'Микрофильтр'
										: 'Барабанные сетки'
						} label={'Тип'} />
						: null}
					<TableRow value={common.levelOfSubstanceClean.value} label={common.levelOfSubstanceClean.label} />
					<TableRow value={common.levelOfBPKClean.value} label={common.levelOfBPKClean.label} />
					{filterResult.deviceType === FilterSource.FilterGlobalTypes.grainy ||
					filterResult.deviceType === FilterSource.FilterGlobalTypes.swimLoad
						? <>
							<TableRow value={grainyOrLoad.countingWaterFlow.value} label={grainyOrLoad.countingWaterFlow.label} />
							<TableRow value={grainyOrLoad.commonFilterSquare.value} label={grainyOrLoad.commonFilterSquare.label} />
							<TableRow value={grainyOrLoad.amountOfFilterClean.value} label={grainyOrLoad.amountOfFilterClean.label} />
							<TableRow value={grainyOrLoad.amountOfFilters.value} label={grainyOrLoad.amountOfFilters.label} />
							<TableRow value={grainyOrLoad.waterSpeed.value} label={grainyOrLoad.waterSpeed.label} />
							<TableRow value={grainyOrLoad.forcedWaterSpeed.value} label={grainyOrLoad.forcedWaterSpeed.label} />
							<TableRow value={grainyOrLoad.amountOfAdditionalFilters.value} label={grainyOrLoad.amountOfAdditionalFilters.label} />
							<TableRow value={grainyOrLoad.filterSectionSquare.value} label={grainyOrLoad.filterSectionSquare.label} />
							<TableRow value={grainyOrLoad.filterCyclePeriod.value} label={grainyOrLoad.filterCyclePeriod.label} />
						</>
						: null}
					{filterResult.deviceType === FilterSource.FilterGlobalTypes.grainy
						? <>
							<TableRow value={onlyGrainy.w1.value} label={onlyGrainy.w1.label} />
							<TableRow value={onlyGrainy.t1.value} label={onlyGrainy.t1.label} />
							<TableRow value={onlyGrainy.w2.value} label={onlyGrainy.w2.label} />
							<TableRow value={onlyGrainy.t2.value} label={onlyGrainy.t2.label} />
							<TableRow value={onlyGrainy.w3.value} label={onlyGrainy.w3.label} />
							<TableRow value={onlyGrainy.t3.value} label={onlyGrainy.t3.label} />
						</>
						: null}
					{filterResult.deviceType === FilterSource.FilterGlobalTypes.microFilter
						? <>
							<TableRow value={micro.microFilter.label} label={'Марка микрофильтра из типа МФБ, по типоразмеру'} />
							<TableRow value={micro.microFilter.performance} label={'Производительность, м³/сут'} />
							<TableRow value={micro.commonFilterSquare.value} label={micro.commonFilterSquare.label} />
							<TableRow value={micro.amountOfMicroFilters.value} label={micro.amountOfMicroFilters.label} />
							<TableRow value={micro.amountOfAdditionalFilters.value} label={micro.amountOfAdditionalFilters.label} />
							<TableRow value={micro.dailyAmountOfWasteWater.value} label={micro.dailyAmountOfWasteWater.label} />
						</>
						: null}
					{filterResult.deviceType === FilterSource.FilterGlobalTypes.drumNets
						? <>
							<TableRow value={drumNet.drumNet.label} label={'Марка микрофильтра из типа МФБ, по типоразмеру'} />
							<TableRow value={drumNet.drumNet.performance} label={'Производительность, м³/сут'} />
							<TableRow value={drumNet.amountOfDrumNets.value} label={drumNet.amountOfDrumNets.label} />
							<TableRow value={drumNet.amountOfAdditionalFilters.value} label={drumNet.amountOfAdditionalFilters.label} />
							<TableRow value={drumNet.dailyAmountOfWasteWater.value} label={drumNet.dailyAmountOfWasteWater.label} />
						</>
						: null}
				</tbody>
			</Table>
		</div>
	);
}
