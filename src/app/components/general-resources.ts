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
    key: GrateTypes | SandTrapTypes | SandTrapInfraTypes | SumpTypes | AverageTypes | OilTrapTypes | FilterTypes | CentrifugeTypes;
    name: string;
    ref: HTMLInputElement;
    minDailyWaterFlow?: number;
    maxDailyWaterFlow?: number;
}

export enum GrateTypes {mechanic = 'mechanic', hand = 'hand', crusher = 'crusher'}
export const grateTypes: DeviceType[] = [
    {key: GrateTypes.mechanic, name: 'Механическая очистка', ref: undefined},
    {key: GrateTypes.hand, name: 'Ручная очиска', ref: undefined},
    {key: GrateTypes.crusher, name: 'Дробилки', ref: undefined},
];
export enum SandTrapTypes {horizontalForward = 'horizontalForward', horizontalCircle = 'horizontalCircle', tangential = 'tangential', vertical = 'vertical', aerated = 'aerated'}
export const sandTrapTypes: DeviceType[] = [
    {key: SandTrapTypes.horizontalForward, name: 'Горизонтальные с прямолинейным движением воды', ref: undefined, minDailyWaterFlow: 10000, maxDailyWaterFlow: 1000000},
    {key: SandTrapTypes.horizontalCircle, name: 'Горизонтальные с круговым движением воды', ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 75000},
    {key: SandTrapTypes.tangential, name: 'Тангенциальные', ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 75000},
    {key: SandTrapTypes.vertical, name: 'Вертикальные', ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 10000},
    {key: SandTrapTypes.aerated, name: 'Аэрируемые', ref: undefined, minDailyWaterFlow: 20000, maxDailyWaterFlow: 1000000},
];
export enum SandTrapInfraTypes {square = 'square', bunker = 'bunker'};
export const sandTrapInfrastructure: DeviceType[] = [
    {key: SandTrapInfraTypes.square, name: 'Песковые пощадки', ref: undefined},
    {key: SandTrapInfraTypes.bunker, name: 'Песковые бункеры', ref: undefined},
];
export enum SumpTypes {horizontal = 'horizontal', vertical = 'vertical', verticalUpDownFlow = 'verticalUpDownFlow', radial = 'radial'};   
export const sumpTypes: DeviceType[] = [
    {key: SumpTypes.horizontal, name: 'Горизонтальные', ref: undefined, minDailyWaterFlow: 15000, maxDailyWaterFlow: 100000},
    {key: SumpTypes.vertical, name: 'Вертикальные', ref: undefined, minDailyWaterFlow: 2000, maxDailyWaterFlow: 20000},
    {key: SumpTypes.verticalUpDownFlow, name: 'Вертикальные с нисходящим-восходящим потоком', ref: undefined, minDailyWaterFlow: 2000, maxDailyWaterFlow: 20000},
    {key: SumpTypes.radial, name: 'Радиальные', ref: undefined, minDailyWaterFlow: 20000, maxDailyWaterFlow: 1000000},
];
export enum AverageTypes {volleyDischarge = 'volleyDischarge', cycleFluctuation = 'cycleFluctuation', randomFluctuation = 'randomFluctuation'}
export const averageTypes: DeviceType[] = [
    {key: AverageTypes.volleyDischarge, name: 'Залповый сброс', ref: undefined},
    {key: AverageTypes.cycleFluctuation, name: 'Циклические колебания', ref: undefined},
    {key: AverageTypes.randomFluctuation, name: 'Произвольный характер колебаний', ref: undefined},
];
export enum OilTrapTypes {horizontal = 'horizontal', vertical = 'vertical'};
export const oilTrapTypes: DeviceType[] = [
    {key: OilTrapTypes.horizontal, name: 'Горизонтальные', ref: undefined},
    {key: OilTrapTypes.vertical, name: 'Вертикальные', ref: undefined},
];
export enum FilterTypes {grainy = 'grainy', microFilter = 'microFilter', drumNets = 'drumNets'} 
export const filterTypes: DeviceType[] = [
    {key: FilterTypes.grainy, name: 'Зернистые', ref: undefined},
    {key: FilterTypes.microFilter, name: 'Микрофильтры', ref: undefined},
    {key: FilterTypes.drumNets, name: 'Барабанные сетки', ref: undefined},
];
export enum CentrifugeTypes {opened = 'opened', pressure = 'pressure', continuous = 'continuous', determinate = 'determinate'};   
export const centrifugeTypes: DeviceType[] = [
    {key: CentrifugeTypes.opened, name: 'Открытые гидроциклоны', ref: undefined},
    {key: CentrifugeTypes.pressure, name: 'Напорные гидроциклоны', ref: undefined},
    {key: CentrifugeTypes.continuous, name: 'Центрифуги непрерывного действия', ref: undefined},
    {key: CentrifugeTypes.determinate, name: 'Центрифуги периодического действия', ref: undefined},
];

export interface Device {
    name: string;
    key: KindOfDevices;
    priority: number;
    selected: boolean;
    listOfTypes: DeviceType[];
    additionalListOfTypes?: DeviceType[]; // only for sandTrap
    selectedType: {
        key: GrateTypes | SandTrapTypes | SandTrapInfraTypes | SumpTypes | AverageTypes | OilTrapTypes | FilterTypes | CentrifugeTypes;
        name: string;
    };
    additionalSelectedType?: {
        key: GrateTypes | SandTrapTypes | SandTrapInfraTypes | SumpTypes | AverageTypes | OilTrapTypes | FilterTypes | CentrifugeTypes;
        name: string;
    }; // only for sandTrap
}

export const listOfDevices: Device[] = [
    {
        name: 'Решетки',
        key: KindOfDevices.grate,
        priority: 1,
        selected: false,
        listOfTypes: grateTypes,
        selectedType: undefined,
    },
    {
        name: 'Песколовки',
        key: KindOfDevices.sandTrap,
        priority: 2,
        selected: false,
        listOfTypes: sandTrapTypes,
        additionalListOfTypes: sandTrapInfrastructure,
        selectedType: undefined,
        additionalSelectedType: undefined,
    },
    {
        name: 'Отстойники',
        key: KindOfDevices.sump,
        priority: 3,
        selected: false,
        listOfTypes: sumpTypes,
        selectedType: undefined,
    },
    {
        name: 'Усреднители',
        key: KindOfDevices.average,
        priority: 4,
        selected: false,
        listOfTypes: averageTypes,
        selectedType: undefined,
    },
    {
        name: 'Нефтеловушки',
        key: KindOfDevices.oilTrap,
        priority: 5,
        selected: false,
        listOfTypes: oilTrapTypes,
        selectedType: undefined,
    },
    {
        name: 'Фильтры',
        key: KindOfDevices.filter,
        priority: 6,
        selected: false,
        listOfTypes: filterTypes,
        selectedType: undefined,
    },
    {
        name: 'Гидроциклоны и центрифуги',
        key: KindOfDevices.centrifuge,
        priority: 7,
        selected: false,
        listOfTypes: centrifugeTypes,
        selectedType: undefined,
    }
];