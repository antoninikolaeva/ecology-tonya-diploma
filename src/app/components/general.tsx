import * as React from 'react';
import { Navbar, Form, Nav, Tabs, Tab } from 'react-bootstrap';

import { InputTemplate, NULLSTR } from './utils';
import { ErrorAlert } from './error/error';
import { listOfDevices, Device, KindOfDevices, DeviceType, SandTrapInfraTypes, GrateTypes } from './general-resources';
import { GrateComponent } from './grate/grate';
import { GeneralDataModel, dataModel } from './data-model';

interface State {
    deviceWatcher: number;
    secondMaxFlow: number;
    dailyWaterFlow: number;
    countMode: boolean;

    isValidateError: boolean;
}

export class GeneralComponent extends React.Component<{}, State> {
    private maxSecondFlowRef: HTMLInputElement = undefined;
    private dailyWaterFlowRef: HTMLInputElement = undefined;

    private grate: Device = listOfDevices[0];
    private sandTrap: Device = listOfDevices[1];
    private sump: Device = listOfDevices[2];
    private average: Device = listOfDevices[3];
    private oilTrap: Device = listOfDevices[4];
    private filter: Device = listOfDevices[5];
    private centrifuge: Device = listOfDevices[6];

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            deviceWatcher: 0,
            secondMaxFlow: undefined,
            dailyWaterFlow: undefined,
            countMode: false,
            isValidateError: false
        }
    }

    componentWillUnmount() {
        this.setState({deviceWatcher: 0});
    }

    private devicesList = () => {
        return listOfDevices.map((device, index) => {
            return <Form key={`${device.key}-${index}`}>
                <Form.Check className={'checkbox'} id={`${device.key}-${index}`} custom type={'checkbox'} label={device.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.selectDevice(event, device)}}>
                </Form.Check>
                {this.typeList(device)}
            </Form>;
        });
    }

    private selectDevice = (event: React.ChangeEvent<HTMLInputElement>, device: Device) => {
        let {deviceWatcher} = this.state;
        device.ref = event.target;
        if (event.target.checked) {
            device.selected = true;
        } else {
            device.selected = false;
            device.selectedType = {key: undefined, name: ''};
            device.additionalSelectedType = {key: undefined, name: ''};
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
                {(device.key === KindOfDevices.sandTrap || device.key === KindOfDevices.sump)
                  && dailyWaterFlow && (dailyWaterFlow < minValueOfDailyWaterFlow || dailyWaterFlow > maxValueOfDailyWaterFlow) ?
                    <ErrorAlert errorValue={errorOfMinWaterFlow} /> :
                    <div>
                        {device.listOfTypes.map((type, index) => {
                            if ((device.key === KindOfDevices.sandTrap || device.key === KindOfDevices.sump) && dailyWaterFlow &&
                                (type.minDailyWaterFlow > dailyWaterFlow || type.maxDailyWaterFlow < dailyWaterFlow)) {
                                return null;
                            }
                            return <label className={'radio'} key={`${device.key}-${type.key}-${index}`}>{type.name}
                                <input ref={radio => type.ref = radio} type={'radio'} 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {this.selectType(event, device, type)}}/>
                                <span className={'radio-mark'}></span>
                            </label>;
                        })}
                        {device.key === KindOfDevices.sandTrap ?
                            <div>
                                <div style={{marginLeft: '3rem'}}>Обезвоживание песка</div>
                                {device.additionalListOfTypes.map((type, index) => {
                                    return <label className={'radio'} key={`${device.key}-${type.key}-${index}`}>{type.name}
                                        <input ref={radio => type.ref = radio} type={'radio'}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                this.selectType(event, device, type);
                                            }}/>
                                        <span className={'radio-mark'}></span>
                                    </label>})}
                            </div>:
                            null}
                    </div>}
            </div>;
        } else {
            return null;
        }
    }

    private selectType = (event: React.ChangeEvent<HTMLInputElement>, device: Device, type: DeviceType) => {
        let {deviceWatcher} = this.state;
        const clearTypesExceptCurrent = (listOfTypes: DeviceType[]) => {
            listOfTypes.forEach(typeOfDevice => {
                if (typeOfDevice.ref && typeOfDevice.ref.checked && typeOfDevice.key !== type.key) {
                    typeOfDevice.ref.checked = false;
                }
            });    
        }
        if (event.target.checked) {
            if (device.key === KindOfDevices.sandTrap) {
                if (type.key === SandTrapInfraTypes.square || type.key === SandTrapInfraTypes.bunker) {
                    clearTypesExceptCurrent(device.additionalListOfTypes);
                    device.additionalSelectedType = {key: type.key, name: type.name};
                } else {
                    clearTypesExceptCurrent(device.listOfTypes);
                    device.selectedType = {key: type.key, name: type.name};;
                }
            } else {
                clearTypesExceptCurrent(device.listOfTypes);
                device.selectedType = {key: type.key, name: type.name};;
            }
        } else {
            device.selectedType = {key: undefined, name: ''};;
        }
        this.setState({deviceWatcher: deviceWatcher++});
    }

    private renderBaseInput = () => {
        return <div>
            <InputTemplate title={'Секундный максимальный расход, м3/с'}
                placeholder={''}
                onErrorExist={(isError) => {this.setState({isValidateError: isError})}}
                onInputRef={(input) => {this.maxSecondFlowRef = input}}
                onInput={(value) => { this.setState({secondMaxFlow: value})}}/>
            <InputTemplate title={'Суточный расход воды, м3/сут'}
                placeholder={''}
                range={{minValue: 0, maxValue: 1000000}}
                onErrorExist={(isError) => {this.setState({isValidateError: isError})}}
                onInputRef={(input) => {this.dailyWaterFlowRef = input}}
                onInput={(value) => { this.setState({dailyWaterFlow: value})}}/>
        </div>
    }

    private finalScheme = () => {
        return <div className={'scheme'}>
            {listOfDevices.map((device, index) => {
                return device.selected ?
                    <div key={index} className={'block-of-scheme'}>
                        <div>Сооружение: {device.name} </div>
                        <div> Тип сооружения: {device.selectedType ? device.selectedType.name : null}</div>
                        {
                            device.key === KindOfDevices.sandTrap ?
                                <div>Тип дополнительного сооружения: {device.additionalSelectedType ? device.additionalSelectedType.name : null}</div> :
                                null
                        }
                    </div> :
                    null
            })}
        </div> 
    }

    private renderListOfDevicesForCount = () => {
        const defaultActiveKey = listOfDevices.find(device => device.selected);
        return <div className={'device-tabs-container'}>
            <Tabs defaultActiveKey={defaultActiveKey.key} id='allDeviceTabs'>
                {this.grate.selected ?
                    <Tab eventKey={this.grate.key} title={this.grate.name}>
                        {this.renderGrateComponent(this.grate)}
                    </Tab> : null}
                {this.sandTrap.selected ?
                    <Tab eventKey={this.sandTrap.key} title={this.sandTrap.name}>
                        {this.renderSandTrapComponent(this.grate)}
                    </Tab> : null} 
                {this.sump.selected ?
                    <Tab eventKey={this.sump.key} title={this.sump.name}>
                        {'Will be sump'}
                    </Tab> : null}
                {this.average.selected ?
                    <Tab eventKey={this.average.key} title={this.average.name}>
                        {'Will be average'}
                    </Tab> : null}
                {this.oilTrap.selected ?
                    <Tab eventKey={this.oilTrap.key} title={this.oilTrap.name}>
                        {'Will be oilTrap'}
                    </Tab> : null}
                {this.filter.selected ?
                    <Tab eventKey={this.filter.key} title={this.filter.name}>
                        {'Will be filter'}
                    </Tab> : null}
                {this.centrifuge.selected ?
                    <Tab eventKey={this.centrifuge.key} title={this.centrifuge.name}>
                        {'Will be centrifuge'}
                    </Tab> : null}
            </Tabs>
        </div>
    }

    private renderGrateComponent = (grate: Device) => {
        const {secondMaxFlow, dailyWaterFlow} = this.state;
        return <GrateComponent secondMaxFlow={secondMaxFlow}
            dailyWaterFlow={dailyWaterFlow}
            type={
                grate.selectedType.key === GrateTypes.mechanic ? GrateTypes.mechanic :
                grate.selectedType.key === GrateTypes.hand ? GrateTypes.hand :
                GrateTypes.crusher
            }
            onCountMode={this.onCountMode}/>
    }

    private renderSandTrapComponent = (sandTrap: any) => {
        const {secondMaxFlow, dailyWaterFlow} = this.state;
        return <div>
            Will be sandTrap
        </div>
    }

    private startCounting = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const {isValidateError} = this.state;
        if (isValidateError || !this.isDataExisted()) {
            return;
        }
        this.setState({countMode: true});
    }

    private clearPage = () => {
        this.maxSecondFlowRef.value = NULLSTR;
        this.dailyWaterFlowRef.value = NULLSTR;
        listOfDevices.forEach(device => {
            if (device.ref) device.ref.checked = false;
            device.selected = false;
            device.selectedType= undefined;
            device.additionalSelectedType = undefined;
            device.listOfTypes.forEach(type => {
                if (type.ref) type.ref.checked = false;
            });
            if (device.additionalListOfTypes) {
                device.additionalListOfTypes.forEach(type => {
                    if (type.ref) type.ref.checked = false;
                });
            }
        });
        this.setState({
            countMode: false,
            dailyWaterFlow: undefined,
            secondMaxFlow: undefined,
            deviceWatcher: 0,
            isValidateError: false,
        });
    }

    private onCountMode = (countMode: boolean) => {
        this.clearPage();
        this.setState({countMode});
    }

    private isDataExisted = () => {
        const {secondMaxFlow, dailyWaterFlow} = this.state;
        const listOfSelectedDevice = listOfDevices.filter(device => device.selected &&
            (device.selectedType || device.additionalSelectedType) &&
            (device.selectedType.key || device.additionalSelectedType.key));
        if (!secondMaxFlow || !dailyWaterFlow || listOfSelectedDevice.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        const {countMode, isValidateError} = this.state;
        return (
            !countMode ?
                <div>
                    <Navbar bg="primary" variant="dark">
                        <Navbar.Brand>Расчет очистных сооружений</Navbar.Brand>
                    </Navbar>
                    <div className={'general-container'}>
                        {this.renderBaseInput()}
                        <h4 className={'general-title'}>Выберите очистные сооружения для расчетный схемы</h4>
                        {this.devicesList()}
                        <h4 className={'general-title'}>Схема очистных сооружений</h4>
                        {this.finalScheme()}
                        <div className={'ctrl-buttons-panel'}>
                            {isValidateError || !this.isDataExisted() ? 
                                <button className={'btn btn-primary'} disabled>Начать расчет</button> :
                                <button className={'btn btn-primary'} onClick={this.startCounting}>Начать расчет</button>}
                            <button className={'btn btn-danger'} onClick={this.clearPage}>Очистить расчет</button>
                        </div>
                    </div>
                </div> :
                this.renderListOfDevicesForCount()
        );
    }
}