import { FilterSource } from './filter/filter-resource';
import { CentrifugeSource } from './centrifuge/centrifuge-resource';
import { CentrifugeTypes, AverageTypes, GrateTypes, OilTrapTypes, SandTrapTypes, SumpTypes } from './general-resources';
import { AverageSource } from './average/average-resource';

export interface GrateResultData {
	deviceType: GrateTypes;
	mechanic: MechanicGrate;
	hand: HandGrate;
	crusher: GrateCrusher;
}

export interface SandTrapResultData {
	deviceType: SandTrapTypes;
	amountOfSandTrapSection: {value: number; label: string};
	horizontalForward: HorizontalForwardSandTrap;
	horizontalCircle: HorizontalCircleSandTrap;
	tangentialOrVertical: TangentialAndVerticalSandTrap;
	aerated: AeratedSandTrap;
}

export interface SumpResultData {
	deviceType: SumpTypes;
	highLightEffect: {value: number; label: string};
	amountOfSection: {value: number; label: string};
	fullSumpHeight: {value: number; label: string};
	sedimentAmountDaily: {value: number; label: string};
	horizontal: HorizontalSump;
	vertical: VerticalSump;
	verticalUpDownFlow: VerticalUpDownFlowSump;
	radial: RadialSump;
}

export interface AverageResultData {
	deviceType: AverageTypes;
	averageMechanismType: AverageSource.AverageMechanismType;
	averageCoefficient: {value: number; label: string};
	averageVolume: {value: number; label: string};
	sectionSquare: {value: number; label: string};
	bubbling: BubblingMechanism;
	multichannelLength: MultichannelLengthMechanism;
	multichannelWidth: MultichannelWidthMechanism;
}

export interface OilTrapResultData {
	deviceType: OilTrapTypes;
	amountOfSection: {value: number; label: string};
	oilTrapDeep: {value: number; label: string};
	amountOfSediment: {value: number; label: string};
	amountOfOilProduct: {value: number; label: string};
	horizontal: HorizontalOilTrap;
	radial: RadialOilTrap;
}

export interface FilterResultData {
	deviceType: FilterSource.FilterGlobalTypes;
	levelOfSubstanceClean: {value: number; label: string};
	levelOfBPKClean: {value: number; label: string};
	grainyAndSwimLoad: GrainyAndSwimLoadResult;
	microFilter: MicroFilterResult;
	drumNet: DrumNetResult;
}

