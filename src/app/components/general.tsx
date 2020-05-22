import * as React from 'react';
import { Navbar, Form, Tabs, Tab, Row, Col, Container, Accordion, Card } from 'react-bootstrap';
import { Workspace, WorkspaceProps, DemoDataProvider, SerializedDiagram, LayoutLink, LayoutElement, LinkTypeIri } from 'ontodia';

import { InputTemplate, NULLSTR } from './utils';
import { ErrorAlert } from './error/error';
import {
	listOfDevices, Device, KindOfDevices, DeviceType, GrateTypes, SandTrapTypes,
	SumpTypes, AverageTypes, OilTrapTypes, FilterTypes, CentrifugeTypes
} from './general-resources';
import { GrateComponent } from './grate/grate';
import { CLASSES, LINK_TYPES, ELEMENTS, LINKS } from './resources/resources';
import { SandTrapComponent } from './sandTrap/sandTrap';
import { GeneralResult } from './result/result';
import { SumpComponent } from './sump/sump';
import { AverageComponent } from './average/average';
import { OilTrapComponent } from './oilTrap/oilTrap';
import { FilterComponent } from './filter/filter';
import { CentrifugeComponent } from './centrifuge/centrifuge';
import { dataModel } from './data-model';

import { Link } from 'react-router-dom';

interface State {
	deviceWatcher: number;
	secondMaxFlow: number;
	dailyWaterFlow: number;
	countMode: boolean;
	deviceDiagram: SerializedDiagram;
	isValidateError: boolean;
	resultMode: boolean;
}

