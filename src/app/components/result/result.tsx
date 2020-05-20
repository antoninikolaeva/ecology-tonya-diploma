import * as React from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import {
	GrateResultData,
	SandTrapResultData,
	SumpResultData,
	AverageResultData,
	CentrifugeResultData,
	FilterResultData,
	OilTrapResultData,
	dataModel,
} from '../data-model';
import { CLASSES, LINK_TYPES, ELEMENTS, LINKS } from '../resources/resources';
import {
	LayoutLink, LayoutElement, LinkTypeIri, SerializedDiagram,
	Workspace, WorkspaceProps, DemoDataProvider, Element,
} from 'ontodia';
import { renderFilterResult } from '../filter/filter';
import { renderCentrifugeResult } from '../centrifuge/centrifuge';
import { renderAverageResult } from '../average/average';
import { renderGrateResult } from '../grate/grate';
import { renderOilTrapResult } from '../oilTrap/oilTrap';
import { renderSandTrapResult } from '../sandTrap/sandTrap';
import { renderSumpResult } from '../sump/sump';
import { GrateTypes, SandTrapTypes, SumpTypes, AverageTypes, OilTrapTypes, CentrifugeTypes } from '../general-resources';
import { ElementIri } from '../ontodia/dataProvider';
import { GrateSource } from '../grate/grate-resources';
import { FilterSource } from '../filter/filter-resource';
import { CentrifugeSource } from '../centrifuge/centrifuge-resource';

interface ResultItems {
	elements: LayoutElement[];
	links: LayoutLink[];
}

export class GeneralResult extends React.Component<{}, {}> {
	private grateResult: GrateResultData;
	private sandTrapResult: SandTrapResultData;
	private sumpResult: SumpResultData;
	private averageResult: AverageResultData;
	private oilTrapResult: OilTrapResultData;
	private filterResult: FilterResultData;
	private centrifugeResult: CentrifugeResultData;

	private workspace: Workspace;
	private diagram: SerializedDiagram;
	private elements: LayoutElement[] = [];
	private links: LayoutLink[] = [];

	constructor(props: {}) {
		super(props);

		this.getAllResults();
		this.generateSchema();
	}

	private getAllResults = () => {
		this.grateResult = dataModel.getGrateResult();
		this.sandTrapResult = dataModel.getSandTrapResult();
		this.sumpResult = dataModel.getSumpResult();
		this.oilTrapResult = dataModel.getOilTrapResult();
		this.averageResult = dataModel.getAverageResult();
		this.filterResult = dataModel.getFilterResult();
		this.centrifugeResult = dataModel.getCentrifugeResult();
	}

	private renderGrate = () => {
		if (!this.grateResult.complete) {
			return null;
		}
		return renderGrateResult(this.grateResult, {isGeneralResult: true, title: 'Решетка'});
	}

	private renderSandTrap = () => {
		if (!this.sandTrapResult.complete) {
			return null;
		}
		return renderSandTrapResult(this.sandTrapResult, {isGeneralResult: true, title: 'Песколовка'});
	}

	private renderSump = () => {
		if (!this.sumpResult.complete) {
			return null;
		}
		return renderSumpResult(this.sumpResult, {isGeneralResult: true, title: 'Отстойник'});
	}

	private renderAverage = () => {
		if (!this.averageResult.complete) {
			return null;
		}
		return renderAverageResult(this.averageResult, {isGeneralResult: true, title: 'Усреднитель'});
	}

	private renderOilTrap = () => {
		if (!this.oilTrapResult.complete) {
			return null;
		}
		return renderOilTrapResult(this.oilTrapResult, {isGeneralResult: true, title: 'Нефтеловушка'});
	}

	private renderFilters = () => {
		if (!this.filterResult.complete) {
			return null;
		}
		return renderFilterResult(this.filterResult, {isGeneralResult: true, title: 'Фильтр'});
	}