export interface CentrifugeResultData {
	deviceType: CentrifugeTypes;
	openHydrocycloneType: CentrifugeSource.HydrocycloneOpenTypes;
	hOpened: HydrocycloneOpened;
	hPressure: HydrocyclonePressure;
	centrifuge: Centrifuge;
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
			deviceType: undefined,
			hand: {
				amountOfGrates: {value: undefined, label: undefined},
				amountAdditionalGrates: {value: undefined, label: undefined},
				countingWidthOfGrate: {value: undefined, label: undefined},
				countingAmountOfSection: {value: undefined, label: undefined},
				commonLengthOfCamera: {value: undefined, label: undefined},
				sizeOfInputChannel: {value: undefined, label: undefined},
				sizeOfOutputChannel: {value: undefined, label: undefined},
				lengthOfExtendPartOfChannel: {value: undefined, label: undefined},
				sizeOfLedge: {value: undefined, label: undefined},
				volumeOfWaste: {value: undefined, label: undefined},
				massOfWaste: {value: undefined, label: undefined},
			},
			mechanic: {
				currentGrate: {value: undefined, label: undefined},
				amountOfGrate: {value: undefined, label: undefined},
				amountAdditionalGrates: {value: undefined, label: undefined},
				currentHammerCrusher: {value: undefined, label: undefined},
				amountOfHammerCrusher: {value: undefined, label: undefined},
				amountAdditionalHammerCrusher: {value: undefined, label: undefined},
				amountOfTechnicWaterFlow: {value: undefined, label: undefined},
				massOfWaste: {value: undefined, label: undefined},
			},
			crusher: {
				currentGrateCrusher: {value: undefined, label: undefined},
				amountOfGrateCrusher: {value: undefined, label: undefined},
				amountAdditionalGrates: {value: undefined, label: undefined},
			}
		};
		this.sandTrapResult = {
			deviceType: undefined,
			amountOfSandTrapSection: {value: undefined, label: undefined},
			horizontalForward: {
				widthOfSandTrap: {value: undefined, label: undefined},
				lengthOfSandTrap: {value: undefined, label: undefined},
				sandTrapDeep: {value: undefined, label: undefined},
				volumeOfSandTrapSection: {value: undefined, label: undefined},
				deepSandTrapSection: {value: undefined, label: undefined},
			},
			horizontalCircle: {
				lengthOfSandTrap: {value: undefined, label: undefined},
				middleDiameter: {value: undefined, label: undefined},
				outputDiameter: {value: undefined, label: undefined},
				bunkerHeightConusPart: {value: undefined, label: undefined},
				volumeOfSandTrapSection: {value: undefined, label: undefined},
			},
			tangentialOrVertical: {
				diameterOfEachCompartment: {value: undefined, label: undefined},
				deepOfTheBunker: {value: undefined, label: undefined},
				heightOfTheBunker: {value: undefined, label: undefined},
				periodBetweenSedimentOutput: {value: undefined, label: undefined},
			},
			aerated: {
				widthOfSandTrap: {value: undefined, label: undefined},
				lengthOfSandTrap: {value: undefined, label: undefined},
				fullSandTrapHeight: {value: undefined, label: undefined},
				countingDeepOfSandTrap: {value: undefined, label: undefined},
				deepOfSandTrap: {value: undefined, label: undefined},
				hydroMechanicWaterFlow: {value: undefined, label: undefined},
				outputPipePressure: {value: undefined, label: undefined},
				generalAirFlow: {value: undefined, label: undefined},
			}
		};
		this.sumpResult = {
			deviceType: undefined,
			highLightEffect: {value: undefined, label: undefined},
			amountOfSection: {value: undefined, label: undefined},
			fullSumpHeight: {value: undefined, label: undefined},
			sedimentAmountDaily: {value: undefined, label: undefined},
			horizontal: {
				sumpLength: {value: undefined, label: undefined},
				oneSumpVolume: {value: undefined, label: undefined},
				sedimentCleanPeriod: {value: undefined, label: undefined},
			},
			vertical: {
				gapHeightTrumpetAndShield: {value: undefined, label: undefined},
				commonHeightCylinderSump: {value: undefined, label: undefined},
				conePartOfSump: {value: undefined, label: undefined},
				sumpDiameter: {value: undefined, label: undefined},
				diameterCentralPipe: {value: undefined, label: undefined},
				diameterOfTrumpet: {value: undefined, label: undefined},
				diameterOfReflectorShield: {value: undefined, label: undefined},
			},
			verticalUpDownFlow: {
				commonHeightCylinderSump: {value: undefined, label: undefined},
				conePartOfSump: {value: undefined, label: undefined},
				sumpDiameter: {value: undefined, label: undefined},
				diameterRingBorder: {value: undefined, label: undefined},
				heightRingBorder: {value: undefined, label: undefined},
			},
			radial: {
				sumpDiameter: {value: undefined, label: undefined},
			}
		};
		this.averageResult = {
			deviceType: undefined,
			averageMechanismType: undefined,
			averageCoefficient: undefined,
			averageVolume: undefined,
			sectionSquare: undefined,
			bubbling: {
				averageLength: {value: undefined, label: undefined},
				commonAirFlow: {value: undefined, label: undefined},
				distanceBetweenIntervalBubble: {value: undefined, label: undefined},
				distanceBetweenWallBubble: {value: undefined, label: undefined},
			},
			multichannelLength: {
				formOfAverage: undefined,
				averageDiameter: {value: undefined, label: undefined},
				averageLength: {value: undefined, label: undefined},
				channelWidthCircle: {value: undefined, label: undefined},
				channelWidthPrizma: {value: undefined, label: undefined},
			},
			multichannelWidth: {
				averageLength: {value: undefined, label: undefined},
				crossSectionalArea: {value: undefined, label: undefined},
				squareBottomForEachChannel: {value: undefined, label: undefined},
				squareSideForEachChannel: {value: undefined, label: undefined},
				waterFlowOfEachChannel: {value: undefined, label: undefined},
				widthOfEachChannel: {value: undefined, label: undefined},
			}
		};
		this.oilTrapResult = {
			deviceType: undefined,
			amountOfSection: {value: undefined, label: undefined},
			oilTrapDeep: {value: undefined, label: undefined},
			amountOfSediment: {value: undefined, label: undefined},
			amountOfOilProduct: {value: undefined, label: undefined},
			horizontal: {
				widthSectionResult: {value: undefined, label: undefined},
				sumpPartLengthOfOilTrap: {value: undefined, label: undefined},
				layPeriod: {value: undefined, label: undefined},
			},
			radial: {
				oilTrapDiameter: {value: undefined, label: undefined},
				fullOilTrapHeight: {value: undefined, label: undefined},
			}
		};
		this.filterResult = {
			deviceType: undefined,
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
			deviceType: undefined,
			openHydrocycloneType: undefined,
			hOpened: {
				amountOfHydrocyclones: {value: undefined, label: undefined},
				coefficientProportion: {value: undefined, label: undefined},
				currentHydrocyclone: undefined,
				diameterHydrocyclone: {value: undefined, label: undefined},
				hydraulicPressure: {value: undefined, label: undefined},
				performance: {value: undefined, label: undefined},
			},
			hPressure: {
				amountOfAdditionalHydrocyclones: {value: undefined, label: undefined},
				amountOfHydrocyclones: {value: undefined, label: undefined},
				performance: {value: undefined, label: undefined},
				currentPressureHydrocyclone: undefined,
			},
			centrifuge: {
				amountOfCentrifuges: {value: undefined, label: undefined},
				currentCentrifuge: undefined,
				performance: {value: undefined, label: undefined},
			}
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

interface HandGrate {
	amountOfGrates: {value: number; label: string};
	amountAdditionalGrates: {value: number; label: string};
	countingWidthOfGrate: {value: number; label: string};
	countingAmountOfSection: {value: number; label: string};
	commonLengthOfCamera: {value: number; label: string};
	sizeOfInputChannel: {value: number; label: string};
	sizeOfOutputChannel: {value: number; label: string};
	lengthOfExtendPartOfChannel: {value: number; label: string};
	sizeOfLedge: {value: number; label: string};
	volumeOfWaste: {value: number; label: string};
	massOfWaste: {value: number; label: string};
}

interface MechanicGrate {
	currentGrate: {value: string; label: string};
	amountOfGrate: {value: number; label: string};
	amountAdditionalGrates: {value: number; label: string};
	currentHammerCrusher: {value: string; label: string};
	amountOfHammerCrusher: {value: number; label: string};
	amountAdditionalHammerCrusher: {value: number; label: string};
	amountOfTechnicWaterFlow: {value: number; label: string};
	massOfWaste: {value: number; label: string};
}

interface GrateCrusher {
	currentGrateCrusher: {value: string; label: string};
	amountOfGrateCrusher: {value: number; label: string};
	amountAdditionalGrates: {value: number; label: string};
}

interface HorizontalForwardSandTrap {
	widthOfSandTrap: {value: number; label: string};
	lengthOfSandTrap: {value: number; label: string};
	sandTrapDeep: {value: number; label: string};
	volumeOfSandTrapSection: {value: number; label: string};
	deepSandTrapSection: {value: number; label: string};
}

interface HorizontalCircleSandTrap {
	lengthOfSandTrap: {value: number; label: string};
	middleDiameter: {value: number; label: string};
	outputDiameter: {value: number; label: string};
	bunkerHeightConusPart: {value: number; label: string};
	volumeOfSandTrapSection: {value: number; label: string};
}

interface TangentialAndVerticalSandTrap {
	diameterOfEachCompartment: {value: number; label: string};
	deepOfTheBunker: {value: number; label: string};
	heightOfTheBunker: {value: number; label: string};
	periodBetweenSedimentOutput: {value: number; label: string};
}

interface AeratedSandTrap {
	widthOfSandTrap: {value: number; label: string};
	lengthOfSandTrap: {value: number; label: string};
	fullSandTrapHeight: {value: number; label: string};
	countingDeepOfSandTrap: {value: number; label: string};
	deepOfSandTrap: {value: number; label: string};
	hydroMechanicWaterFlow: {value: number; label: string};
	outputPipePressure: {value: number; label: string};
	generalAirFlow: {value: number; label: string};
}

interface HorizontalSump {
	sumpLength: {value: number; label: string};
	oneSumpVolume: {value: number; label: string};
	sedimentCleanPeriod: {value: number; label: string};
}

interface VerticalSump {
	gapHeightTrumpetAndShield: {value: number; label: string};
	commonHeightCylinderSump: {value: number; label: string};
	conePartOfSump: {value: number; label: string};
	sumpDiameter: {value: number; label: string};
	diameterCentralPipe: {value: number; label: string};
	diameterOfTrumpet: {value: number; label: string};
	diameterOfReflectorShield: {value: number; label: string};
}

interface VerticalUpDownFlowSump {
	commonHeightCylinderSump: {value: number; label: string};
	conePartOfSump: {value: number; label: string};
	sumpDiameter: {value: number; label: string};
	diameterRingBorder: {value: number; label: string};
	heightRingBorder: {value: number; label: string};
}

interface RadialSump {
	sumpDiameter: {value: number; label: string};
}

interface HorizontalOilTrap {
	widthSectionResult: {value: number; label: string};
	sumpPartLengthOfOilTrap: {value: number; label: string};
	layPeriod: {value: number; label: string};
}

interface RadialOilTrap {
	oilTrapDiameter: {value: number; label: string};
	fullOilTrapHeight: {value: number; label: string};
}

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

interface HydrocycloneOpened {
	coefficientProportion: {value: number; label: string};
	hydraulicPressure: {value: number; label: string};
	performance: {value: number; label: string};
	amountOfHydrocyclones: {value: number; label: string};
	diameterHydrocyclone: {value: number; label: string};
	currentHydrocyclone: CentrifugeSource.OpenHydrocycloneConfig;
}

interface HydrocyclonePressure {
	performance: {value: number; label: string};
	amountOfHydrocyclones: {value: number; label: string};
	amountOfAdditionalHydrocyclones: {value: number; label: string};
	currentPressureHydrocyclone: CentrifugeSource.PressureHydrocycloneTable;
}

interface Centrifuge {
	performance: {value: number; label: string};
	amountOfCentrifuges: {value: number; label: string};
	currentCentrifuge: CentrifugeSource.CentrifugeTable;
}

interface BubblingMechanism {
	averageLength: {value: number; label: string};
	distanceBetweenWallBubble: {value: number; label: string};
	distanceBetweenIntervalBubble: {value: number; label: string};
	commonAirFlow: {value: number; label: string};
}

interface MultichannelLengthMechanism {
	formOfAverage: AverageSource.FormOfAverage;
	averageLength: {value: number; label: string};
	channelWidthPrizma: {value: number; label: string};
	averageDiameter: {value: number; label: string};
	channelWidthCircle: {value: number; label: string};
}

interface MultichannelWidthMechanism {
	averageLength: {value: number; label: string};
	crossSectionalArea: {value: number; label: string};
	widthOfEachChannel: {value: string; label: string};
	waterFlowOfEachChannel: {value: string; label: string};
	squareBottomForEachChannel: {value: string; label: string};
	squareSideForEachChannel: {value: string; label: string};
}