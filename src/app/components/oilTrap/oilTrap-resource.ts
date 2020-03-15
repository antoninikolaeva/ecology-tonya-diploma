export namespace OilTrapSource {
	export enum minAmountOfSection {
		horizontal = 2,
		radial = 3,
	}
	export const capacityMark = 162;
	export const widthSection = 6;
	export const deepSection = 2;
	export enum SectionWidth {
		min = 2,
		max = 3,
	}
	export enum SectionDeep {
		min = 1.2,
		max = 1.5,
	}
	export enum HydraulicParticleSize {
		min = 0.4,
		max = 0.6,
	}
	export enum WaterSpeed {
		min = 3,
		max = 10,
	}
	export enum ImpurityEffectBlock {
		min = 60,
		max_horizontal = 70,
		max_radial = 75,
	}
	export enum borderHeight {
		min = 0.3,
		max = 0.5,
	}
	export const proportionSpeedHydraulic = [0.1, 10, 15, 20];
	export const turbulentCoefficient = [
		{proportion: 0.1, coefficient: 1.2},
		{proportion: 10, coefficient: 1.5},
		{proportion: 15, coefficient: 1.65},
		{proportion: 20, coefficient: 1.75},
	];
	export const mechanicImpurityConcentrate = 500;
	export const sedimentWet = 95;
	export const volumeMassSediment = 2.65;
	export const volumeMassOilProduct = 0.95;
	export const layPeriod = 6;
	export const volumeCoefficient = 0.6;
	export const hydraulicParticleSize = 0.2;
	export const sedimentZoneHeight = 0.3;
	export const heightOilProductLayer = 0.1;
}
