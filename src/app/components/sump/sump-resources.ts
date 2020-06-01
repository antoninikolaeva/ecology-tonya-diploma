export namespace SumpSource {
	export const minConcentrate = 200;
	export const maxConcentrate = 400;
	export const periodOfSettling: {highLightEffect: number; concentrate: number; period: number}[] = [
		{ highLightEffect: 20, concentrate: 200, period: 600 },
		{ highLightEffect: 20, concentrate: 300, period: 540 },
		{ highLightEffect: 20, concentrate: 400, period: 480 },

		{ highLightEffect: 30, concentrate: 200, period: 960 },
		{ highLightEffect: 30, concentrate: 300, period: 900 },
		{ highLightEffect: 30, concentrate: 400, period: 840 },

		{ highLightEffect: 40, concentrate: 200, period: 1440 },
		{ highLightEffect: 40, concentrate: 300, period: 1200 },
		{ highLightEffect: 40, concentrate: 400, period: 1080 },

		{ highLightEffect: 50, concentrate: 200, period: 2160 },
		{ highLightEffect: 50, concentrate: 300, period: 1800 },
		{ highLightEffect: 50, concentrate: 400, period: 1500 },

		{ highLightEffect: 60, concentrate: 200, period: 7200 },
		{ highLightEffect: 60, concentrate: 300, period: 3600 },
		{ highLightEffect: 60, concentrate: 400, period: 2700 },

		{ highLightEffect: 70, concentrate: 200, period: 18720 },
		{ highLightEffect: 70, concentrate: 300, period: 9360 },
		{ highLightEffect: 70, concentrate: 400, period: 7200 },
	];
	export const highLightEffectFixedValues = [20, 30, 40, 50, 60, 70];
	export const concentrateFixedValues = [200, 300, 400];
	export enum CoefficientUsingVolume {
		horizontal = 0.5,
		radial = 0.45,
		vertical = 0.35,
		downUpFlow = 0.65,
	}
	export const layerHeight = 0.5;
	export enum WorkingDeep {
		min_horizontal_radial =  1.5,
		max_horizontal = 4,
		min_vertical_up_down = 2.7,
		max_vertical_up_down = 3.8,
		max_radial = 5,
	}
	export enum HighLightEffectDiapason {
		low = 50,
		high = 70,
	}
	export enum WorkingThreadSpeed {
		downUpMin = 2,
		downUpMax = 3,
		min = 5,
		middle = 10,
		max = 15
	}
	export const minWorkingThreadSpeedGeneralPipe = 0.03;
	export enum WidthSectionCoefficient {
		min = 1,
		max = 5,
	}
	export const minAmountOfSection = 2;
	export enum TurbulentCoefficient {
		min = 0,
		middle = 0.05,
		max= 0.1,
	}
	export enum BorderHeight {
		min = 0.3,
		max = 0.5,
	}
	export enum SedimentWet {
		min = 94,
		max = 96,
	}
	export enum Alpha {
		min = 50,
		middle = 55,
		max = 60,
	}
	export const heightOfNeutralLayer = 0.3;
	export const sedimentDensity = 1.01 * Math.pow(10, 4);
	export const speedInGap = 0.02;
	export enum SumpDiameters {
		min = 4,
		middle = 6,
		max = 9,
	}

	export enum PeriodBetweenClean {
		hydrostatic = 'hydrostatic',
		mechanic = 'mechanic',
	}

	export enum PeriodBetweenCleanValues {
		hydrostatic = 48,
		mechanic = 8,
	}
}
