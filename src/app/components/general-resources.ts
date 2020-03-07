import { ElementIri } from 'ontodia';

// sump - отстойник для воды
// average - усреднитель
export enum KindOfDevices {
	grate = 'grate',
	sandTrap = 'sandTrap',
	sump = 'sump',
	average = 'average',
	oilTrap = 'oilTrap',
	filter = 'filter',
	centrifuge = 'centrifuge'
};

// aerated - аэрируемые песколовки
// volleyDischarge - залповый сброс
// cyclicFluctuation - циклическе колебания
// grainy - зернистый
// drum - барабанный
// pressure - напорные гидроциклоны
// continuous - непрерывные центрифуги
// determine - периодические центрифуги

export interface DeviceType {
	iri: ElementIri;
	key: GrateTypes | SandTrapTypes | SumpTypes | AverageTypes | OilTrapTypes | FilterTypes | CentrifugeTypes;
	name: string;
	ref: HTMLInputElement;
	minDailyWaterFlow?: number;
	maxDailyWaterFlow?: number;
}

export enum GrateTypes { mechanic = 'mechanic', hand = 'hand', crusher = 'crusher' }
export const grateTypes: DeviceType[] = [
	{
		iri: 'http://tonya-diploma.com/device/grate/mechanic' as ElementIri,
		key: GrateTypes.mechanic, name: 'Механическая очистка', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/grate/hand' as ElementIri,
		key: GrateTypes.hand, name: 'Ручная очиска', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/grate/crusher' as ElementIri,
		key: GrateTypes.crusher, name: 'Дробилки', ref: undefined
	},
];
export enum SandTrapTypes {
	horizontalForward = 'horizontalForward',
	horizontalCircle = 'horizontalCircle',
	tangential = 'tangential',
	vertical = 'vertical',
	aerated = 'aerated'
}
export const sandTrapTypes: DeviceType[] = [
	{
		iri: 'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move' as ElementIri,
		key: SandTrapTypes.horizontalForward, name: 'Горизонтальные с прямолинейным движением воды',
		ref: undefined, minDailyWaterFlow: 10000, maxDailyWaterFlow: 1000000
	},
	{
		iri: 'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move' as ElementIri,
		key: SandTrapTypes.horizontalCircle, name: 'Горизонтальные с круговым движением воды',
		ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 75000
	},
	{
		iri: 'http://tonya-diploma.com/device/sandTrap/tangential' as ElementIri,
		key: SandTrapTypes.tangential, name: 'Тангенциальные', ref: undefined,
		minDailyWaterFlow: 100, maxDailyWaterFlow: 75000,
	},
	{
		iri: 'http://tonya-diploma.com/device/sandTrap/vertical' as ElementIri,
		key: SandTrapTypes.vertical, name: 'Вертикальные', ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 10000
	},
	{
		iri: 'http://tonya-diploma.com/device/sandTrap/aerated' as ElementIri,
		key: SandTrapTypes.aerated, name: 'Аэрируемые', ref: undefined, minDailyWaterFlow: 20000, maxDailyWaterFlow: 1000000
	},
];
export enum SumpTypes {
	horizontal = 'horizontal',
	vertical = 'vertical',
	verticalUpDownFlow = 'verticalUpDownFlow',
	radial = 'radial',
}
export const sumpTypes: DeviceType[] = [
	{
		iri: 'http://tonya-diploma.com/device/sump/horizontal' as ElementIri,
		key: SumpTypes.horizontal, name: 'Горизонтальные', ref: undefined, minDailyWaterFlow: 15000, maxDailyWaterFlow: 100000
	},
	{
		iri: 'http://tonya-diploma.com/device/sump/vertical' as ElementIri,
		key: SumpTypes.vertical, name: 'Вертикальные', ref: undefined, minDailyWaterFlow: 2000, maxDailyWaterFlow: 20000
	},
	{
		iri: 'http://tonya-diploma.com/device/sump/vertical-down-up-low' as ElementIri,
		key: SumpTypes.verticalUpDownFlow, name: 'Вертикальные с нисходящим-восходящим потоком',
		ref: undefined, minDailyWaterFlow: 2000, maxDailyWaterFlow: 20000
	},
	{
		iri: 'http://tonya-diploma.com/device/sump/radial' as ElementIri,
		key: SumpTypes.radial, name: 'Радиальные', ref: undefined, minDailyWaterFlow: 20000, maxDailyWaterFlow: 1000000
	},
];
export enum AverageTypes { volleyDischarge = 'volleyDischarge', cycleFluctuation = 'cycleFluctuation' }
export const averageTypes: DeviceType[] = [
	{
		iri: 'http://tonya-diploma.com/device/average/volley-discharge' as ElementIri,
		key: AverageTypes.volleyDischarge, name: 'Залповый сброс', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/average/cycle-fluctuation' as ElementIri,
		key: AverageTypes.cycleFluctuation, name: 'Циклические колебания', ref: undefined
	},
];
export enum OilTrapTypes { horizontal = 'horizontal', vertical = 'vertical' }
export const oilTrapTypes: DeviceType[] = [
	{
		iri: 'http://tonya-diploma.com/device/oilTrap/horizontal' as ElementIri,
		key: OilTrapTypes.horizontal, name: 'Горизонтальные', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/oilTrap/vertical' as ElementIri,
		key: OilTrapTypes.vertical, name: 'Вертикальные', ref: undefined
	},
];
export enum FilterTypes { grainy = 'grainy', microFilter = 'microFilter', drumNets = 'drumNets' }
export const filterTypes: DeviceType[] = [
	{
		iri: 'http://tonya-diploma.com/device/filter/grainy' as ElementIri,
		key: FilterTypes.grainy, name: 'Зернистые', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/filter/micro-filter' as ElementIri,
		key: FilterTypes.microFilter, name: 'Микрофильтры', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/filter/drum-nets' as ElementIri,
		key: FilterTypes.drumNets, name: 'Барабанные сетки', ref: undefined
	},
];
export enum CentrifugeTypes { opened = 'opened', pressure = 'pressure', continuous = 'continuous', determinate = 'determinate' }
export const centrifugeTypes: DeviceType[] = [
	{
		iri: 'http://tonya-diploma.com/device/centrifuge/opened' as ElementIri,
		key: CentrifugeTypes.opened, name: 'Открытые гидроциклоны', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/centrifuge/pressure' as ElementIri,
		key: CentrifugeTypes.pressure, name: 'Напорные гидроциклоны', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/centrifuge/continuous' as ElementIri,
		key: CentrifugeTypes.continuous, name: 'Центрифуги непрерывного действия', ref: undefined
	},
	{
		iri: 'http://tonya-diploma.com/device/centrifuge/determinate' as ElementIri,
		key: CentrifugeTypes.determinate, name: 'Центрифуги периодического действия', ref: undefined
	},
];

