import * as React from 'react';
import { Navbar, Form, Nav } from 'react-bootstrap';

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

    gratePageOpened: boolean;
    sandTrapPageOpened: boolean;
    sumpPageOpened: boolean;
    averagePageOpened: boolean;
    oilTrapPageOpened: boolean;
    filterPageOpened: boolean;
    centrifugePageOpened: boolean;

    isValidateError: boolean;
}

export class GeneralComponent extends React.Component<{}, State> {
    private maxSecondFlowRef: HTMLInputElement = undefined;
    private dailyWaterFlowRef: HTMLInputElement = undefined;
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            deviceWatcher: 0,
            secondMaxFlow: undefined,
            dailyWaterFlow: undefined,
            countMode: false,
            gratePageOpened: false,
            sandTrapPageOpened: false,
            sumpPageOpened: false,
            averagePageOpened: false,
            oilTrapPageOpened: false,
            filterPageOpened: false,
            centrifugePageOpened: false,
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

    private selectDeviceToCount = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, device: Device) => {
        if (device.key === KindOfDevices.grate) {
            this.setState({gratePageOpened: true, sandTrapPageOpened: false, sumpPageOpened: false, averagePageOpened: false,
                oilTrapPageOpened: false, filterPageOpened: false, centrifugePageOpened: false});
        }
        if (device.key === KindOfDevices.sandTrap) {
            this.setState({gratePageOpened: false, sandTrapPageOpened: true, sumpPageOpened: false, averagePageOpened: false,
                oilTrapPageOpened: false, filterPageOpened: false, centrifugePageOpened: false});
        }
        if (device.key === KindOfDevices.sump) {
            this.setState({gratePageOpened: false, sandTrapPageOpened: false, sumpPageOpened: true, averagePageOpened: false,
                oilTrapPageOpened: false, filterPageOpened: false, centrifugePageOpened: false});
        }
        if (device.key === KindOfDevices.average) {
            this.setState({gratePageOpened: false, sandTrapPageOpened: false, sumpPageOpened: false, averagePageOpened: true,
                oilTrapPageOpened: false, filterPageOpened: false, centrifugePageOpened: false});
        }
        if (device.key === KindOfDevices.oilTrap) {
            this.setState({gratePageOpened: false, sandTrapPageOpened: false, sumpPageOpened: false, averagePageOpened: false,
                oilTrapPageOpened: true, filterPageOpened: false, centrifugePageOpened: false});
        }
        if (device.key === KindOfDevices.filter) {
            this.setState({gratePageOpened: false, sandTrapPageOpened: false, sumpPageOpened: false, averagePageOpened: false,
                oilTrapPageOpened: false, filterPageOpened: true, centrifugePageOpened: false});
        }
        if (device.key === KindOfDevices.centrifuge) {
            this.setState({gratePageOpened: false, sandTrapPageOpened: false, sumpPageOpened: false, averagePageOpened: false,
                oilTrapPageOpened: false, filterPageOpened: false, centrifugePageOpened: true});
        }
    }

    private renderListOfDevicesForCount = () => {
        const {gratePageOpened, sandTrapPageOpened} = this.state;
        const grate = listOfDevices[0];
        const sandTrap = listOfDevices[1];
        const sump = listOfDevices[2];
        const average = listOfDevices[3];
        const oilTrap = listOfDevices[4];
        const filter = listOfDevices[5];
        const centrifuge = listOfDevices[6];
        const grateComponent = this.renderGrateComponent(grate);
        const sandTrapComponent = this.renderSandTrapComponent(sandTrap);
        return <div>
            <Nav fill variant={'tabs'} defaultActiveKey={'/'}>
                {grate.selected ? <Nav.Item onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {this.selectDeviceToCount(event, grate)}}>
                        <Nav.Link eventKey={KindOfDevices.grate}>{grate.name}</Nav.Link>
                    </Nav.Item> : null}
                {sandTrap.selected ? <Nav.Item onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {this.selectDeviceToCount(event, sandTrap)}}>
                        <Nav.Link eventKey={KindOfDevices.sandTrap}>{sandTrap.name}</Nav.Link>
                    </Nav.Item> : null}
                {sump.selected ? <Nav.Item>
                        <Nav.Link eventKey={KindOfDevices.sump}>{sump.name}</Nav.Link>
                    </Nav.Item> : null}
                {average.selected ? <Nav.Item>
                        <Nav.Link eventKey={KindOfDevices.average}>{average.name}</Nav.Link>
                    </Nav.Item> : null}
                {oilTrap.selected ? <Nav.Item>
                        <Nav.Link eventKey={KindOfDevices.oilTrap}>{oilTrap.name}</Nav.Link>
                    </Nav.Item> : null}
                {filter.selected ? <Nav.Item>
                        <Nav.Link eventKey={KindOfDevices.filter}>{filter.name}</Nav.Link>
                    </Nav.Item> : null}
                {centrifuge.selected ? <Nav.Item>
                        <Nav.Link eventKey={KindOfDevices.centrifuge}>{centrifuge.name}</Nav.Link>
                    </Nav.Item> : null}
            </Nav>
            {grate.selected && gratePageOpened ?
                grateComponent :
                <div style={{visibility: 'hidden', height: 0, width: 0}}>{grateComponent}</div>}
            {sandTrap.selected && sandTrapPageOpened ?
                sandTrapComponent :
                <div style={{visibility: 'hidden', height: 0, width: 0}}>{sandTrapComponent}</div>}
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
        const grateResult = dataModel.getGrateResult();
        return <div>
            <div>Value 1: {grateResult.currentSuitableGrate ? grateResult.currentSuitableGrate.mark : undefined}</div>
            <div>Value 2: {grateResult.amountOfHammerCrushers}</div>
            <div>Value 3: {grateResult.amountOfSuitableGrates}</div>
            <div>Value 4: {grateResult.amountOfWaste}</div>
            <div>Value 5: {grateResult.commonLengthOfChamberGrate}</div>
            <div>Value 6: {grateResult.lengthOfIncreaseChannelPart}</div>
            <div>Value 7: {grateResult.sizeOfInputChannelPart}</div>
            <div>Value 8: {grateResult.sizeOfOutputChannelPart}</div>
            <div>Value 9: {grateResult.valueOfLedgeInstallationPlace}</div>
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
            averagePageOpened: false,
            centrifugePageOpened: false,
            filterPageOpened: false,
            gratePageOpened: false,
            oilTrapPageOpened: false,
            sandTrapPageOpened: false,
            sumpPageOpened: false,
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