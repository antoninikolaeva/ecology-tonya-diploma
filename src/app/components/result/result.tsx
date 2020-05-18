import * as React from 'react';
import { Tab, Tabs, Table, Container, Row, Col } from 'react-bootstrap';
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
	LayoutLink, LayoutElement, LinkTypeIri, SerializedDiagram, Link,
	Workspace, WorkspaceProps, DemoDataProvider, Element, ElementTypeIri
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

export interface GeneralResultProps {
}

interface GeneralResultState {
	deviceDiagram: SerializedDiagram;
}

export class GeneralResult extends React.Component<GeneralResultProps, GeneralResultState> {
	private grateResult: GrateResultData;
	private sandTrapResult: SandTrapResultData;
	private sumpResult: SumpResultData;
	private averageResult: AverageResultData;
	private oilTrapResult: OilTrapResultData;
	private filterResult: FilterResultData;
	private centrifugeResult: CentrifugeResultData;

	private workspace: Workspace;
	private elements: any;
	private links: any;

	constructor(props: GeneralResultProps) {
		super(props);

		this.state = {
			deviceDiagram: undefined,
		};

		this.getAllResults();
	}

	componentDidMount() {
		this.generateSchema();
	}

	componentDidUpdate(prevProps: {}, prevState: GeneralResultState) {
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
					LINKS as any,
				),
				validateLinks: true,
			});
		}
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

	private generateGrateScheme = () => {
		if (!this.grateResult.complete) {
			return;
		}
		const links: LayoutLink[] = [];
		const elements: LayoutElement[] = [];
		if (this.grateResult.deviceType === GrateTypes.hand) {
			const element: Element = new Element({
				id: 'http://tonya-diploma.com/device/grate/counting',
				data: {
					id: 'http://tonya-diploma.com/device/grate/counting' as ElementIri,
					label: {values: [{value: 'Решетка ручной очистки(типовая)', language: 'ru'}]},
					types: ['http://tonya-diploma.com/type/Device' as ElementTypeIri],
					properties: {
						'http://tonya-diploma.com/device/grate/counting/Количество решеток': {
							type: 'string',
							values: [{value: `${this.grateResult.hand.amountOfGrates}`, language: 'ru'}]
						},
						'http://tonya-diploma.com/device/grate/counting/Длина камеры': {
							type: 'string',
							values: [{value: `${this.grateResult.hand.commonLengthOfCamera}`, language: 'ru'}]
						},
					}
				}
			});
			const link: Link = new Link({
				id: 'http://tonya-diploma.com/device/grate/counting/link',
				sourceId: 'http://tonya-diploma.com/device/grate/counting',
				targetId: 'http://tonya-diploma.com/device/grate/hand',
				typeId: 'http://tonya-diploma.com/device/instanceOf' as LinkTypeIri,
			});
			const layoutElement: LayoutElement = {
				'@type': 'Element',
				'@id': 'http://tonya-diploma.com/device/grate/counting',
				iri: 'http://tonya-diploma.com/device/grate/counting' as ElementIri,
				position: { x: (300), y: 300 },
			};
			const layoutLink: LayoutLink = {
				'@type': 'Link',
				'@id': `http://tonya-diploma.com/device/instanceOf/${Math.random() * 1000000}`,
				property: ('http://tonya-diploma.com/device/instanceOf') as LinkTypeIri,
				source: { '@id': 'http://tonya-diploma.com/device/grate/counting' },
				target: { '@id': 'http://tonya-diploma.com/device/grate/hand' }
			};
			const model = this.workspace.getModel();
			model.addElement(element);
			model.createClass('http://tonya-diploma.com/device/grate/counting' as ElementTypeIri);
			model.addLink(link);
			elements.push(layoutElement);
			links.push(layoutLink);
			const testDiagram: SerializedDiagram = {
				'@context': `https://ontodia.org/context/${Math.random() * 1000000}/v1.json`,
				'@type': 'Diagram',
				layoutData: {
					'@type': 'Layout',
					elements: elements,
					links: links,
				}
			};
			this.setState({ deviceDiagram: testDiagram });
		}
		if (this.grateResult.deviceType === GrateTypes.mechanic) {
			GrateSource.grates.forEach((device, index) => {
				if (device.mark === this.grateResult.mechanic.currentGrate.value) {
					const elementDevice = (ELEMENTS as any)['http://tonya-diploma.com/device/grate/mechanic'];
					const element = (ELEMENTS as any)[device.iri];
					if (elementDevice &&
						(elements.length === 0 || elements.every(item => item.iri !== device.iri))) {
						elements.push({
							'@type': 'Element',
							'@id': 'http://tonya-diploma.com/device/grate/mechanic',
							iri: 'http://tonya-diploma.com/device/grate/mechanic' as ElementIri,
							position: { x: 300, y: 100 },
						});
					}
					if (element) {
						elements.push({
							'@type': 'Element',
							'@id': device.iri,
							iri: device.iri as ElementIri,
							position: { x: 300, y: 400 },
						});
						links.push({
							'@type': 'Link',
							'@id': `http://tonya-diploma.com/device/instanceOf/${Math.random() * 1000000}`,
							property: ('http://tonya-diploma.com/device/instanceOf') as LinkTypeIri,
							source: { '@id': 'http://tonya-diploma.com/device/grate/mechanic' },
							target: { '@id': device.iri }
						});
					}
				}
			});
			const testDiagram: SerializedDiagram = {
				'@context': `https://ontodia.org/context/${Math.random() * 1000000}/v1.json`,
				'@type': 'Diagram',
				layoutData: {
					'@type': 'Layout',
					elements: elements,
					links: links,
				}
			};
			this.setState({ deviceDiagram: testDiagram });
		}
	}

	private generateSchema = () => {
		this.generateGrateScheme();
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
