export namespace GrateSource {
	export enum SpeedOfWaterInChannel {
		min = 0.6,
		max = 0.8,
	}

	export enum SpeedOfWaterInSection {
		min = 0.8,
		max = 1,
	}

	export enum WidthSection {
		min = 0.01,
		max = 0.016,
	}

	export enum RodThickness {
		min = 0.006,
		max = 0.01,
	}

	export const standardChannelWidth = [0.4, 0.6, 0.8, 1, 1.25, 1.4, 1.6, 1.8, 2, 2.2, 2.4];

	export enum InclineAngle {
		min = 60,
		max = 70,
	}

	export enum FormOfRods {
		prizma = 2.42,
		circle = 1.79,
		prizmaWithCircleEdge = 1.83,
	}

	export interface Grate {
		mark: string;
		iri: string;
		countingFlow: number;
	}

	export interface HammerCrusher {
		iri: string;
		mark: string;
		performance: {
			min: number;
			max: number;
		};
	}

	export interface GrateCrusher {
		mark: string;
		iri: string;
		maxPerformance: number;
		squareHeliumHole: number;
		diameterOfDrum: number;
		speedWater: {
			min: number;
			max: number;
		}
	}

	export enum AmountOfAdditionalGrates {
		min = 1,
		max = 2,
		limit = 3,
	}

	export const anglePhi = 20;

	export function transferRadiansToDegrees(radians: number): number {
		return radians * Math.PI / 180;
	}

	export const gravityConst = 9.80666;

	export const coefficientLooseIncrease = 3;

	export enum AmountOfWaste {
		startX = 0.01,
		startY = 25,
		endX = 0.016,
		endY = 8,
	}

	export enum CheckSpeedInSection {
		min = 0.8,
		max = 1,
	}

	export const grates: Grate[] = [
		{ mark: 'РГМ(Н)0608', iri: 'http://tonya-diploma.com/device/grate/rgm0608', countingFlow: 480 },
		{ mark: 'РГМ(Н)0814', iri: 'http://tonya-diploma.com/device/grate/rgm0814', countingFlow: 610 },
		{ mark: 'РГМ(Н)1010', iri: 'http://tonya-diploma.com/device/grate/rgm1010', countingFlow: 610 },
		{ mark: 'РГМ(Н)1012', iri: 'http://tonya-diploma.com/device/grate/rgm1012', countingFlow: 690 },
		{ mark: 'РГМ(Н)1016', iri: 'http://tonya-diploma.com/device/grate/rgm1016', countingFlow: 1040 },
		{ mark: 'РГМ(Н)1020', iri: 'http://tonya-diploma.com/device/grate/rgm1020', countingFlow: 1390 },
		{ mark: 'РГМ(Н)1420', iri: 'http://tonya-diploma.com/device/grate/rgm1420', countingFlow: 1940 },
		{ mark: 'РГМ(Н)1620', iri: 'http://tonya-diploma.com/device/grate/rgm1620', countingFlow: 2080 },
		{ mark: 'РГМ(Н)2020', iri: 'http://tonya-diploma.com/device/grate/rgm2020', countingFlow: 2770 },

		{ mark: 'РСМ0507', iri: 'http://tonya-diploma.com/device/grate/rsm0507', countingFlow: 230 },
		{ mark: 'РСМ0710', iri: 'http://tonya-diploma.com/device/grate/rsm0710', countingFlow: 455 },
		{ mark: 'РСМ0812', iri: 'http://tonya-diploma.com/device/grate/rsm0812', countingFlow: 625 },
		{ mark: 'РСМ1012', iri: 'http://tonya-diploma.com/device/grate/rsm1012', countingFlow: 780 },
		{ mark: 'РСМ1216', iri: 'http://tonya-diploma.com/device/grate/rsm1216', countingFlow: 1250 },
		{ mark: 'РСМ1620', iri: 'http://tonya-diploma.com/device/grate/rsm1620', countingFlow: 2080 },
		{ mark: 'РСМ2020', iri: 'http://tonya-diploma.com/device/grate/rsm2020', countingFlow: 2770 },
		{ mark: 'РСМ2125', iri: 'http://tonya-diploma.com/device/grate/rsm2125', countingFlow: 3410 },

		{ mark: 'РКМ0608', iri: 'http://tonya-diploma.com/device/grate/rkm0608', countingFlow: 480 },
		{ mark: 'РКМ0814', iri: 'http://tonya-diploma.com/device/grate/rkm0814', countingFlow: 610 },
		{ mark: 'РКМ1010', iri: 'http://tonya-diploma.com/device/grate/rkm1010', countingFlow: 610 },
		{ mark: 'РКМ1012', iri: 'http://tonya-diploma.com/device/grate/rkm1012', countingFlow: 690 },
		{ mark: 'РКМ1016', iri: 'http://tonya-diploma.com/device/grate/rkm1016', countingFlow: 1040 },
		{ mark: 'РКМ1020', iri: 'http://tonya-diploma.com/device/grate/rkm1020', countingFlow: 1390 },
		{ mark: 'РКМ1420', iri: 'http://tonya-diploma.com/device/grate/rkm1420', countingFlow: 1940 },
		{ mark: 'РКМ1620', iri: 'http://tonya-diploma.com/device/grate/rkm1620', countingFlow: 2080 },
		{ mark: 'РКМ2020', iri: 'http://tonya-diploma.com/device/grate/rkm2020', countingFlow: 2770 },
	];

	export const hammerCrushers: HammerCrusher[] = [
		{ mark: 'Д-3б', performance: {min: 300, max: 600}, iri: 'http://tonya-diploma.com/device/hammer-crusher/d3b'},
		{ mark: 'ДК-0,5', performance: {min: 500, max: 500}, iri: 'http://tonya-diploma.com/device/hammer-crusher/dk05'},
		{ mark: 'ДК-1,0', performance: {min: 1000, max: 1000}, iri: 'http://tonya-diploma.com/device/hammer-crusher/dk1-0'},
	];

	export const grateCrushers: GrateCrusher[] = [
		{
			mark: 'РД-200', maxPerformance: 60, iri: 'http://tonya-diploma.com/device/grate/rd200',
			squareHeliumHole: 0.019, diameterOfDrum: 0.18, speedWater: {min: 1, max: 1.2},
		},
		{
			mark: 'РД-600', maxPerformance: 2000, iri: 'http://tonya-diploma.com/device/grate/rd600',
			squareHeliumHole: 0.455, diameterOfDrum: 0.635, speedWater: {min: 1, max: 1.2},
		},
	];
}