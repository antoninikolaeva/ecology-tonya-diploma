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
import { LayoutLink, LayoutElement, LinkTypeIri, SerializedDiagram, Workspace, WorkspaceProps, DemoDataProvider } from 'ontodia';
import { TableRow } from '../utils';
import { renderFilterResult } from '../filter/filter';

export interface GeneralResultProps {
}

interface GeneralResultState {
	deviceDiagram: SerializedDiagram;
}

export class GeneralResult extends React.Component<GeneralResultProps, GeneralResultState> {
	private grateResult: GrateResultData;
	private sandTrapResult: SandTrapResultData;
	private sumpResult: SumpResultData;
	private filterResult: FilterResultData;

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
					// LINK_TYPES as any,
					[],
					this.elements as any,
					// LINKS as any
					[]
				),
				validateLinks: true,
			});
		}
	}

	private getAllResults = () => {
		this.grateResult = dataModel.getGrateResult();
		this.sandTrapResult = dataModel.getSandTrapResult();
		this.sumpResult = dataModel.getSumpResult();
		this.filterResult = dataModel.getFilterResult();
	}

	private renderGrateRows = () => {
		if (!this.grateResult) {
			return null;
		}
		return (
			<>
				<tr>
					<td className={'input-label left-title-column'}>Решетка</td>
					<td className={'right-title-column'}></td>
				</tr>
			</>
		);
	}

	private renderSandTrapRows = () => {
		if (!this.sandTrapResult) {
			return null;
		}
		return (
			<>
				<tr>
					<td className={'input-label left-title-column'}>Песколовка</td>
					<td className={'right-title-column'}></td>
				</tr>
			</>
		);
	}

	private renderSumpRows = () => {
		if (!this.sumpResult) {
			return null;
		}
		return (
			<>
				<tr>
					<td className={'input-label left-title-column'}>Отстойник</td>
					<td className={'right-title-column'}></td>
				</tr>
			</>
		);
	}

	private renderFilters = () => {
		if (!this.filterResult) {
			return null;
		}
		return renderFilterResult(this.filterResult, {
			isGrainyAndLoad: this.filterResult.currentType === 'grainy' || this.filterResult.currentType === 'load',
			isOnlyGrany: this.filterResult.currentType === 'grainy',
			isMicroFilters: this.filterResult.currentType === 'microFilter',
			isDrumNets: this.filterResult.currentType === 'drumNet',
		},
		{
			isGeneralResult: true,
			title: 'Фильтр'
		});
	}

	private renderResultTable = () => {
		return (
			<Container>
				<Row className={'justify-content-md-center general-container'}>
					<Col xs lg='12'>
					<div className={'table-result'}>
						<Table bordered hover>
							<tbody>
								{this.renderGrateRows()}
								{this.renderSandTrapRows()}
								{this.renderSumpRows()}
								{this.renderFilters()}
							</tbody>
						</Table>
					</div>
					</Col>
				</Row>
			</Container>
		);
	}

	private generateSchema = () => {
		// const grateElement = this.grateResult.currentSuitableGrate
		// 	? (ELEMENTS as any)[this.grateResult.currentSuitableGrate.iri]
		// 	: this.grateResult.currentGrateCrusher
		// 		? (ELEMENTS as any)[this.grateResult.currentGrateCrusher.iri]
		// 		: undefined;
		// const sandTrapElement = this.getSandTrapElement();
		// const sumpElement = {
		// 	id: 'http://tonya-diploma.com/device/sump/standart',
		// 	types: ['http://tonya-diploma.com/type/Device'],
		// 	image: '',
		// 	label: { values: [ { value: 'Типовой отстойник', language: 'ru' } ] },
		// 	properties: {
		// 		'http://tonya-diploma.com/device/sump/standartamountOfSection': { type: 'string', values: [ { value: this.sumpResult.amountOfSection } ] },
		// 		'http://tonya-diploma.com/device/sump/standartfullSumpHeight': { type: 'string', values: [ { value: this.sumpResult.fullSumpHeight } ] },
		// 		'http://tonya-diploma.com/device/sump/standarthighLightEffect': { type: 'string', values: [ { value: this.sumpResult.highLightEffect } ] },
		// 		'http://tonya-diploma.com/device/sump/standarthydraulicHugest': { type: 'string', values: [ { value: this.sumpResult.hydraulicHugest } ] },
		// 		'http://tonya-diploma.com/device/sump/standartsedimentAmountDaily': { type: 'string', values: [ { value: this.sumpResult.sedimentAmountDaily } ] },
		// 		'http://tonya-diploma.com/device/sump/standartsummaWidthAllSection': { type: 'string', values: [ { value: this.sumpResult.summaWidthAllSection } ] },
		// 	}
		// };
		// const links: LayoutLink[] = [
			// {
			// 	'@type': 'Link',
			// 	'@id': `http://tonya-diploma.com/device/consists_of/${Math.random() * 1000000}`,
			// 	property: ('http://tonya-diploma.com/device/consists_of') as LinkTypeIri,
			// 	source: { '@id': grateElement.id },
			// 	target: { '@id': sandTrapElement.id }
			// },
			// {
			// 	'@type': 'Link',
			// 	'@id': `http://tonya-diploma.com/device/consists_of/${Math.random() * 1000000}`,
			// 	property: ('http://tonya-diploma.com/device/consists_of') as LinkTypeIri,
			// 	source: { '@id': sandTrapElement.id },
			// 	target: { '@id': sumpElement.id }
			// },
		// ];
		// const elements: LayoutElement[] = [
		// 	{
		// 		'@type': 'Element',
		// 		'@id': grateElement.id,
		// 		iri: grateElement.id,
		// 		position: { x: 100, y: 400 },
		// 	},
		// 	{
		// 		'@type': 'Element',
		// 		'@id': sandTrapElement.id,
		// 		iri: sandTrapElement.id,
		// 		position: { x: 300, y: 400 },
		// 	},
		// 	{
		// 		'@type': 'Element',
		// 		'@id': sumpElement.id,
		// 		iri: sumpElement.id,
		// 		position: { x: 500, y: 400 },
		// 	},
		// ];
		// const testDiagram: SerializedDiagram = {
		// 	'@context': 'https://ontodia.org/context/v1.json',
		// 	'@type': 'Diagram',
		// 	layoutData: {
		// 		'@type': 'Layout',
		// 		elements: elements,
		// 		links: links,
		// 	}
		// };
		// this.elements = {
		// 	'http://tonya-diploma.com/device/sandTrap/standard': sandTrapElement,
		// 	'http://tonya-diploma.com/device/sump/standard': sumpElement,
		// 	...ELEMENTS
		// };
		// this.setState({ deviceDiagram: testDiagram });
	}

	private getSandTrapElement = () => {
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
						ref={workspaceProps ? workspaceProps.ref : undefined}
						leftPanelInitiallyOpen={false}
						rightPanelInitiallyOpen={false}
						hidePanels={true}
						hideScrollBars={true}
						hideTutorial={true}
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
				// LINK_TYPES as any,
				[],
				this.elements as any,
				// LINKS as any
				[]
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
