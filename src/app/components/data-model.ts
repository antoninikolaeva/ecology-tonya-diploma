import { GrateSource } from '../components/grate/grate-resources';
import { FilterSource } from './filter/filter-resource';

export interface GrateResultData {
}

export interface SandTrapResultData {
}

export interface SumpResultData {
}

export interface AverageResultData {
}

export interface OilTrapResultData {
}

export interface FilterResultData {
	currentType: 'grainy' | 'load' | 'microFilter' | 'drumNet';
	levelOfSubstanceClean: {value: number; label: string};
	levelOfBPKClean: {value: number; label: string};
	grainyAndSwimLoad: GrainyAndSwimLoadResult;
	microFilter: MicroFilterResult;
	drumNet: DrumNetResult;
}

export interface CentrifugeResultData {
}

export class GeneralDataModel {
	private grateResult: GrateResultData;
	private sandTrapResult: SandTrapResultData;
	private sumpResult: SumpResultData;
	private averageResult: AverageResultData;
	private oilTrapResult: OilTrapResultData;
	private filterResult: FilterResultData;
	private centrifugeResult: CentrifugeResultData;

	constructor() {
		this.initDataModel();
	}

	private initDataModel() {
		this.grateResult = {
		};
		this.sandTrapResult = {
		};
		this.sumpResult = {
		};
		this.averageResult = {
		};
		this.oilTrapResult = {
		};
		this.filterResult = {
			currentType: undefined,
			levelOfSubstanceClean: {value: undefined, label: undefined},
			levelOfBPKClean: {value: undefined, label: undefined},
			grainyAndSwimLoad: {
				amountOfAdditionalFilters: {value: undefined, label: undefined},
				amountOfFilterClean: {value: undefined, label: undefined},
				amountOfFilters: {value: undefined, label: undefined},
				commonFilterSquare: {value: undefined, label: undefined},
				countingWaterFlow: {value: undefined, label: undefined},
				filterCyclePeriod: {value: undefined, label: undefined},
				filterSectionSquare: {value: undefined, label: undefined},
				forcedWaterSpeed: {value: undefined, label: undefined},
				waterSpeed: {value: undefined, label: undefined},
				onlyGrainyVariable: {
					t1: {value: undefined, label: undefined},
					t2: {value: undefined, label: undefined},
					t3: {value: undefined, label: undefined},
					w1: {value: undefined, label: undefined},
					w2: {value: undefined, label: undefined},
					w3: {value: undefined, label: undefined},
				},
			},
			microFilter: {
				amountOfAdditionalFilters: {value: undefined, label: undefined},
				amountOfMicroFilters: {value: undefined, label: undefined},
				commonFilterSquare: {value: undefined, label: undefined},
				dailyAmountOfWasteWater: {value: undefined, label: undefined},
				microFilter: undefined,
			},
			drumNet: {
				amountOfAdditionalFilters: {value: undefined, label: undefined},
				amountOfDrumNets: {value: undefined, label: undefined},
				dailyAmountOfWasteWater: {value: undefined, label: undefined},
				drumNet: undefined,
			}
		};
		this.centrifugeResult = {
		};
	}

	public setGrateResult(result: GrateResultData) {
		this.grateResult = result;
	}

	public getGrateResult(): GrateResultData {
		return this.grateResult;
	}

	public setSandTrapResult(result: SandTrapResultData) {
		this.sandTrapResult = result;
	}

	public getSandTrapResult(): SandTrapResultData {
		return this.sandTrapResult;
	}

	public setSumpResult(result: SumpResultData) {
		this.sumpResult = result;
	}

	public getSumpResult(): SumpResultData {
		return this.sumpResult;
	}

	public setAverageResult(result: AverageResultData) {
		this.averageResult = result;
	}

	public getAverageResult(): AverageResultData {
		return this.averageResult;
	}

	public setOilTrapResult(result: OilTrapResultData) {
		this.oilTrapResult = result;
	}

	public getOilTrapResult(): OilTrapResultData {
		return this.oilTrapResult;
	}

	public setFilterResult(result: FilterResultData) {
		this.filterResult = result;
	}

	public getFilterResult(): FilterResultData {
		return this.filterResult;
	}

	public setCentrifugeResult(result: CentrifugeResultData) {
		this.centrifugeResult = result;
	}

	public getCentrifugeResult(): CentrifugeResultData {
		return this.centrifugeResult;
	}

	public resetResultData() {
		this.initDataModel();
	}
}

export const dataModel: GeneralDataModel = new GeneralDataModel();

interface GrainyAndSwimLoadResult {
	countingWaterFlow: {value: number; label: string};
	commonFilterSquare: {value: number; label: string};
	filterSectionSquare: {value: number; label: string};
	waterSpeed: {value: number; label: string};
	forcedWaterSpeed: {value: number; label: string};
	amountOfFilterClean: {value: number; label: string};
	amountOfAdditionalFilters: {value: number; label: string};
	amountOfFilters: {value: number; label: string};
	filterCyclePeriod: {value: number; label: string};
	onlyGrainyVariable: GrainyVariableConfig;
}

interface GrainyVariableConfig {
	w1?: {value: number; label: string};
	w2?: {value: number; label: string};
	w3?: {value: number; label: string};
	t1?: {value: number; label: string};
	t2?: {value: number; label: string};
	t3?: {value: number; label: string};
}

interface MicroFilterResult {
	commonFilterSquare: {value: number; label: string};
	microFilter: FilterSource.MicroFilter;
	amountOfMicroFilters: {value: number; label: string};
	amountOfAdditionalFilters: {value: number; label: string};
	dailyAmountOfWasteWater: {value: number; label: string};
}

interface DrumNetResult {
	drumNet: FilterSource.DrumNets;
	amountOfDrumNets: {value: number; label: string};
	amountOfAdditionalFilters: {value: number; label: string};
	dailyAmountOfWasteWater: {value: number; label: string};
}