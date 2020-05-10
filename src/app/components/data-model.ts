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
			levelOfSubstanceClean: {value: undefined, label: undefined},
			levelOfBPKClean: {value: undefined, label: undefined},
			grainyAndSwimLoad: {
				amountOfAdditionalFilters: undefined,
				amountOfFilterClean: undefined,
				commonFilterSquare: undefined,
				countingWaterFlow: undefined,
				filterCyclePeriod: undefined,
				filterSectionSquare: undefined,
				forcedWaterSpeed: undefined,
				waterSpeed: undefined,
				onlyGrainyVariable: {
					t1: undefined,
					t2: undefined,
					t3: undefined,
					w1: undefined,
					w2: undefined,
					w3: undefined,
				},
			},
			microFilter: {
				amountOfAdditionalFilters: undefined,
				amountOfMicroFilters: undefined,
				commonFilterSquare: undefined,
				dailyAmountOfWasteWater: undefined,
				microFilter: undefined,
			},
			drumNet: {
				amountOfAdditionalFilters: undefined,
				amountOfDrumNets: undefined,
				dailyAmountOfWasteWater: undefined,
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
	countingWaterFlow: number;
	commonFilterSquare: number;
	filterSectionSquare: number;
	waterSpeed: number;
	forcedWaterSpeed: number;
	amountOfFilterClean: number;
	amountOfAdditionalFilters: number;
	filterCyclePeriod: number;
	onlyGrainyVariable: GrainyVariableConfig;
}

interface GrainyVariableConfig {
	w1?: number;
	w2?: number;
	w3?: number;
	t1?: number;
	t2?: number;
	t3?: number;
}

interface MicroFilterResult {
	commonFilterSquare: number;
	microFilter: FilterSource.MicroFilter;
	amountOfMicroFilters: number;
	amountOfAdditionalFilters: number;
	dailyAmountOfWasteWater: number;
}

interface DrumNetResult {
	drumNet: FilterSource.DrumNets;
	amountOfDrumNets: number;
	amountOfAdditionalFilters: number;
	dailyAmountOfWasteWater: number;
}