	private renderCentrifuges = () => {
		if (!this.centrifugeResult.complete) {
			return null;
		}
		return renderCentrifugeResult(this.centrifugeResult, {isGeneralResult: true, title: 'Центрифуги и гидроциклоны'});
	}

	private renderResultTable = () => {
		return (
			<Container>
				<Row className={'justify-content-md-center general-container'}>
					<Col xs lg='12'>
					<div className={'table-result'}>
						<Table bordered hover>
							<tbody>
								{this.renderGrate()}
								{this.renderSandTrap()}
								{this.renderSump()}
								{this.renderAverage()}
								{this.renderOilTrap()}
								{this.renderFilters()}
								{this.renderCentrifuges()}
							</tbody>
						</Table>
					</div>
					</Col>
				</Row>
			</Container>
		);
	}

	private generateGrateScheme = (): ResultItems => {
		if (!this.grateResult.complete) {
			return {elements: [], links: []};
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.grateResult.deviceType === GrateTypes.hand) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/grate' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/grate/hand' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/grate/hand/counting' as ElementIri,
				position: {x: 0, y: 100},
			});
		}
		if (this.grateResult.deviceType === GrateTypes.mechanic) {
			result = getTableDeviceAndInstance({
				deviceMark: this.grateResult.mechanic.currentGrate.value,
				deviceIri: 'http://tonya-diploma.com/device/grate' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/grate/mechanic' as ElementIri,
				deviceList: GrateSource.grates,
				position: {x: 0, y: 100},
			});
		}
		if (this.grateResult.deviceType === GrateTypes.crusher) {
			result = getTableDeviceAndInstance({
				deviceMark: this.grateResult.crusher.currentGrateCrusher.value,
				deviceIri: 'http://tonya-diploma.com/device/grate' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/grate/crusher' as ElementIri,
				deviceList: GrateSource.grateCrushers,
				position: {x: 0, y: 100},
			});
		}
		return result;
	}

	private generateSandTrapScheme = (): ResultItems => {
		if (!this.sandTrapResult.complete) {
			return {elements: [], links: []};
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.sandTrapResult.deviceType === SandTrapTypes.horizontalForward) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sandTrap' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move/counting' as ElementIri,
				position: {x: 200, y: 100},
			});
		}
		if (this.sandTrapResult.deviceType === SandTrapTypes.horizontalCircle) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sandTrap' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/counting' as ElementIri,
				position: {x: 200, y: 100},
			});
		}
		if (this.sandTrapResult.deviceType === SandTrapTypes.tangential) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sandTrap' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sandTrap/tangential' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sandTrap/tangential/counting' as ElementIri,
				position: {x: 200, y: 100},
			});
		}
		if (this.sandTrapResult.deviceType === SandTrapTypes.vertical) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sandTrap' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sandTrap/vertical' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sandTrap/vertical/counting' as ElementIri,
				position: {x: 200, y: 100},
			});
		}
		if (this.sandTrapResult.deviceType === SandTrapTypes.aerated) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sandTrap' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sandTrap/aerated' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sandTrap/aerated/counting' as ElementIri,
				position: {x: 200, y: 100},
			});
		}
		return result;
	}

	private generateSumpScheme = (): ResultItems => {
		if (!this.sumpResult.complete) {
			return {elements: [], links: []};
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.sumpResult.deviceType === SumpTypes.horizontal) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sump' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sump/horizontal' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sump/horizontal/counting' as ElementIri,
				position: {x: 400, y: 100},
			});
		}
		if (this.sumpResult.deviceType === SumpTypes.verticalUpDownFlow) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sump' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sump/vertical-down-up-low' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sump/vertical-down-up-low/counting' as ElementIri,
				position: {x: 400, y: 100},
			});
		}
		if (this.sumpResult.deviceType === SumpTypes.vertical) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sump' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sump/vertical' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sump/vertical/counting' as ElementIri,
				position: {x: 400, y: 100},
			});
		}
		if (this.sumpResult.deviceType === SumpTypes.radial) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/sump' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/sump/radial' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/sump/radial/counting' as ElementIri,
				position: {x: 400, y: 100},
			});
		}
		return result;
	}

	private generateAverageScheme = (): ResultItems => {
		if (!this.averageResult.complete) {
			return {elements: [], links: []};
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.averageResult.deviceType === AverageTypes.volleyDischarge) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/average' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/average/volley-discharge' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/average/volley-discharge/counting' as ElementIri,
				position: {x: 600, y: 100},
			});
		}
		if (this.averageResult.deviceType === AverageTypes.cycleFluctuation) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/average' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/average/cycle-fluctuation' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/average/cycle-fluctuation/counting' as ElementIri,
				position: {x: 600, y: 100},
			});
		}
		return result;
	}

	private generateOilTrapScheme = (): ResultItems => {
		if (!this.oilTrapResult.complete) {
			return {elements: [], links: []};
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.oilTrapResult.deviceType === OilTrapTypes.horizontal) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/oilTrap' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/oilTrap/horizontal' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/oilTrap/horizontal/counting' as ElementIri,
				position: {x: 800, y: 100},
			});
		}
		if (this.oilTrapResult.deviceType === OilTrapTypes.radial) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/oilTrap' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/oilTrap/radial' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/oilTrap/radial/counting' as ElementIri,
				position: {x: 800, y: 100},
			});
		}
		return result;
	}

	private generateFilterScheme = (): ResultItems => {
		if (!this.filterResult.complete) {
			return {elements: [], links: []};
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.filterResult.deviceType === FilterSource.FilterGlobalTypes.grainy) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/filter' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/filter/grainy' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/filter/grainy/counting' as ElementIri,
				position: {x: 1000, y: 100},
			});
		}
		if (this.filterResult.deviceType === FilterSource.FilterGlobalTypes.swimLoad) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/filter' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/filter/swimLoad' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/filter/swimLoad/counting' as ElementIri,
				position: {x: 1000, y: 100},
			});
		}
		if (this.filterResult.deviceType === FilterSource.FilterGlobalTypes.microFilter) {
			result = getTableDeviceAndInstance({
				deviceMark: this.filterResult.microFilter.microFilter.mark,
				deviceIri: 'http://tonya-diploma.com/device/filter' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/filter/microFilter' as ElementIri,
				deviceList: FilterSource.microFilters,
				position: {x: 1000, y: 100},
			});
		}
		if (this.filterResult.deviceType === FilterSource.FilterGlobalTypes.drumNets) {
			result = getTableDeviceAndInstance({
				deviceMark: this.filterResult.drumNet.drumNet.mark,
				deviceIri: 'http://tonya-diploma.com/device/filter' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/filter/drumNet' as ElementIri,
				deviceList: FilterSource.drumNets,
				position: {x: 1000, y: 100},
			});
		}
		return result;
	}

	private generateCentrifugeScheme = (): ResultItems => {
		if (!this.centrifugeResult.complete) {
			return {elements: [], links: []};
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.centrifugeResult.deviceType === CentrifugeTypes.opened) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/centrifuge' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/centrifuge/opened' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/centrifuge/opened/counting' as ElementIri,
				position: {x: 1200, y: 100},
			});
		}
		if (this.centrifugeResult.deviceType === CentrifugeTypes.pressure) {
			result = getTableDeviceAndInstance({
				deviceMark: this.centrifugeResult.hPressure.currentPressureHydrocyclone.mark,
				deviceIri: 'http://tonya-diploma.com/device/centrifuge' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/centrifuge/pressure' as ElementIri,
				deviceList: CentrifugeSource.pressureHydrocycloneTable,
				position: {x: 1200, y: 100},
			});
		}
		if (this.centrifugeResult.deviceType === CentrifugeTypes.continuous) {
			result = getTableDeviceAndInstance({
				deviceMark: this.centrifugeResult.centrifuge.currentCentrifuge.mark,
				deviceIri: 'http://tonya-diploma.com/device/centrifuge' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/centrifuge/continuous' as ElementIri,
				deviceList: CentrifugeSource.centrifugeTableContinuous,
				position: {x: 1200, y: 100},
			});
		}
		if (this.centrifugeResult.deviceType === CentrifugeTypes.determinate) {
			result = getTableDeviceAndInstance({
				deviceMark: this.centrifugeResult.centrifuge.currentCentrifuge.mark,
				deviceIri: 'http://tonya-diploma.com/device/centrifuge' as ElementIri,
				subTypeIri: 'http://tonya-diploma.com/device/centrifuge/determinate' as ElementIri,
				deviceList: CentrifugeSource.centrifugeTableDeterminate,
				position: {x: 1200, y: 100},
			});
		}
		return result;
	}

	private generateSchema = () => {
		const grateResult = this.generateGrateScheme();
		const sandTrapResult = this.generateSandTrapScheme();
		const sumpResult = this.generateSumpScheme();
		const averageResult = this.generateAverageScheme();
		const oilTrapResult = this.generateOilTrapScheme();
		const filterResult = this.generateFilterScheme();
		const centrifugeResult = this.generateCentrifugeScheme();
		this.elements = this.elements
			.concat(grateResult.elements)
			.concat(sandTrapResult.elements)
			.concat(sumpResult.elements)
			.concat(averageResult.elements)
			.concat(oilTrapResult.elements)
			.concat(filterResult.elements)
			.concat(centrifugeResult.elements);
		this.links = this.links
			.concat(grateResult.links)
			.concat(sandTrapResult.links)
			.concat(sumpResult.links)
			.concat(averageResult.links)
			.concat(oilTrapResult.links)
			.concat(filterResult.links)
			.concat(centrifugeResult.links);
		const testDiagram: SerializedDiagram = {
			'@context': `https://ontodia.org/context/v2.json`,
			'@type': 'Diagram',
			layoutData: {
				'@type': 'Layout',
				elements: this.elements,
				links: this.links,
			}
		};
		this.diagram = testDiagram;
	}

	private renderScheme = () => {
		const workspaceProps: WorkspaceProps & React.ClassAttributes<Workspace> = {
			ref: this.onWorkspaceMounted,
		};
		return (
			<div>
				<Container>
					<Row className={'justify-content-md-center general-container'}>
						<Col xs lg='12'>
							<h4 className={'general-title'}>Схема очистных сооружений</h4>
						</Col>
					</Row>
				</Container>
				<div className={'ontodia-container'}>
					<Workspace
						key={'result-page-ontodia'}
						ref={workspaceProps ? workspaceProps.ref : undefined}
						leftPanelInitiallyOpen={false}
						rightPanelInitiallyOpen={false}
						hidePanels={false}
						hideScrollBars={false}
						hideTutorial={false}
					></Workspace>
				</div>
			</div>
		);
	}

	private onWorkspaceMounted = (workspace: Workspace) => {
		if (!workspace) { return; }

		this.workspace = workspace;
		this.workspace.getModel().importLayout({
			diagram: this.diagram,
			dataProvider: new DemoDataProvider(
				CLASSES as any,
				LINK_TYPES as any,
				ELEMENTS as any,
				LINKS as any
			),
			validateLinks: true,
		});
	}

	private renderResults = () => {
		return (
			<div>
				{this.renderScheme()}
				{this.renderResultTable()}
			</div>
		);
	}

	render() {
		return this.renderResults();
	}
}

