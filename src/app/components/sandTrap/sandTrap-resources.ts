export const minSpeedWaterFlow = 0.15;
export const maxSpeedWaterFlow = 0.3;
export enum HydraulicFinenessSand {
	middle = 18.7,
	high = 24.2
}
export const hydraulicFinenessSandList = [
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
