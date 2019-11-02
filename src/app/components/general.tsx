import * as React from 'react';

import { GrateComponent } from './grate/grate';
import { Navbar, DropdownButton, Dropdown, Form, Nav } from 'react-bootstrap';
import { checkValueToNumber, ErrorNames } from './utils';
import { ErrorAlert } from './error/error';
import { listOfDevices, Device, KindOfDevices, DeviceType, SandTrapInfra } from './general-resources';

interface State {
    deviceWatcher: number;
    secondMaxFlow: number;
    dailyWaterFlow: number;
    errorSecondMaxFlow: Error;
    errorDailyWaterFlow: Error;
    countMode: boolean;
}

export class GeneralComponent extends React.Component<{}, State> {
    private maxSecondFlow: HTMLInputElement = undefined;
    private dailyWaterFlow: HTMLInputElement = undefined;
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            deviceWatcher: 0,
            secondMaxFlow: undefined,
            dailyWaterFlow: undefined,
            errorSecondMaxFlow: undefined,
            errorDailyWaterFlow: undefined,
            countMode: false,
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
            device.selectedType = '';
            device.additionalSelectedType = '';
        }
        this.setState({deviceWatcher: deviceWatcher++});
    }

    private typeList = (device: Device) => {
        const {dailyWaterFlow} = this.state;
        const minValueOfDailyWaterFlow = Math.min(...device.listOfTypes.map(type => type.minDailyWaterFlow));
        const maxValueOfDailyWaterFlow = Math.max(...device.listOfTypes.map(type => type.maxDailyWaterFlow));
        const errorOfMinWaterFlow = new Error('Суточный расход воды слишком мал/велик, и использование данного оборудования нецелесообразно');
        if(device.selected) {
            return <div>
                {
                    (device.name === KindOfDevices.sandTrap || device.name === KindOfDevices.sump)
                    && dailyWaterFlow && (dailyWaterFlow < minValueOfDailyWaterFlow || dailyWaterFlow > maxValueOfDailyWaterFlow) ?
                        <ErrorAlert errorValue={errorOfMinWaterFlow} /> :
                        <div>
                            {device.listOfTypes.map((type, index) => {
                                if ((device.name === KindOfDevices.sandTrap || device.name === KindOfDevices.sump) && dailyWaterFlow &&
                                    (type.minDailyWaterFlow > dailyWaterFlow || type.maxDailyWaterFlow < dailyWaterFlow)) {
                                    return null;
                                }
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
                        </div>
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
                if (typeOfDevice.ref && typeOfDevice.ref.checked && typeOfDevice.name !== type.name) {
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

    private renderBaseInput = () => {
        const {errorSecondMaxFlow, errorDailyWaterFlow} = this.state;
        return <div>
            <div>
                <span>Секундно массовый расход, м3/с</span>
                <input type={'text'} ref={input => this.maxSecondFlow = input} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = checkInputData(event);
                    if (value instanceof Error) {
                        this.setState({errorSecondMaxFlow: value, secondMaxFlow: undefined});
                    } else {
                        this.setState({secondMaxFlow: value, errorSecondMaxFlow: undefined});
                    }
                }}/>
            </div>
            { errorSecondMaxFlow ? <ErrorAlert errorValue={errorSecondMaxFlow}/>: null}
            <div>
                <span>Суточный расход воды, м3/сут</span>
                <input type={'text'} ref={input => this.dailyWaterFlow = input} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = checkInputData(event);
                    if (value instanceof Error) {
                        this.setState({errorDailyWaterFlow: value, dailyWaterFlow: undefined});
                    } else {
                        this.setState({dailyWaterFlow: value, errorDailyWaterFlow: undefined});
                    }
                }}/>
            </div>
            { errorSecondMaxFlow ? <ErrorAlert errorValue={errorDailyWaterFlow}/>: null}
        </div>;
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
        const {countMode} = this.state;
        const grate = listOfDevices[0];
        const sandTrap = listOfDevices[1];
        const sump = listOfDevices[2];
        const average = listOfDevices[3];
        const oilTrap = listOfDevices[4];
        const filter = listOfDevices[5];
        const centrifuge = listOfDevices[6];
        return (
            !countMode ?
                <div>
                    <Navbar bg="primary" variant="dark">
                        <Navbar.Brand>Расчет очистных сооружений</Navbar.Brand>
                    </Navbar>
                    {this.renderBaseInput()}
                    <h4 className={'general-title'}>Выберите очистные сооружения для расчетный схемы</h4>
                    {this.devicesList()}
                    <h4 className={'general-title'}>Схема очистных сооружений</h4>
                    {this.finalScheme()}
                    <button className={'btn btn-primary'} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        this.setState({countMode: true});
                    }}>Начать расчет</button>
                </div> :
                <div>
                    <Nav fill variant={'tabs'} defaultActiveKey={'/'}>
                        {
                            grate.selected ? <Nav.Item>
                                <Nav.Link eventKey={'grate'}>
                                    Решетки
                                </Nav.Link>
                            </Nav.Item> : null
                        }
                        {
                            sandTrap.selected ? <Nav.Item>
                                <Nav.Link eventKey={'sandTrap'}>
                                    Песколовки
                                </Nav.Link>
                            </Nav.Item> : null
                        }
                        {
                            sump.selected ? <Nav.Item>
                                <Nav.Link eventKey={'sump'}>
                                    Отстойники
                                </Nav.Link>
                            </Nav.Item> : null
                        }
                        {
                            average.selected ? <Nav.Item>
                                <Nav.Link eventKey={'average'}>
                                    Усреднители
                                </Nav.Link>
                            </Nav.Item> : null
                        }
                        {
                            oilTrap.selected ? <Nav.Item>
                                <Nav.Link eventKey={'oilTrap'}>
                                    Нефтеловушки
                                </Nav.Link>
                            </Nav.Item> : null
                        }
                        {
                            filter.selected ? <Nav.Item>
                                <Nav.Link eventKey={'filter'}>
                                    Фильтры
                                </Nav.Link>
                            </Nav.Item> : null
                        }
                        {
                            centrifuge.selected ? <Nav.Item>
                                <Nav.Link eventKey={'centrifuge'}>
                                    Гидроциклоны центрифуги
                                </Nav.Link>
                            </Nav.Item> : null
                        }
                    </Nav>
                </div>
        );
    }
}

export function checkInputData(event: React.ChangeEvent<HTMLInputElement>): number | Error {
    if (!event.target.value) {
        return;
    }
    const value = checkValueToNumber(event.target.value);
    if (value instanceof Error && value.name === ErrorNames.isNotANumber) {
        value.message = 'Данное значение не является числом, исправьте введенное значение';
        return value;
    } else {
        return value;
    }
}

