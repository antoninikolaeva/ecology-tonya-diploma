export namespace SandTrapSource {
	export const minSpeedWaterFlow = 0.15;
	export const maxSpeedWaterFlow = 0.3;
	export enum HydraulicFinenessSand {
		low = 13.2,
		middle = 18.7,
		high = 24.2
	}
	export const hydraulicFinenessSandListLess = [
		HydraulicFinenessSand.low,
		HydraulicFinenessSand.middle,
	];
	export const hydraulicFinenessSandListHigh = [
		HydraulicFinenessSand.middle,
		HydraulicFinenessSand.high,
	];
	export const hydraulicFinenessSandListFull = [
		HydraulicFinenessSand.low,
		HydraulicFinenessSand.middle,
		HydraulicFinenessSand.high,
	];
	export enum CoefficientOfSandTrapLength {
		middle = 1.7,
		high = 1.3
	}
	export enum SandTrapDeep {
		horizontalMin = 0.5,
		horizontalMax = 2,
		aeratedMin = 0.7,
		aeratedMax = 3.5,
		tangential = 0.5,
	}
	export const minSpeedFlowLimit = 0.15;
	export const maxSpeedFlowLimit = 0.3;
	export const minWaterFlowPeriod = 30;
	export enum AmountOfBlockedSand {
		horizontalAndTangential = 0.02,
		aerated = 0.03,
	}
	export const minPeriodRemoveSediment = 0;
	export const maxPeriodRemoveSediment = 2;
	export const coefficientDispersionOfSediment = 3;
	export const widthCircleGutterForHorizontalCircle = [0.5, 0.8, 1, 1.4, 1.5, 1.8];
	export const diameterLowBaseOfBunker = 0.4;
	export const sandTrapPressureMinTangential = 90;
	export const sandTrapPressureMinVertical = 70;
	export const sandTrapPressureMax = 130;
	export const maxDiameterOfTangential = 6;
	export const timeWaterInTrapMin = 120;
	export const timeWaterInTrapMax = 180;
	export enum Alpha {
		low = 1,
		middle = 1.25,
		high = 1.5
	}
	export const alphaList = [1, 1.25, 1.5];
	export enum CoefficientOfLengthAlpha {
		alphaLowHydroLow = 2.62,
		alphaLowHydroMiddle = 2.43,
		alphaMiddleHydroLow = 2.5,
		alphaMiddleHydroMiddle = 2.25,
		alphaHighHydroLow = 2.39,
		alphaHighHydroMiddle = 2.08,
	}
	export const riseWaterSpeed = 0.0065;
	export const widthSandBox = 0.5;
	export const sandLayerHeightMin = 0.2;
	export const sandLayerHeightMax = 0.5;
	export const aeratedIntensiveMin = 3;
	export const aeratedIntensiveMax = 5;
	export const startPipeWaterSpeed = 3;
	export const gravityAcceleration = 9.8;
}