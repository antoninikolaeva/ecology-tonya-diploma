import { Grate, GrateCrusher } from '../components/grate/grate-resources';

export interface GrateResultData {
	currentSuitableGrate: Grate;
	currentGrateCrusher: GrateCrusher;
	valueOfLedgeInstallationPlace: number;
	amountOfHammerCrushers: number;
	amountOfSuitableGrates: number;
	sizeOfInputChannelPart: number;
	sizeOfOutputChannelPart: number;
	lengthOfIncreaseChannelPart: number;
	commonLengthOfChamberGrate: number;
	amountOfWaste: number;
}

export interface SandTrapHorizontalForwardResult {
	amountOfSandTrapSection: number;
	widthOfSandTrap: number;
	lengthOfSandTrap: number;
	fullSandTrapHeight: number;
	deepSandTrapSection: number;
}
export interface SandTrapHorizontalCircleResult {
	amountOfSandTrapSection: number;
	lengthOfSandTrap: number;
	fullSandTrapHeight: number;
	middleDiameter: number;
	outputDiameter: number;
	bunkerHeightConusPart: number;
}
export interface SandTrapVerticalAndTangentialResult {
	amountOfSandTrapSection: number;
	fullSandTrapHeight: number;
	deepOfTheBunker: number;
	heightOfTheBunker: number;
	squareOfEachCompartment: number;
	diameterOfEachCompartment: number;
}
export interface SandTrapAeratedResult {
	amountOfSandTrapSection: number;
	widthOfSandTrap: number;
	lengthOfSandTrap: number;
	hydroMechanicWaterFlow: number;
	outputPipePressure: number;
	generalAirFlow: number;
	deepSandTrapSection: number;
}
export interface SandTrapResultData {
	horizontalForward?: SandTrapHorizontalForwardResult;
	horizontalCircle?: SandTrapHorizontalCircleResult;
	tangential?: SandTrapVerticalAndTangentialResult;
	vertical?: SandTrapVerticalAndTangentialResult;
	aerated?: SandTrapAeratedResult;
}

export interface SumpResultData {
	highLightEffect: number;
	hydraulicHugest: number;
	summaWidthAllSection: number;
	amountOfSection: number;
	fullSumpHeight: number;
	sedimentAmountDaily: number;
}

export interface AverageResultData {

}

export class GeneralDataModel {
	private grateResult: GrateResultData;
	private sandTrapResult: SandTrapResultData;
	private sumpResult: SumpResultData;
	private averageResult: AverageResultData;

	constructor() {
		this.initDataModel();
	}

	private initDataModel() {
		this.grateResult = {
			currentSuitableGrate: undefined,
			currentGrateCrusher: undefined,
			valueOfLedgeInstallationPlace: undefined,
			amountOfHammerCrushers: undefined,
			amountOfSuitableGrates: undefined,
			sizeOfInputChannelPart: undefined,
			sizeOfOutputChannelPart: undefined,
			lengthOfIncreaseChannelPart: undefined,
			commonLengthOfChamberGrate: undefined,
			amountOfWaste: undefined,
		};
		this.sandTrapResult = {
			horizontalForward: {
				amountOfSandTrapSection: undefined,
				deepSandTrapSection: undefined,
				fullSandTrapHeight: undefined,
				lengthOfSandTrap: undefined,
				widthOfSandTrap: undefined,
			},
			horizontalCircle: {
				amountOfSandTrapSection: undefined,
				bunkerHeightConusPart: undefined,
				fullSandTrapHeight: undefined,
				lengthOfSandTrap: undefined,
				middleDiameter: undefined,
				outputDiameter: undefined,
			},
			aerated: {
				amountOfSandTrapSection: undefined,
				deepSandTrapSection: undefined,
				generalAirFlow: undefined,
				hydroMechanicWaterFlow: undefined,
				lengthOfSandTrap: undefined,
				outputPipePressure: undefined,
				widthOfSandTrap: undefined,
			},
			tangential: {
				amountOfSandTrapSection: undefined,
				deepOfTheBunker: undefined,
				diameterOfEachCompartment: undefined,
				fullSandTrapHeight: undefined,
				heightOfTheBunker: undefined,
				squareOfEachCompartment: undefined,
			},
			vertical: {
				amountOfSandTrapSection: undefined,
				deepOfTheBunker: undefined,
				diameterOfEachCompartment: undefined,
				fullSandTrapHeight: undefined,
				heightOfTheBunker: undefined,
				squareOfEachCompartment: undefined,
			}
		};
		this.sumpResult = {
			amountOfSection: undefined,
			fullSumpHeight: undefined,
			highLightEffect: undefined,
			hydraulicHugest: undefined,
			sedimentAmountDaily: undefined,
			summaWidthAllSection: undefined,
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

	public resetResultData() {
		this.initDataModel();
	}
}

export const dataModel: GeneralDataModel = new GeneralDataModel();
