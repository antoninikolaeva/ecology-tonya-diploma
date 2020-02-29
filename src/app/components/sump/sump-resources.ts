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

		{ highLightEffect: 70, concentrate: 200, period: 7200 },
		{ highLightEffect: 70, concentrate: 300, period: 7200 },
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
		min =  1.5,
		max = 4,
	}
	export enum HighLightEffectDiapason {
		low = 50,
		high = 70
	}
}
