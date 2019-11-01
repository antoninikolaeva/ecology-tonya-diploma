import * as React from 'react';

import { GrateComponent } from './grate/grate';
import { Navbar, DropdownButton, Dropdown, Form } from 'react-bootstrap';

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

interface DeviceType {
    name: string;
    ref: HTMLInputElement;
}

const grateTypes: DeviceType[] = [
    {name: 'Механическая очистка', ref: undefined},
    {name: 'Ручная очиска', ref: undefined},
    {name: 'Дробилки', ref: undefined},
];
const sandTrapTypes: DeviceType[] = [
    {name: 'Горизонтальные с прямолинейным движением воды', ref: undefined},
    {name: 'Горизонтальные с круговым движением воды', ref: undefined},
    {name: 'Тангенциальные', ref: undefined},
    {name: 'Вертикальные', ref: undefined},
    {name: 'Аэрируемые', ref: undefined},
];
enum SandTrapInfra {
    square = 'Песковые пощадки',
    bunker = 'Песковые бункеры'
};
const sandTrapInfrastructure: DeviceType[] = [
    {name: 'Песковые пощадки', ref: undefined},
    {name: 'Песковые бункеры', ref: undefined},
];   
const sumpTypes: DeviceType[] = [
    {name: 'Горизонтальные', ref: undefined},
    {name: 'Вертикальные', ref: undefined},
    {name: 'Вертикальные с нисходящим-восходящим потоком', ref: undefined},
    {name: 'Радиальные', ref: undefined},
];
const averageTypes: DeviceType[] = [
    {name: 'Залповый сброс', ref: undefined},
    {name: 'Циклические колебания', ref: undefined},
    {name: 'Произвольный характер колебаний', ref: undefined},
];
const oilTrapTypes: DeviceType[] = [
    {name: 'Горизонтальные', ref: undefined},
    {name: 'Вертикальные', ref: undefined},
]; 
const filterTypes: DeviceType[] = [
    {name: 'Зернистые', ref: undefined},
    {name: 'Микрофильтры', ref: undefined},
    {name: 'Барабанные сетки', ref: undefined},
];
const centrifugeTypes: DeviceType[] = [
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

interface State {
    deviceWatcher: number;
}

export class GeneralComponent extends React.Component<{}, State> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            deviceWatcher: 0,
        }
    }

    componentWillUnmount() {
        this.setState({deviceWatcher: 0});
    }

    private devicesList = () => {
        return listOfDevices.map((device, index) => {
            return <Form key={`${device.name}-${index}`}>
                <Form.Check className={'checkbox'} id={`${device.name}-${index}`} custom type={'checkbox'} label={device.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.selectDevice(event, device)}}>
                </Form.Check>
                {this.typeList(device)}
            </Form>;
        });
    }

    private selectDevice = (event: React.ChangeEvent<HTMLInputElement>, device: Device) => {
        let {deviceWatcher} = this.state;
        if (event.target.checked) {
            device.selected = true;
        } else {
            device.selected = false;
        }
        this.setState({deviceWatcher: deviceWatcher++});
    }

    private typeList = (device: Device) => {
        if(device.selected) {
            return <div>
                {device.listOfTypes.map((type, index) => {
                    return <label className={'radio'} key={`${device.name}-${type.name}-${index}`}>{type.name}
                        <input ref={radio => type.ref = radio} type={'radio'} 
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.selectType(event, device, type)}}/>
                        <span className={'radio-mark'}></span>
                    </label>;
                })}
                {
                    device.name === KindOfDevices.sandTrap ?
                        <div>
                            <div style={{marginLeft: '3rem'}}>Обезвоживание песка</div>
                            {device.additionalListOfTypes.map((type, index) => {
                                return <label className={'radio'} key={`${device.name}-${type.name}-${index}`}>{type.name}
                                    <input ref={radio => type.ref = radio} type={'radio'}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            this.selectType(event, device, type);
                                        }}/>
                                    <span className={'radio-mark'}></span>
                                </label>})}
                        </div>:
                        null
                }
            </div>;
        } else {
            return null;
        }
    }

    private selectType = (event: React.ChangeEvent<HTMLInputElement>, device: Device, type: DeviceType) => {
        let {deviceWatcher} = this.state;
        const clearTypesExceptCurrent = (listOfTypes: DeviceType[]) => {
            listOfTypes.forEach(typeOfDevice => {
                if (typeOfDevice.ref.checked && typeOfDevice.name !== type.name) {
                    typeOfDevice.ref.checked = false;
                }
            });    
        }
        if (event.target.checked) {
            if (device.name === KindOfDevices.sandTrap) {
                if (type.name === SandTrapInfra.square || type.name === SandTrapInfra.bunker) {
                    clearTypesExceptCurrent(device.additionalListOfTypes);
                    device.additionalSelectedType = type.name;
                } else {
                    clearTypesExceptCurrent(device.listOfTypes);
                    device.selectedType = type.name;
                }
            } else {
                clearTypesExceptCurrent(device.listOfTypes);
                device.selectedType = type.name;
            }
        } else {
            device.selectedType = '';
        }
        this.setState({deviceWatcher: deviceWatcher++});
    }

    private finalScheme = () => {
        return <div className={'scheme'}>
            {listOfDevices.map((device, index) => {
                return device.selected ?
                    <div key={index} className={'block-of-scheme'}>
                        <div>Сооружение: {device.name} </div>
                        <div> Тип сооружения: {device.selectedType}</div>
                        {
                            device.name === KindOfDevices.sandTrap ?
                                <div>Тип дополнительного сооружения: {device.additionalSelectedType}</div> :
                                null
                        }
                    </div> :
                    null
            })}
        </div> 


    }

    render() {
        return (
            <div>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand>Расчет очистных сооружений</Navbar.Brand>
                </Navbar>
                <h4 className={'general-title'}>Выберите очистные сооружения для расчетный схемы</h4>
                {this.devicesList()}
                <h4 className={'general-title'}>Схема очистных сооружений</h4>
                {this.finalScheme()}
            </div>
        );
    }
}

const listOfDevices: Device[] = [
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