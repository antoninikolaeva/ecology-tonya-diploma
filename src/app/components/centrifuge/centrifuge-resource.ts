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
		mark: string;
		diameter: number;
		diameterInPipe: number;
		diameterOutPipe: number;
		deltaP: number;
		particleHugest: {min: number; max: number};
		label: string;
		value: number;
	}
	export const pressureHydrocycloneTable: PressureHydrocycloneTable[] = [
		{ label: 'ГН-25', value: 25, particleHugest: { min: 8, max: 25 },
		mark: 'ГН-25', diameter: 25, diameterInPipe: 6, diameterOutPipe: 8, deltaP: 0.1 },
		{ label: 'ГН-40', value: 40, particleHugest: { min: 10, max: 30 },
		mark: 'ГН-40', diameter: 40, diameterInPipe: 8, diameterOutPipe: 12, deltaP: 0.1 },
		{ label: 'ГН-60', value: 60, particleHugest: { min: 15, max: 35 },
		mark: 'ГН-60', diameter: 60, diameterInPipe: 12, diameterOutPipe: 16, deltaP: 0.15 },
		{ label: 'ГН-80', value: 80, particleHugest: { min: 18, max: 40 },
		mark: 'ГН-80', diameter: 80, diameterInPipe: 16, diameterOutPipe: 20, deltaP: 0.2 },
		{ label: 'ГН-100', value: 100, particleHugest: { min: 20, max: 50 },
		mark: 'ГН-100', diameter: 100, diameterInPipe: 32, diameterOutPipe: 32, deltaP: 0.2 },
		{ label: 'ГН-125', value: 125, particleHugest: { min: 25, max: 60 },
		mark: 'ГН-125', diameter: 125, diameterInPipe: 32, diameterOutPipe: 40, deltaP: 0.2 },
		{ label: 'ГН-160', value: 160, particleHugest: { min: 30, max: 70 },
		mark: 'ГН-160', diameter: 160, diameterInPipe: 40, diameterOutPipe: 50, deltaP: 0.2 },
		{ label: 'ГН-200', value: 200, particleHugest: { min: 35, max: 85 },
		mark: 'ГН-200', diameter: 200, diameterInPipe: 50, diameterOutPipe: 60, deltaP: 0.25 },
		{ label: 'ГН-250', value: 250, particleHugest: { min: 40, max: 110 },
		mark: 'ГН-250', diameter: 250, diameterInPipe: 60, diameterOutPipe: 80, deltaP: 0.25 },
		{ label: 'ГН-320', value: 320, particleHugest: { min: 45, max: 150 },
		mark: 'ГН-320', diameter: 320, diameterInPipe: 80, diameterOutPipe: 100, deltaP: 0.3 },
		{ label: 'ГН-400', value: 400, particleHugest: { min: 50, max: 170 },
		mark: 'ГН-400', diameter: 400, diameterInPipe: 100, diameterOutPipe: 125, deltaP: 0.3 },
		{ label: 'ГН-500', value: 500, particleHugest: { min: 55, max: 200 },
		mark: 'ГН-500', diameter: 500, diameterInPipe: 125, diameterOutPipe: 160, deltaP: 0.35 },
		{ label: 'ГЦ-150', value: 150, particleHugest: { min: 30, max: 95 },
		mark: 'ГЦ-150', diameter: 150, diameterInPipe: 50, diameterOutPipe: 40, deltaP: 0.2 },
		{ label: 'ГЦ-250', value: 250, particleHugest: { min: 37, max: 135 },
		mark: 'ГЦ-250', diameter: 250, diameterInPipe: 80, diameterOutPipe: 65, deltaP: 0.25 },
		{ label: 'ГЦ-350', value: 350, particleHugest: { min: 44, max: 180 },
		mark: 'ГЦ-350', diameter: 350, diameterInPipe: 100, diameterOutPipe: 90, deltaP: 0.3 },
		{ label: 'ГЦ-500', value: 500, particleHugest: { min: 52, max: 200 },
		mark: 'ГЦ-500', diameter: 500, diameterInPipe: 150, diameterOutPipe: 130, deltaP: 0.35 },
	];
	export const gravityAcceleration = 9.8;
	export interface CentrifugeTable {
		mark: string;
		rotorVolume: number;
		separateFactor: number;
		label: string;
		value: number;
	}
	export const centrifugeTableContinuous: CentrifugeTable[] = [
		{mark: '', rotorVolume: undefined, separateFactor: undefined, label: 'Выберите центрифугу', value: undefined},
		{mark: 'ОГШ-352К-6', rotorVolume: 0.06, separateFactor: 3140, label: 'ОГШ-352К-6', value: 0.06},
		{mark: 'ОГШ-352К-1', rotorVolume: 0.06, separateFactor: 3140, label: 'ОГШ-352К-1', value: 0.06},
		{mark: 'ОГШ-501К-6', rotorVolume: 0.17, separateFactor: 2000, label: 'ОГШ-501К-6', value: 0.17},
		{mark: 'ОГШ-631К-2', rotorVolume: 0.35, separateFactor: 1415, label: 'ОГШ-631К-2', value: 0.35},
		{mark: 'ОГШ-802К-7', rotorVolume: 0.72, separateFactor: 1500, label: 'ОГШ-802К-7', value: 0.72},
		{mark: 'НОГШ-1203К-1', rotorVolume: 2.44, separateFactor: 430, label: 'НОГШ-1203К-1', value: 2.44},
		{mark: 'НОГШ-132', rotorVolume: 3.25, separateFactor: 830, label: 'НОГШ-132', value: 3.25},
	];
	export const centrifugeTableDeterminate: CentrifugeTable[] = [
		{mark: '', rotorVolume: undefined, separateFactor: undefined, label: 'Выберите центрифугу', value: undefined},
		{mark: 'ОТР-10', rotorVolume: 0.015, separateFactor: 13000, label: 'ОТР-10', value: 0.015},
		{mark: 'ОТР-15', rotorVolume: 0.035, separateFactor: 15000, label: 'ОТР-15', value: 0.035},
		{mark: 'Г-4', rotorVolume: 0.56, separateFactor: 1250, label: 'Г-4', value: 0.56},
		{mark: 'Г-2', rotorVolume: 1.33, separateFactor: 950, label: 'Г-2', value: 1.33},
		{mark: '20ГН-2201У-1', rotorVolume: 19.9, separateFactor: 600, label: '20ГН-2201У-1', value: 19.9},
	];
	export enum CoefficientCentrifugeVolume {
		min = 0.4,
		max = 0.6,
	}
}
