export namespace CentrifugeSource {
	export enum HydrocycloneOpenTypes {
		withoutDevice = 'withoutDevice',
		conusAndCylinder = 'conusAndCylinder',
		highLevelCenter = 'highLevelCenter',
		highLevelExternal = 'highLevelExternal',
	}
	export enum DiameterOpenHydrocyclone {
		min = 2,
		maxWithoutDevice = 10,
		maxAnother = 6,
	}
	export enum DiameterCentralHole {
		minCentral = 0.6,
		maxCentral = 1.4,
		minExternal = 0.9,
		maxExternal = 2.67,
	}
	export enum AmountOfLayer {
		min = 4,
		max = 20,
	}
	export const coefficientWithoutDevice = 0.62;
	export const coefficientConusAndCylinder = 1.98;
	export enum HydraulicHugest {
		min = 0,
		max = 1.9,
	}
	export enum ParticleHugest {
		min = 8,
		max = 200,
	}

	export interface PressureHydrocycloneTable {
		label: string;
		value: number;
		mark: string;
		diameter: number;
		diameterInPipe: number;
		diameterOutPipe: number;
		diameterSpecialPipe: number[];
		hugestParticular: {
			min: number;
			max: number;
		};
		deltaP: number;
		alpha: number;
		cylinderHeight: (diameter: number, value: number) => number;
	}
	export const pressureHydrocycloneTable: PressureHydrocycloneTable[] = [
		{ label: 'ГЦ-150К', value: 0.15, mark: 'ГЦ-150К', diameter: 0.15, diameterInPipe: 0.05, hugestParticular: {min: 28, max: 95},
			diameterSpecialPipe: [0.012, 0.017, 0.024], diameterOutPipe: 0.04, alpha: 20, cylinderHeight: undefined, deltaP: 0.1875},
		{ label: 'ГЦ-250К', value: 0.25, mark: 'ГЦ-250К', diameter: 0.25, diameterInPipe: 0.08, hugestParticular: {min: 37, max: 135},
			diameterSpecialPipe: [0.017, 0.024, 0.034], diameterOutPipe: 0.065, alpha: 20, cylinderHeight: undefined, deltaP: 0.2},
		{ label: 'ГЦ-350К', value: 0.35, mark: 'ГЦ-350К', diameter: 0.35, diameterInPipe: 0.1, hugestParticular: {min: 44, max: 180},
			diameterSpecialPipe: [0.024, 0.034, 0.048], diameterOutPipe: 0.09, alpha: 20, cylinderHeight: undefined, deltaP: 0.25},
		{ label: 'ГЦ-500К', value: 0.5, mark: 'ГЦ-500К', diameter: 0.5, diameterInPipe: 0.15, hugestParticular: {min: 52, max: 240},
			diameterSpecialPipe: [0.034, 0.048, 0.075], diameterOutPipe: 0.13, alpha: 20, cylinderHeight: undefined, deltaP: 0.3},
		{ label: 'ГЦ-710К', value: 0.71, mark: 'ГЦ-710К', diameter: 0.71, diameterInPipe: 0.15, hugestParticular: {min: 86, max: 295},
			diameterSpecialPipe: [0.048, 0.075, 0.1, 0.15, 0.2], diameterOutPipe: 0.2, alpha: 20, cylinderHeight: undefined, deltaP: 0.1},
		{ label: 'ГЦ-1000К', value: 1, mark: 'ГЦ-1000К', diameter: 1, diameterInPipe: 0.21, hugestParticular: {min: 115, max: 410},
			diameterSpecialPipe: [0.75, 0.1, 0.15, 0.2, 0.25], diameterOutPipe: 0.25, alpha: 20, cylinderHeight: undefined, deltaP: 0.1},
		{ label: 'ГЦ-1400К', value: 1.4, mark: 'ГЦ-1400К', diameter: 1.4, diameterInPipe: 0.3, hugestParticular: {min: 155, max: 570},
			diameterSpecialPipe: [0.15, 0.2, 0.25, 0.3, 0.35], diameterOutPipe: 0.38, alpha: 20, cylinderHeight: undefined, deltaP: 0.1},
		{ label: 'ГЦ-2000К', value: 2, mark: 'ГЦ-2000К', diameter: 2, diameterInPipe: 0.4, hugestParticular: {min: 215, max: 810},
			diameterSpecialPipe: [0.25, 0.3, 0.35, 0.4], diameterOutPipe: 0.5, alpha: 20, cylinderHeight: undefined, deltaP: 0.1},
	];
	export const gravityAcceleration = 9.8;
	export interface CentrifugeTable {
		mark: string;
		rotorDiameter: number;
		separateFactor: number;
		label: string;
		value: number;
	}
	export const centrifugeTableContinuous: CentrifugeTable[] = [
		{mark: '', rotorDiameter: undefined, separateFactor: undefined, label: 'Выберите центрифугу', value: undefined},
		{mark: 'ОГШ-202К-03', rotorDiameter: 0.200, separateFactor: 4000, label: 'ОГШ-202К-03', value: 0.200},
		{mark: 'ОГШ-321К-01', rotorDiameter: 0.320, separateFactor: 3231, label: 'ОГШ-321К-01', value: 0.320},
		{mark: 'ОГШ-321К-05', rotorDiameter: 0.325, separateFactor: 2200, label: 'ОГШ-321К-05', value: 0.325},
		{mark: 'ОГШ-352К-01', rotorDiameter: 0.350, separateFactor: 3535, label: 'ОГШ-352К-01', value: 0.350},
		{mark: 'ОГШ-352К-05', rotorDiameter: 0.350, separateFactor: 3535, label: 'ОГШ-352К-05', value: 0.350},
		{mark: 'ОГШ-352К-09', rotorDiameter: 0.350, separateFactor: 2500, label: 'ОГШ-352К-09', value: 0.350},
		{mark: 'ОГШ-501К-06', rotorDiameter: 0.500, separateFactor: 2190, label: 'ОГШ-501К-06', value: 0.500},
		{mark: 'ОГШ-501К-10', rotorDiameter: 0.500, separateFactor: 1960, label: 'ОГШ-501К-10', value: 0.500},
		{mark: 'ОГШ-501К-11', rotorDiameter: 0.200, separateFactor: 2190, label: 'ОГШ-501К-11', value: 0.200},
		{mark: 'ОГШ-631К-02', rotorDiameter: 0.630, separateFactor: 1420, label: 'ОГШ-631К-02', value: 0.630},
		{mark: 'ОГШ-631К-06', rotorDiameter: 0.630, separateFactor: 2520, label: 'ОГШ-631К-06', value: 0.630},
		{mark: 'ОГШ-802К-07', rotorDiameter: 0.800, separateFactor: 1530, label: 'ОГШ-802К-07', value: 0.800},
	];
	export const centrifugeTableDeterminate: CentrifugeTable[] = [
		{mark: '', rotorDiameter: undefined, separateFactor: undefined, label: 'Выберите центрифугу', value: undefined},
		{mark: 'ОТР-102K-01', rotorDiameter: 0.105, separateFactor: 16940, label: 'ОТР-102K-01', value: 0.105},
		{mark: 'ОТР-151K-01', rotorDiameter: 0.150, separateFactor: 15250, label: 'ОТР-151K-01', value: 0.150},
		{mark: 'ОМБ-803К-03', rotorDiameter: 0.800, separateFactor: 1000, label: 'ОМБ-803К-03', value: 0.800},
		{mark: 'ОМД-1202К-2', rotorDiameter: 1.200, separateFactor: 605, label: 'ОМД-1202К-2', value: 1.200},
	];
	export enum CoefficientCentrifugeVolume {
		min = 0.4,
		max = 0.6,
	}
	export interface OpenHydrocycloneConfig {
		type: HydrocycloneOpenTypes;
		diameter: (diameter: number) => number;
		heightCylinderPart: (diameter: number) => number;
		sizeOfOutPipe: (diameter: number) => number;
		amountOfDropIn: number;
		angleOfConusPart: number;
		angleConusDiaphragm: number;
		diameterCentralHole: (diameter: number) => number;
		diameterInsideHole: (diameter: number) => number;
		heightInsideHole: (diameter: number) => number;
		heightWaterOutWall: number;
		diameterWaterOutWall: (diameter: number) => number;
		diameterCircleWall: (diameter: number) => number;
		flowSpeed: number;
	}
	export const openHydrocycloneConfiguration: OpenHydrocycloneConfig[] = [

	];
}