export class GeneralComponent extends React.Component<{}, State> {
	private maxSecondFlowRef: HTMLInputElement = undefined;
	private dailyWaterFlowRef: HTMLInputElement = undefined;
	private workspace: Workspace;

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
			deviceDiagram: undefined,
			isValidateError: false,
			resultMode: false,
		};
	}

	componentWillUnmount() {
		this.setState({ deviceWatcher: 0 });
	}

	componentDidUpdate(prevProps: {}, prevState: State) {
		const { deviceDiagram } = this.state;
		const isNewData = !prevState.deviceDiagram && deviceDiagram;
		const isUpdatedData = deviceDiagram && prevState.deviceDiagram &&
			(prevState.deviceDiagram.layoutData.elements !== deviceDiagram.layoutData.elements);
		if (isNewData || isUpdatedData) {
			this.workspace.getModel().importLayout({
				diagram: this.state.deviceDiagram,
				dataProvider: new DemoDataProvider(
					CLASSES as any,
					LINK_TYPES as any,
					ELEMENTS as any,
					LINKS as any
				),
				validateLinks: true,
			});
		}
	}

	private renderDevicesList = () => {
		const list = listOfDevices.map((device, index) => {
			return (
				<Accordion key={`${index}`}>
					<Card>
						<Accordion.Toggle eventKey={`${index}`} className={`${device.selected ? 'toggle-after-select' : ''}`}>
							<div className='accordion-toggle'>
								<span>{device.name}</span>
								{device.selected
									? <div><i className={'fas fa-check'}></i></div>
									: <div><i className={'fas fa-caret-down'}></i></div>}
							</div>
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={`${index}`}>
							<Card.Body>{this.typeList(device)}</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			);
		});
		return <Container>
			<Row className={'justify-content-md-center general-container'}>
				<Col xs lg='12'>
					<h4 className={'general-title'}>
						Выберите очистные сооружения для расчетный схемы
					</h4>
					{list}
				</Col>
			</Row>
		</Container>;
	}

	private typeList = (device: Device) => {
		const { dailyWaterFlow, secondMaxFlow } = this.state;
		const minValueOfDailyWaterFlow = Math.min(...device.listOfTypes.map(type => type.minDailyWaterFlow));
		const maxValueOfDailyWaterFlow = Math.max(...device.listOfTypes.map(type => type.maxDailyWaterFlow));
		const errorOfMinWaterFlow = new Error('Суточный расход воды слишком мал/велик, и использование данного оборудования нецелесообразно');
		return (
			<div>
				{(device.key === KindOfDevices.sandTrap || device.key === KindOfDevices.sump)
					&& dailyWaterFlow && (dailyWaterFlow < minValueOfDailyWaterFlow || dailyWaterFlow > maxValueOfDailyWaterFlow)
					? <ErrorAlert errorValue={errorOfMinWaterFlow} />
					: <div>
						{device.listOfTypes.map((type, index) => {
							if ((device.key === KindOfDevices.sandTrap || device.key === KindOfDevices.sump) && dailyWaterFlow &&
								(type.minDailyWaterFlow > dailyWaterFlow || type.maxDailyWaterFlow < dailyWaterFlow)) {
								return null;
							}
							if (device.key === KindOfDevices.centrifuge) {
								if (type.key === CentrifugeTypes.continuous && secondMaxFlow > 0.0278) {
									return null;
								}
								if (type.key === CentrifugeTypes.determinate && secondMaxFlow > 0.0056) {
									return null;
								}
							}
							return <label className={'radio'} key={`${device.key}-${type.key}-${index}`}>{type.name}
								<input ref={checkbox => type.ref = checkbox} type={'checkbox'}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										this.selectType(event, device, type);
									}} />
								<span className={'radio-mark'}></span>
							</label>;
						})}
					</div>}
			</div>
		);
	}

	private selectType = (event: React.ChangeEvent<HTMLInputElement>, device: Device, type: DeviceType) => {
		let { deviceWatcher } = this.state;
		const clearTypesExceptCurrent = (listOfTypes: DeviceType[]) => {
			listOfTypes.forEach(typeOfDevice => {
				if (typeOfDevice.ref && typeOfDevice.ref.checked && typeOfDevice.key !== type.key) {
					typeOfDevice.ref.checked = false;
				}
			});
		};
		if (event.target.checked) {
			clearTypesExceptCurrent(device.listOfTypes);
			device.selected = true;
			device.selectedType = { iri: type.iri, key: type.key, name: type.name };
			this.updateDiagram();
		} else {
			device.selected = false;
			device.selectedType = { iri: undefined, key: undefined, name: '' };
		}
		this.setState({ deviceWatcher: deviceWatcher++ });
	}

	private renderBaseInput = () => {
		return <Container>
			<Row className={'justify-content-md-center general-container'} style={{ flexDirection: 'row' }}>
				<Col xs lg='6'>
					<InputTemplate title={'Максимальный секундный расход сточной воды, м³/с'}
						placeholder={'Введите максимальный секундный расход...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.maxSecondFlowRef = input; }}
						onInput={(value) => { this.setState({ secondMaxFlow: value }); }} />
				</Col>
				<Col xs lg='6'>
					<InputTemplate title={`Суточный расход воды, м³/сут`}
						placeholder={'Введите суточный расход воды...'}
						range={{ minValue: 0, maxValue: Infinity }}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.dailyWaterFlowRef = input; }}
						onInput={(value) => {
							listOfDevices.forEach(device => {
								if (device.key === KindOfDevices.sandTrap || device.key === KindOfDevices.sump) {
									device.selectedType = undefined;
									device.selected = false;
									device.listOfTypes.forEach(type => {
										if (type.ref) { type.ref.checked = false; }
									});
								}
							});
							this.setState({ dailyWaterFlow: value });
						}} />
				</Col>
			</Row>
		</Container>;
	}

	private renderOntodia() {
		const workspaceProps: WorkspaceProps & React.ClassAttributes<Workspace> = {
			ref: this.onWorkspaceMounted,
		};
		return <div>
			<Container>
				<Row className={'justify-content-md-center general-container'}>
					<Col xs lg='12'>
						<h4 className={'general-title'}>Схема очистных сооружений</h4>
					</Col>
				</Row>
			</Container>
			<div className={'ontodia-container'}>
				<Workspace
					key={'general-page-ontodia'}
					ref={workspaceProps ? workspaceProps.ref : undefined}
					leftPanelInitiallyOpen={false}
					rightPanelInitiallyOpen={false}
					hidePanels={true}
					hideScrollBars={true}
					hideTutorial={true}
				></Workspace>
			</div>
		</div>;
	}

	private renderCountCtrlButtons() {
		const { isValidateError } = this.state;
		return <Container>
			<Row className={'justify-content-md-center general-container'}>
				<Col xs lg='12'>
					<div className={'ctrl-buttons-panel'}>
						{isValidateError || !this.isDataExisted() ?
							<button className={'btn btn-primary'} disabled>Начать расчет</button> :
							<button className={'btn btn-primary'} onClick={this.startCounting}>Начать расчет</button>}
						<button className={'btn btn-danger'} onClick={this.clearPage}>Очистить расчет</button>
					</div>
				</Col>
			</Row>
		</Container>;
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
						{this.renderSandTrapComponent(this.sandTrap)}
					</Tab> : null}
				{this.sump.selected ?
					<Tab eventKey={this.sump.key} title={this.sump.name}>
						{this.renderSumpComponent(this.sump)}
					</Tab> : null}
				{this.average.selected ?
					<Tab eventKey={this.average.key} title={this.average.name}>
						{this.renderAverageComponent(this.average)}
					</Tab> : null}
				{this.oilTrap.selected ?
					<Tab eventKey={this.oilTrap.key} title={this.oilTrap.name}>
						{this.renderOilTrapComponent(this.oilTrap)}
					</Tab> : null}
				{this.filter.selected ?
					<Tab eventKey={this.filter.key} title={this.filter.name}>
						{this.renderFilterComponent(this.filter)}
					</Tab> : null}
				{this.centrifuge.selected ?
					<Tab eventKey={this.centrifuge.key} title={this.centrifuge.name}>
						{this.renderCentrifugeComponent(this.centrifuge)}
					</Tab> : null}
			</Tabs>
		</div>;
	}

	private renderResult = () => {
		return <GeneralResult />;
	}

	private renderGrateComponent = (grate: Device) => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		return <GrateComponent secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			type={
				grate.selectedType.key === GrateTypes.mechanic ? GrateTypes.mechanic :
					grate.selectedType.key === GrateTypes.hand ? GrateTypes.hand :
						GrateTypes.crusher
			}
			onCountMode={this.onCountMode}
			onResultMode={this.onResultMode} />;
	}

	private renderSandTrapComponent = (sandTrap: Device) => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		return <SandTrapComponent
			secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			type={
				sandTrap.selectedType.key === SandTrapTypes.horizontalForward ? SandTrapTypes.horizontalForward :
					sandTrap.selectedType.key === SandTrapTypes.horizontalCircle ? SandTrapTypes.horizontalCircle :
						sandTrap.selectedType.key === SandTrapTypes.tangential ? SandTrapTypes.tangential :
							sandTrap.selectedType.key === SandTrapTypes.vertical ? SandTrapTypes.vertical : SandTrapTypes.aerated
			}
			onCountMode={this.onCountMode}
			onResultMode={this.onResultMode}
		></SandTrapComponent>;
	}

	private renderSumpComponent = (sump: Device) => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		return <SumpComponent
			secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			type={
				sump.selectedType.key === SumpTypes.horizontal ? SumpTypes.horizontal :
					sump.selectedType.key === SumpTypes.radial ? SumpTypes.radial :
						sump.selectedType.key === SumpTypes.vertical ? SumpTypes.vertical : SumpTypes.verticalUpDownFlow
			}
			onCountMode={this.onCountMode}
			onResultMode={this.onResultMode}
		></SumpComponent>;
	}

	private renderAverageComponent = (average: Device) => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		return <AverageComponent
			secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			type={
				average.selectedType.key === AverageTypes.volleyDischarge
				? AverageTypes.volleyDischarge
				: AverageTypes.cycleFluctuation
			}
			onCountMode={this.onCountMode}
			onResultMode={this.onResultMode}
		></AverageComponent>;
	}

	private renderOilTrapComponent = (oilTrap: Device) => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		return <OilTrapComponent
			secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			type={
				oilTrap.selectedType.key === OilTrapTypes.horizontal
				? OilTrapTypes.horizontal
				: OilTrapTypes.radial
			}
			onCountMode={this.onCountMode}
			onResultMode={this.onResultMode}
		></OilTrapComponent>;
	}

	private renderFilterComponent = (filter: Device) => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		return <FilterComponent
			secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			type={FilterTypes.base}
			onCountMode={this.onCountMode}
			onResultMode={this.onResultMode}
		></FilterComponent>;
	}

	private renderCentrifugeComponent = (centrifuge: Device) => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		return <CentrifugeComponent
			secondMaxFlow={secondMaxFlow}
			dailyWaterFlow={dailyWaterFlow}
			type={
				centrifuge.selectedType.key === CentrifugeTypes.opened
				? CentrifugeTypes.opened
				: centrifuge.selectedType.key === CentrifugeTypes.pressure
					? CentrifugeTypes.pressure
					: centrifuge.selectedType.key === CentrifugeTypes.continuous
					? CentrifugeTypes.continuous
					: CentrifugeTypes.determinate
			}
			onCountMode={this.onCountMode}
			onResultMode={this.onResultMode}
		></CentrifugeComponent>;
	}

	private startCounting = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const { isValidateError } = this.state;
		if (isValidateError || !this.isDataExisted()) {
			return;
		}
		this.workspace = undefined;
		this.setState({ countMode: true, resultMode: false, deviceDiagram: undefined });
	}

	private clearPage = () => {
		this.maxSecondFlowRef.value = NULLSTR;
		this.dailyWaterFlowRef.value = NULLSTR;
		listOfDevices.forEach(device => {
			if (device.ref) { device.ref.checked = false; }
			device.selected = false;
			device.selectedType = undefined;
			device.listOfTypes.forEach(type => {
				if (type.ref) { type.ref.checked = false; }
			});
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
		this.setState({ countMode });
	}

	private onResultMode = (resultMode: boolean) => {
		this.setState({ resultMode });
	}

	private onStartPage = () => {
		this.clearPage();
		dataModel.resetResultData();
		this.setState({ resultMode: false, countMode: false });
	}

	private isDataExisted = () => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		const listOfSelectedDevice = listOfDevices.filter(device => device.selected);
		const listOfSelectedDeviceTypes = listOfDevices.filter(device =>
			device.selected && device.selectedType && device.selectedType.key);
		if (!secondMaxFlow ||
			!dailyWaterFlow ||
			listOfSelectedDevice.length === 0 ||
			listOfSelectedDeviceTypes.length === 0 ||
			listOfSelectedDevice.length !== listOfSelectedDeviceTypes.length) {
			return false;
		} else {
			return true;
		}
	}

	private updateDiagram = () => {
		const links: LayoutLink[] = [];
		const elements: LayoutElement[] = [];
		listOfDevices.forEach((device, index) => {
			if (device.selected && device.selectedType) {
				const elementDevice = (ELEMENTS as any)[device.iri];
				const element = (ELEMENTS as any)[device.selectedType.iri];
				if (elementDevice &&
					(elements.length === 0 || elements.every(item => item.iri !== device.iri))) {
					elements.push({
						'@type': 'Element',
						'@id': device.iri,
						iri: device.iri,
						position: { x: (index * 300 - 300), y: 100 },
					});
				}
				if (element) {
					elements.push({
						'@type': 'Element',
						'@id': device.selectedType.iri,
						iri: device.selectedType.iri,
						position: { x: (index * 300 - 300), y: 400 },
					});
					links.push({
						'@type': 'Link',
						'@id': `http://tonya-diploma.com/device/subtypeOf/${Math.random() * 1000000}`,
						property: ('http://tonya-diploma.com/device/subtypeOf') as LinkTypeIri,
						source: { '@id': device.selectedType.iri },
						target: { '@id': device.iri }
					});
				}
			}
		});
		const testDiagram: SerializedDiagram = {
			'@context': 'https://ontodia.org/context/v1.json',
			'@type': 'Diagram',
			layoutData: {
				'@type': 'Layout',
				elements: elements,
				links: links,
			}
		};
		this.setState({ deviceDiagram: testDiagram });
	}

	private onWorkspaceMounted = (workspace: Workspace) => {
		if (!workspace) { return; }

		this.workspace = workspace;
		this.workspace.getModel().importLayout({
			diagram: this.state.deviceDiagram,
			dataProvider: new DemoDataProvider(
				CLASSES as any,
				LINK_TYPES as any,
				ELEMENTS as any,
				LINKS as any
			),
			validateLinks: true,
		});
	}

	render() {
		const { countMode, resultMode } = this.state;
		return <div>
			<Navbar bg='primary' variant='dark' className='title-navbar'>
				<div className='intro-navbar-counting'>
					<Link to={'/'} className='link-to-start'>
						<div onClick={this.onStartPage} className='base-image' title='Вернуться на главную страницу'></div>
					</Link>
					<Navbar.Brand className='app-title' onClick={this.onStartPage}>
						Подбор оборудования механической очистки сточных вод
					</Navbar.Brand>
				</div>
			</Navbar>
			{
				countMode
					? this.renderListOfDevicesForCount()
					: resultMode
						? this.renderResult()
						: <div>
							{this.renderBaseInput()}
							{this.renderDevicesList()}
							{this.renderCountCtrlButtons()}
							{this.renderOntodia()}
						</div>
			}
		</div>;
	}
}
