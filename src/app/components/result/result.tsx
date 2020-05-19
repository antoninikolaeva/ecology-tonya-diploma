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
import { GrateTypes } from '../general-resources';
import { ElementIri } from '../ontodia/dataProvider';
import { GrateSource } from '../grate/grate-resources';

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
			return;
		}
		let result: ResultItems = {elements: [], links: []};
		if (this.grateResult.deviceType === GrateTypes.hand) {
			result = getCountingDeviceAndInstance({
				deviceIri: 'http://tonya-diploma.com/device/grate/hand' as ElementIri,
				instanceIri: 'http://tonya-diploma.com/device/grate/hand/counting' as ElementIri,
				linkIri: 'http://tonya-diploma.com/device/instanceOf' as LinkTypeIri,
			});
		}
		if (this.grateResult.deviceType === GrateTypes.mechanic) {
			const grateCrushersResult = getTableDeviceAndInstance({
				deviceMark: this.grateResult.mechanic.currentHammerCrusher.value,
				deviceIri: 'http://tonya-diploma.com/device/hammer-crusher' as ElementIri,
				deviceList: GrateSource.hammerCrushers,
				linkIri: 'http://tonya-diploma.com/device/instanceOf' as LinkTypeIri,
			});
			const gratesResult = getTableDeviceAndInstance({
				deviceMark: this.grateResult.mechanic.currentGrate.value,
				deviceIri: 'http://tonya-diploma.com/device/grate/mechanic' as ElementIri,
				deviceList: GrateSource.grates,
				linkIri: 'http://tonya-diploma.com/device/instanceOf' as LinkTypeIri,
			});
			result.elements = result.elements.concat(gratesResult.elements).concat(grateCrushersResult.elements);
			result.links = result.links.concat(gratesResult.links).concat(grateCrushersResult.links);
		}
		if (this.grateResult.deviceType === GrateTypes.crusher) {
			result = getTableDeviceAndInstance({
				deviceMark: this.grateResult.crusher.currentGrateCrusher.value,
				deviceIri: 'http://tonya-diploma.com/device/grate/crusher' as ElementIri,
				deviceList: GrateSource.grateCrushers,
				linkIri: 'http://tonya-diploma.com/device/instanceOf' as LinkTypeIri,
			});
		}
		return result;
	}

	private generateSchema = () => {
		const grateResult = this.generateGrateScheme();
		this.elements = this.elements.concat(grateResult.elements);
		this.links = this.links.concat(grateResult.links);
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

function getElement(iri: ElementIri): LayoutElement {
	return {
		'@type': 'Element',
		'@id': iri,
		iri: iri,
		position: { x: (100), y: 100 },
	}
}

function getTableDeviceAndInstance(params: {
	deviceMark: string;
	deviceList: any[];
	deviceIri: ElementIri;
	linkIri: LinkTypeIri;
}): ResultItems {
	const {deviceList, deviceIri, linkIri, deviceMark} = params;
	const elements: LayoutElement[] = [];
	const links: LayoutLink[] = [];
	deviceList.forEach(device => {
		if (device.mark === deviceMark) {
			const elementDevice = (ELEMENTS as any)[deviceIri];
			const element = (ELEMENTS as any)[device.iri];
			if (elementDevice) {
				const newElement = getElement(deviceIri);
				elements.push(newElement);
			}
			if (element) {
				const newElement = getElement(device.iri as ElementIri);
				elements.push(newElement);
				links.push({
					'@type': 'Link',
					'@id': `${linkIri}/${Math.random() * 1000000}`,
					property: linkIri,
					source: { '@id': device.iri },
					target: { '@id': deviceIri }
				});
			}
		}
	});
	return {elements, links};
}

function getCountingDeviceAndInstance(params: {
	deviceIri: ElementIri;
	instanceIri: ElementIri;
	linkIri: LinkTypeIri;
}): ResultItems {
	const {deviceIri, linkIri, instanceIri} = params;
	const elements: LayoutElement[] = [];
	const links: LayoutLink[] = [];
	const deviceElement = getElement(deviceIri);
	const elementOfDevice = getElement(instanceIri);

	const layoutLink: LayoutLink = {
		'@type': 'Link',
		'@id': `${linkIri}/${Math.random() * 1000000}`,
		property: linkIri,
		source: { '@id': instanceIri },
		target: { '@id': deviceIri }
	};
	elements.push(deviceElement);
	elements.push(elementOfDevice);
	links.push(layoutLink);
	return {elements, links};
}