function getElement(
	iri: ElementIri,
	position: {x: number; y: number},
	titleSize: number,
): LayoutElement {
	const width = titleSize * 14;
	return {
		'@type': 'Element',
		'@id': iri,
		iri: iri,
		position: { x: position.x, y: position.y },
		size: {width: width, height: 60}
	}
}

function getLink(
	source: ElementIri,
	target: ElementIri,
	linkIri: LinkTypeIri,
): LayoutLink {
	return {
		'@type': 'Link',
		'@id': `${linkIri}/${Math.random() * 1000000}`,
		property: linkIri,
		source: { '@id': source },
		target: { '@id': target }
	}
}

function getTableDeviceAndInstance(params: {
	deviceMark: string;
	deviceList: {mark: string; iri: string}[];
	deviceIri: ElementIri;
	subTypeIri: ElementIri;
	position: {x: number; y: number};
}): ResultItems {
	const {deviceList, deviceIri, subTypeIri, deviceMark, position} = params;
	const linkSubTypeIri = 'http://tonya-diploma.com/device/subtypeOf' as LinkTypeIri;
	const linkInstanceIri = 'http://tonya-diploma.com/device/instanceOf' as LinkTypeIri;
	const elements: LayoutElement[] = [];
	const links: LayoutLink[] = [];
	deviceList.forEach(device => {
		if (device.mark === deviceMark) {
			const elementDevice = (ELEMENTS as any)[deviceIri];
			const elementSubType = (ELEMENTS as any)[subTypeIri];
			const element = (ELEMENTS as any)[device.iri];
			if (elementSubType) {
				const newElement = getElement(deviceIri, position, elementDevice.label.values[0].value.length);
				elements.push(newElement);
			}
			if (elementSubType) {
				const subTypePosition = {x: position.x, y: position.y + 150};
				const newElement = getElement(subTypeIri, subTypePosition, elementSubType.label.values[0].value.length);
				elements.push(newElement);
				const linkToSubtype = getLink(subTypeIri, deviceIri, linkSubTypeIri);
				links.push(linkToSubtype);
			}
			if (element) {
				const instancePosition = {x: position.x, y: position.y + 300};
				const newElement = getElement(device.iri as ElementIri, instancePosition, element.label.values[0].value.length);
				const linkToInstance = getLink(device.iri as ElementIri, subTypeIri, linkInstanceIri);
				elements.push(newElement);
				links.push(linkToInstance);
			}
		}
	});
	return {elements, links};
}

