export namespace FilterSource {
	export enum BaseConcentrate {
		min = 10,
		max = 30,
	}
	export enum FilterTypes {
		grainyLittleOneLayerDownThread = 'grainyLittleOneLayerDownThread',
		grainyHugeOneLayerDownThread = 'grainyHugeOneLayerDownThread',
		grainyOneLayerUpThread = 'grainyOneLayerUpThread',
		grainyTwoLayers = 'grainyTwoLayers',
		grainyAerated = 'grainyAerated',
		grainyCarcase = 'grainyCarcase',
		swimPressure = 'swimPressure',
		microFilter = 'microFilter',
		drumNets = 'drumNets',
	}
	export interface FilterType {
		type: FilterTypes;
		name: string;
		clearEffectBPK: {
			min: number;
			max: number;
		}
		clearEffectSubstance: {
			min: number;
			max: number;
		}
	}
	export const filterTypes: FilterType[] = [
		{name: 'Однослойные мелкозернистые с нисходящим потоком', type: FilterTypes.grainyLittleOneLayerDownThread,
		clearEffectBPK: {min: 40, max: 60}, clearEffectSubstance: {min: 60, max: 75}},
		{name: 'Однослойные крупнозернистые с нисходящим потоком', type: FilterTypes.grainyHugeOneLayerDownThread,
		clearEffectBPK: {min: 30, max: 40}, clearEffectSubstance: {min: 25, max: 50}},
		{name: 'С восходящим потоком', type: FilterTypes.grainyOneLayerUpThread,
		clearEffectBPK: {min: 40, max: 65}, clearEffectSubstance: {min: 60, max: 85}},
		{name: 'Двухслойные', type: FilterTypes.grainyTwoLayers,
		clearEffectBPK: {min: 60, max: 70}, clearEffectSubstance: {min: 60, max: 80}},
		{name: 'Аэрируемые', type: FilterTypes.grainyAerated,
		clearEffectBPK: {min: 70, max: 100}, clearEffectSubstance: {min: 80, max: 100}},
		{name: 'Каркасно-засыпные', type: FilterTypes.grainyCarcase,
		clearEffectBPK: {min: 70, max: 70}, clearEffectSubstance: {min: 60, max: 80}},
		{name: 'С плавающей загрузкой', type: FilterTypes.swimPressure,
		clearEffectBPK: {min: 65, max: 75}, clearEffectSubstance: {min: 60, max: 85}},
		{name: 'Микрофильтры', type: FilterTypes.microFilter,
		clearEffectBPK: {min: 10, max: 30}, clearEffectSubstance: {min: 50, max: 60}},
		{name: 'Барабанные сетки', type: FilterTypes.drumNets,
		clearEffectBPK: {min: 0, max: 10}, clearEffectSubstance: {min: 0, max: 25}},
	];
	export interface GrainyFilterParameters {
		type: FilterTypes;
		speedNormal: { min: number; max: number };
		speedForced: { min: number; max: number };
		periodFilterCycle: number;
		intensiveFirst: { min: number; max: number };
		periodFirst: { min: number; max: number };
		intensiveSecond: { min: number; max: number };
		periodSecond: { min: number; max: number };
		intensiveThird: { min: number; max: number };
		periodThird: { min: number; max: number };
	}
	export const grainyFilters: GrainyFilterParameters[] = [
		{
			type: FilterTypes.grainyLittleOneLayerDownThread,
			speedNormal: { min: 6, max: 7 }, speedForced: { min: 7, max: 8 }, periodFilterCycle: 12,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 3, max: 5 }, periodSecond: { min: 10, max: 12 },
			intensiveThird: { min: 7, max: 7 }, periodThird: { min: 6, max: 8 },
		},
		{
			type: FilterTypes.grainyHugeOneLayerDownThread,
			speedNormal: { min: 16, max: 16 }, speedForced: { min: 18, max: 18 }, periodFilterCycle: 12,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 10, max: 10 }, periodSecond: { min: 4, max: 4 },
			intensiveThird: { min: 15, max: 15 }, periodThird: { min: 3, max: 3 },
		},
		{
			type: FilterTypes.grainyOneLayerUpThread,
			speedNormal: { min: 11, max: 12 }, speedForced: { min: 13, max: 14 }, periodFilterCycle: 12,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 3, max: 4 }, periodSecond: { min: 8, max: 10 },
			intensiveThird: { min: 6, max: 6 }, periodThird: { min: 6, max: 8 },
		},
		{
			type: FilterTypes.grainyTwoLayers,
			speedNormal: { min: 7, max: 8 }, speedForced: { min: 9, max: 10 }, periodFilterCycle: 24,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 15, max: 15 }, periodSecond: { min: 3, max: 3 },
			intensiveThird: { min: 15, max: 15 }, periodThird: { min: 3, max: 3 },
		},
		{
			type: FilterTypes.grainyAerated,
			speedNormal: { min: 6, max: 7 }, speedForced: { min: 7, max: 8 }, periodFilterCycle: 12,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 16, max: 18 }, periodSecond: { min: 7, max: 8 },
			intensiveThird: { min: 16, max: 18 }, periodThird: { min: 7, max: 8 },
		},
		{
			type: FilterTypes.grainyCarcase,
			speedNormal: { min: 10, max: 10 }, speedForced: { min: 15, max: 15 }, periodFilterCycle: 20,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 6, max: 8 }, periodSecond: { min: 5, max: 7 },
			intensiveThird: { min: 14, max: 16 }, periodThird: { min: 3, max: 3 },
		},
	];
	export enum CoefficientDrumNetsClean {
		min = 0.003,
		max = 0.005,
	}
	export const stayPeriodToClean = 20;
	export const minAmountGrainySection = 4;
	export enum FilteringSpeedNormal {
		min = 8,
		max = 10,
	}
	export const performanceForcedSpeed = 1.15;
	export interface MicroFilter {
		relation: {
			width: number;
			height: number;
		}
		square: number;
		performance: number;
	}
	export const microFilters: MicroFilter[] = [
		{square: 2.85, performance: 100, relation: {width: 1.5, height: 1.9}},
		{square: 4.2, performance: 160, relation: {width: 1.5, height: 2.8}},
		{square: 5.55, performance: 210, relation: {width: 1.5, height: 3.7}},
		{square: 8.4, performance: 400, relation: {width: 3, height: 2.8}},
		{square: 11.1, performance: 530, relation: {width: 3, height: 3.7}},
		{square: 13.8, performance: 660, relation: {width: 3, height: 4.6}},
	];
	export enum PerformanceMicroFilters {
		min = 100,
		max = 660,
	}
	export enum CoefficientIncreasePerformance {
		min = 1.03,
		max = 1.05,
	}
	export enum MicroFilterSpeedFiltering {
		min = 20,
		max = 25,
	}
	export enum DrumDeep {
		deepFirst = 0.6,
		coefficientFirst = 0.55,
		deepSecond = 0.7,
		coefficientSecond = 0.63,
	}
}