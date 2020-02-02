import { SourceOfWasteWater, HammerCrusher, Grate, GrateCrusher } from '../components/grate/grate-resources';

export interface GrateResultData {
	currentSuitableGrate: Grate;
	valueOfLedgeInstallationPlace: number;
	amountOfHammerCrushers: number;
	amountOfSuitableGrates: number;
	sizeOfInputChannelPart: number;
	sizeOfOutputChannelPart: number;
	lengthOfIncreaseChannelPart: number;
	commonLengthOfChamberGrate: number;
	amountOfWaste: number;
}

export class GeneralDataModel {
	private grateResult: GrateResultData;

	constructor() {
		this.initDataModel();
	}

	private initDataModel = () => {
		this.grateResult = {
			currentSuitableGrate: undefined,
			valueOfLedgeInstallationPlace: 0,
			amountOfHammerCrushers: 0,
			amountOfSuitableGrates: 0,
			sizeOfInputChannelPart: 0,
			sizeOfOutputChannelPart: 0,
			lengthOfIncreaseChannelPart: 0,
			commonLengthOfChamberGrate: 0,
			amountOfWaste: 0,
		};
	}

	public setGrateResult = (result: GrateResultData) => {
		this.grateResult = result;
	}

	public getGrateResult = (): GrateResultData => {
		return this.grateResult;
	}
}

export const dataModel: GeneralDataModel = new GeneralDataModel();