function getCountingDeviceAndInstance(params: {
	deviceIri: ElementIri;
	subTypeIri: ElementIri;
	instanceIri: ElementIri;
	position: {x: number; y: number};
}): ResultItems {
	const {deviceIri, subTypeIri, instanceIri, position} = params;
	const linkSubTypeIri = 'http://tonya-diploma.com/device/subtypeOf' as LinkTypeIri;
	const linkInstanceIri = 'http://tonya-diploma.com/device/instanceOf' as LinkTypeIri;
	const elements: LayoutElement[] = [];
	const links: LayoutLink[] = [];
	const elementDevice = (ELEMENTS as any)[deviceIri];
	const elementSubType = (ELEMENTS as any)[subTypeIri];
	const element = (ELEMENTS as any)[instanceIri];
	// general device type
	if (elementDevice) {
		const deviceElement = getElement(deviceIri, position, elementDevice.label.values[0].value.length);
		elements.push(deviceElement);
	}
	// subtype of the device
	if (elementSubType) {
		const subTypePosition = {x: position.x, y: position.y + 150};
		const elementOfSubType = getElement(subTypeIri, subTypePosition, elementSubType.label.values[0].value.length);
		const linkSubType = getLink(subTypeIri, deviceIri, linkSubTypeIri);
		elements.push(elementOfSubType);
		links.push(linkSubType);
	}
	// instance of the device
	if (element) {
		const instancePosition = {x: position.x, y: position.y + 300};
		const elementOfDevice = getElement(instanceIri, instancePosition, element.label.values[0].value.length);
		const linkInstance = getLink(instanceIri, subTypeIri, linkInstanceIri);
		elements.push(elementOfDevice);
		links.push(linkInstance);
	}
	return {elements, links};
}
