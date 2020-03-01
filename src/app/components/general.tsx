import * as React from 'react';
import { Navbar, Form, Tabs, Tab, Row, Col, Container, Accordion, Card } from 'react-bootstrap';
import { Workspace, WorkspaceProps, DemoDataProvider, SerializedDiagram, LayoutLink, LayoutElement, LinkTypeIri } from 'ontodia';

import { InputTemplate, NULLSTR } from './utils';
import { ErrorAlert } from './error/error';
import { listOfDevices, Device, KindOfDevices, DeviceType, GrateTypes, SandTrapTypes, SumpTypes } from './general-resources';
import { GrateComponent } from './grate/grate';
import { CLASSES, LINK_TYPES, ELEMENTS, LINKS } from './resources/resources';
import { SandTrapComponent } from './sandTrap/sandTrap';
import { GeneralResult } from './result/result';
import { SumpComponent } from './sump/sump';

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
			return <Card>
				<Accordion.Toggle eventKey={`${index}`}>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<Form key={`${device.key}-${index}`}>
							<Form.Check className={'checkbox'}
								id={`${device.key}-${index}`}
								custom type={'checkbox'}
								label={device.name}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									this.selectDevice(event, device);
								}}>
							</Form.Check>
						</Form>
						<div>{device.selected ? <i className={'fas fa-caret-down'}></i> : undefined}</div>
					</div>
				</Accordion.Toggle>
				{
					device.selected ?
						<Accordion.Collapse eventKey={`${index}`}>
							<Card.Body>{this.typeList(device)}</Card.Body>
						</Accordion.Collapse> :
						null
				}

			</Card>;
		});
		return <Container>
			<Row className={'justify-content-md-center general-container'}>
				<Col xs lg='12'>
					<h4 className={'general-title'}>
						Выберите очистные сооружения для расчетный схемы (отметка галочкой)
					</h4>
					<Accordion>{list}</Accordion>
				</Col>
			</Row>
		</Container>;
	}

	private selectDevice = (event: React.ChangeEvent<HTMLInputElement>, device: Device) => {
		let { deviceWatcher } = this.state;
		device.ref = event.target;
		if (event.target.checked) {
			device.selected = true;
		} else {
			device.selected = false;
			device.selectedType = { iri: undefined, key: undefined, name: '' };
		}
		this.setState({ deviceWatcher: deviceWatcher++ });
	}

	private typeList = (device: Device) => {
		const { dailyWaterFlow } = this.state;
		const minValueOfDailyWaterFlow = Math.min(...device.listOfTypes.map(type => type.minDailyWaterFlow));
		const maxValueOfDailyWaterFlow = Math.max(...device.listOfTypes.map(type => type.maxDailyWaterFlow));
		const errorOfMinWaterFlow = new Error('Суточный расход воды слишком мал/велик, и использование данного оборудования нецелесообразно');
		if (device.selected) {
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
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										this.selectType(event, device, type);
									}} />
								<span className={'radio-mark'}></span>
							</label>;
						})}
					</div>}
			</div>;
		} else {
			return null;
		}
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
			device.selectedType = { iri: type.iri, key: type.key, name: type.name };
			this.updateDiagram();
		} else {
			device.selectedType = { iri: undefined, key: undefined, name: '' };
		}
		this.setState({ deviceWatcher: deviceWatcher++ });
	}

	private renderBaseInput = () => {
		return <Container>
			<Row className={'justify-content-md-center general-container'} style={{flexDirection: 'row'}}>
				<Col xs lg='6'>
					<InputTemplate title={'Секундный максимальный расход, м3/с'}
						placeholder={''}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.maxSecondFlowRef = input; }}
						onInput={(value) => { this.setState({ secondMaxFlow: value }); }} />
				</Col>
				<Col xs lg='6'>
					<InputTemplate title={'Суточный расход воды, м3/сут'}
						placeholder={''}
						range={{ minValue: 0, maxValue: 1000000 }}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.dailyWaterFlowRef = input; }}
						onInput={(value) => { this.setState({ dailyWaterFlow: value }); }} />
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
			onResultMode={this.onResultMode}/>;
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

	private startCounting = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const { isValidateError } = this.state;
		if (isValidateError || !this.isDataExisted()) {
			return;
		}
		this.setState({ countMode: true, resultMode: false });
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

	private isDataExisted = () => {
		const { secondMaxFlow, dailyWaterFlow } = this.state;
		const listOfSelectedDevice = listOfDevices.filter(device => device.selected);
		const listOfSelectedDeviceTypes = listOfDevices.filter(device => device.selected && device.selectedType && device.selectedType.key);
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
						position: {x: (index * 300 - 300), y: 100},
					});
				}
				if (element) {
					elements.push({
						'@type': 'Element',
						'@id': device.selectedType.iri,
						iri: device.selectedType.iri,
						position: {x: (index * 300 - 300), y: 400},
					});
					links.push({
						'@type': 'Link',
						'@id': `http://tonya-diploma.com/device/consists_of/${Math.random() * 1000000}`,
						property: ('http://tonya-diploma.com/device/consists_of') as LinkTypeIri,
						source: {'@id': device.iri},
						target: {'@id': device.selectedType.iri}
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
		this.setState({deviceDiagram: testDiagram});
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
			<Navbar bg='primary' variant='dark'>
				<Navbar.Brand>Расчет очистных сооружений</Navbar.Brand>
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