export interface Device {
	iri: ElementIri;
	name: string;
	key: KindOfDevices;
	ref: HTMLInputElement;
	priority: number;
	selected: boolean;
	listOfTypes: DeviceType[];
	selectedType: {
		key: GrateTypes | SandTrapTypes | SumpTypes | AverageTypes | OilTrapTypes | FilterTypes | CentrifugeTypes;
		name: string;
		iri: ElementIri;
	};
}

export const listOfDevices: Device[] = [
	{
		iri: 'http://tonya-diploma.com/device/grate' as ElementIri,
		name: 'Решетки',
		key: KindOfDevices.grate,
		ref: undefined,
		priority: 1,
		selected: false,
		listOfTypes: grateTypes,
		selectedType: undefined,
	},
	{
		iri: 'http://tonya-diploma.com/device/sandTrap' as ElementIri,
		name: 'Песколовки',
		key: KindOfDevices.sandTrap,
		ref: undefined,
		priority: 2,
		selected: false,
		listOfTypes: sandTrapTypes,
		selectedType: undefined,
	},
	{
		iri: 'http://tonya-diploma.com/device/sump' as ElementIri,
		name: 'Отстойники',
		key: KindOfDevices.sump,
		ref: undefined,
		priority: 3,
		selected: false,
		listOfTypes: sumpTypes,
		selectedType: undefined,
	},
	{
		iri: 'http://tonya-diploma.com/device/average' as ElementIri,
		name: 'Усреднители',
		key: KindOfDevices.average,
		ref: undefined,
		priority: 4,
		selected: false,
		listOfTypes: averageTypes,
		selectedType: undefined,
	},
	{
		iri: 'http://tonya-diploma.com/device/oilTrap' as ElementIri,
		name: 'Нефтеловушки',
		key: KindOfDevices.oilTrap,
		ref: undefined,
		priority: 5,
		selected: false,
		listOfTypes: oilTrapTypes,
		selectedType: undefined,
	},
	{
		iri: 'http://tonya-diploma.com/device/filter' as ElementIri,
		name: 'Фильтры',
		key: KindOfDevices.filter,
		ref: undefined,
		priority: 6,
		selected: false,
		listOfTypes: filterTypes,
		selectedType: undefined,
	},
	{
		iri: 'http://tonya-diploma.com/device/centrifuge' as ElementIri,
		name: 'Гидроциклоны и центрифуги',
		key: KindOfDevices.centrifuge,
		ref: undefined,
		priority: 7,
		selected: false,
		listOfTypes: centrifugeTypes,
		selectedType: undefined,
	}
];
