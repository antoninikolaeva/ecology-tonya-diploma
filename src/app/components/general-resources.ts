// sump - отстойник для воды
// average - усреднитель
export enum KindOfDevices {
    grate = 'Решетки',
    sandTrap = 'Песколовки',
    sump = 'Отстойники',
    average = 'Усреднители',
    oilTrap = 'Нефтеловушки',
    filter = 'Фильтры',
    centrifuge = 'Гидроциклоны и центрифуги'
};

// export enum GrateTypes {mechanics, hands, hammerCrusher};
// // aerated - аэрируемые песколовки
// export enum SandTrapTypes {horizontalForward, horizontalCircle, tangential, vertical, aerated};
// export enum SandTrapInfrastructure {square, bunker};
// // verticalWithThread - вертикальные отстойники с нисходящими-восходящими потоками
// export enum SumpTypes {horizontal, vertical, verticalWithThread, radial};
// // volleyDischarge - залповый сброс
// // cyclicFluctuation - циклическе колебания
// export enum AverageTypes {volleyDischarge, cyclicFluctuation, randomFluctuation};
// export enum OilTrapTypes {horizontal, vertical};
// // grainy - зернистый
// // drum - барабанный
// export enum FilterTypes {grainy, micro, drum};
// // pressure - напорные гидроциклоны
// // continuous - непрерывные центрифуги
// // determine - периодические центрифуги
// export enum CentrifugeTypes {opened, pressure, continuous, determine};

export interface DeviceType {
    name: string;
    ref: HTMLInputElement;
    minDailyWaterFlow?: number;
    maxDailyWaterFlow?: number;
}

export const grateTypes: DeviceType[] = [
    {name: 'Механическая очистка', ref: undefined},
    {name: 'Ручная очиска', ref: undefined},
    {name: 'Дробилки', ref: undefined},
];
export const sandTrapTypes: DeviceType[] = [
    {name: 'Горизонтальные с прямолинейным движением воды', ref: undefined, minDailyWaterFlow: 10000, maxDailyWaterFlow: 1000000},
    {name: 'Горизонтальные с круговым движением воды', ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 75000},
    {name: 'Тангенциальные', ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 75000},
    {name: 'Вертикальные', ref: undefined, minDailyWaterFlow: 100, maxDailyWaterFlow: 10000},
    {name: 'Аэрируемые', ref: undefined, minDailyWaterFlow: 20000, maxDailyWaterFlow: 1000000},
];
export enum SandTrapInfra {
    square = 'Песковые пощадки',
    bunker = 'Песковые бункеры'
};
export const sandTrapInfrastructure: DeviceType[] = [
    {name: 'Песковые пощадки', ref: undefined},
    {name: 'Песковые бункеры', ref: undefined},
];   
export const sumpTypes: DeviceType[] = [
    {name: 'Горизонтальные', ref: undefined, minDailyWaterFlow: 15000, maxDailyWaterFlow: 100000},
    {name: 'Вертикальные', ref: undefined, minDailyWaterFlow: 2000, maxDailyWaterFlow: 20000},
    {name: 'Вертикальные с нисходящим-восходящим потоком', ref: undefined, minDailyWaterFlow: 2000, maxDailyWaterFlow: 20000},
    {name: 'Радиальные', ref: undefined, minDailyWaterFlow: 20000, maxDailyWaterFlow: 1000000},
];
export const averageTypes: DeviceType[] = [
    {name: 'Залповый сброс', ref: undefined},
    {name: 'Циклические колебания', ref: undefined},
    {name: 'Произвольный характер колебаний', ref: undefined},
];
export const oilTrapTypes: DeviceType[] = [
    {name: 'Горизонтальные', ref: undefined},
    {name: 'Вертикальные', ref: undefined},
]; 
export const filterTypes: DeviceType[] = [
    {name: 'Зернистые', ref: undefined},
    {name: 'Микрофильтры', ref: undefined},
    {name: 'Барабанные сетки', ref: undefined},
];
export const centrifugeTypes: DeviceType[] = [
    {name: 'Открытые гидроциклоны', ref: undefined},
    {name: 'Напорные гидроциклоны', ref: undefined},
    {name: 'Центрифуги непрерывного действия', ref: undefined},
    {name: 'Центрифуги периодического действия', ref: undefined},
];

export interface Device {
    name: KindOfDevices;
    priority: number;
    selected: boolean;
    listOfTypes: DeviceType[];
    additionalListOfTypes?: DeviceType[]; // only for sandTrap
    selectedType: string;
    additionalSelectedType?: string; // only for sandTrap
}

export const listOfDevices: Device[] = [
    {
        name: KindOfDevices.grate,
        priority: 1,
        selected: false,
        listOfTypes: grateTypes,
        selectedType: undefined,
    },
    {
        name: KindOfDevices.sandTrap,
        priority: 2,
        selected: false,
        listOfTypes: sandTrapTypes,
        additionalListOfTypes: sandTrapInfrastructure,
        selectedType: undefined,
        additionalSelectedType: undefined,
    },
    {
        name: KindOfDevices.sump,
        priority: 3,
        selected: false,
        listOfTypes: sumpTypes,
        selectedType: undefined,
    },
    {
        name: KindOfDevices.average,
        priority: 4,
        selected: false,
        listOfTypes: averageTypes,
        selectedType: undefined,
    },
    {
        name: KindOfDevices.oilTrap,
        priority: 5,
        selected: false,
        listOfTypes: oilTrapTypes,
        selectedType: undefined,
    },
    {
        name: KindOfDevices.filter,
        priority: 6,
        selected: false,
        listOfTypes: filterTypes,
        selectedType: undefined,
    },
    {
        name: KindOfDevices.centrifuge,
        priority: 7,
        selected: false,
        listOfTypes: centrifugeTypes,
        selectedType: undefined,
    }
];