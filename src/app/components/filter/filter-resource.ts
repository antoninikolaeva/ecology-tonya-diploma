export namespace FilterSource {

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
		};
		clearEffectSubstance: {
			min: number;
			max: number;
		};
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
	export enum TypeOfCleanGrainyFilter {
		air = 'air',
		airAndWater = 'airAndWater',
		water = 'water',
		all = 'all',
	}
	export interface GrainyFilterParameters {
		type: FilterTypes;
		speedNormal: { min: number; max: number };
		speedForced: { min: number; max: number };
		periodFilterCycle: number;
		intensiveFirst: { min: number; max: number };
		periodFirst: { min: number; max: number };
		intensiveSecond: { min: number; max: number };
		periodSecond: { min: number; max: number };
		intensiveThirdAir: { min: number; max: number };
		intensiveThirdWater: { min: number; max: number };
		periodThirdAir: { min: number; max: number };
		periodThirdWater: { min: number; max: number };
	}

	export const grainyFilters: GrainyFilterParameters[] = [
		{
			type: FilterTypes.grainyLittleOneLayerDownThread,
			speedNormal: { min: 6, max: 7 }, speedForced: { min: 7, max: 8 }, periodFilterCycle: 12,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 3, max: 5 }, periodSecond: { min: 10, max: 12 },
			intensiveThirdAir: { min: 18, max: 20 }, periodThirdAir: { min: 2, max: 2 },
			intensiveThirdWater: { min: 7, max: 7 }, periodThirdWater: { min: 6, max: 8 },
		},
		{
			type: FilterTypes.grainyHugeOneLayerDownThread,
			speedNormal: { min: 16, max: 16 }, speedForced: { min: 18, max: 18 }, periodFilterCycle: 12,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 10, max: 10 }, periodSecond: { min: 4, max: 4 },
			intensiveThirdAir: { min: 16, max: 16 }, periodThirdAir: { min: 3, max: 3 },
			intensiveThirdWater: { min: 15, max: 15 }, periodThirdWater: { min: 3, max: 3 },
		},
		{
			type: FilterTypes.grainyOneLayerUpThread,
			speedNormal: { min: 11, max: 12 }, speedForced: { min: 13, max: 14 }, periodFilterCycle: 12,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 3, max: 4 }, periodSecond: { min: 8, max: 10 },
			intensiveThirdAir: { min: 18, max: 20 }, periodThirdAir: { min: 2, max: 2 },
			intensiveThirdWater: { min: 6, max: 6 }, periodThirdWater: { min: 6, max: 8 },
		},
		{
			type: FilterTypes.grainyTwoLayers,
			speedNormal: { min: 7, max: 8 }, speedForced: { min: 9, max: 10 }, periodFilterCycle: 24,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: undefined, max: undefined }, periodSecond: { min: undefined, max: undefined },
			intensiveThirdAir: { min: undefined, max: undefined }, periodThirdAir: { min: undefined, max: undefined },
			intensiveThirdWater: { min: 15, max: 15 }, periodThirdWater: { min: 3, max: 3 },
		},
		{
			type: FilterTypes.grainyAerated,
			speedNormal: { min: 6, max: 7 }, speedForced: { min: 7, max: 8 }, periodFilterCycle: 24,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: undefined, max: undefined }, periodSecond: { min: undefined, max: undefined },
			intensiveThirdAir: { min: undefined, max: undefined }, periodThirdAir: { min: undefined, max: undefined },
			intensiveThirdWater: { min: 16, max: 18 }, periodThirdWater: { min: 7, max: 8 },
		},
		{
			type: FilterTypes.grainyCarcase,
			speedNormal: { min: 10, max: 10 }, speedForced: { min: 15, max: 15 }, periodFilterCycle: 20,
			intensiveFirst: { min: 16, max: 18 }, periodFirst: { min: 6, max: 8 },
			intensiveSecond: { min: 6, max: 8 }, periodSecond: { min: 5, max: 7 },
			intensiveThirdAir: { min: 14, max: 16 }, periodThirdAir: { min: undefined, max: undefined },
			intensiveThirdWater: { min: 14, max: 16 }, periodThirdWater: { min: 3, max: 3 },
		},
	];
	export enum CoefficientDrumNetsClean {
		min = 0.003,
		max = 0.005,
	}
	export const stayPeriodToClean = 20;
	export const minAmountFilterSection = 4;
	export const minAmountDrumNetsSection = 6;
	export enum FilteringSpeedNormal {
		min = 8,
		max = 10,
	}
	export const performanceForcedSpeed = 1.15;
	export interface MicroFilter {
		value: number;
		label: string;
		relation: {
			width: number;
			height: number;
		}
		square: number;
		performance: number;
	}
	export const microFilters: MicroFilter[] = [
		{value: 100, label: '1.5x1.9', square: 2.85, performance: 100, relation: {width: 1.5, height: 1.9}},
		{value: 160, label: '1.5x2.8', square: 4.2, performance: 160, relation: {width: 1.5, height: 2.8}},
		{value: 210, label: '1.5x3.7', square: 5.55, performance: 210, relation: {width: 1.5, height: 3.7}},
		{value: 400, label: '3x2.8', square: 8.4, performance: 400, relation: {width: 3, height: 2.8}},
		{value: 530, label: '3x3.7', square: 11.1, performance: 530, relation: {width: 3, height: 3.7}},
		{value: 660, label: '3x4.6', square: 13.8, performance: 660, relation: {width: 3, height: 4.6}},
	];
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
	export interface DrumNets {
		value: number;
		label: string;
		performance: number;
	}
	export const drumNets: DrumNets[] = [
		{label: '1.5x1.9', value: 350, performance: 350},
		{label: '1.5x2.8', value: 550, performance: 550},
		{label: '1.5x3.7', value: 750, performance: 750},
		{label: '3x2.8', value: 1250, performance: 1250},
		{label: '3x3.7', value: 1650, performance: 1650},
		{label: '3x4.6', value: 2100, performance: 2100},
	];
	export const minMicroFilterPerformance = 100;
	export const minDrumNetsPerformance = 350;
	export enum AmountFilterWaterClean {
		min = 8,
		max = 12,
	}
	export enum CleanWaterFlow {
		min = 0.3,
		max = 0.5,
	}
	export const periodOfWaterClean = 5;
	export const day = 24;
}