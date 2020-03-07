import * as React from 'react';
import { Tab, Tabs, Table, Container, Row, Col } from 'react-bootstrap';

import {
	GrateResultData,
	SandTrapResultData,
	SumpResultData,
	dataModel,
	SandTrapHorizontalForwardResult,
	SandTrapHorizontalCircleResult,
	SandTrapVerticalAndTangentialResult,
	SandTrapAeratedResult
} from '../data-model';
import { CLASSES, LINK_TYPES, ELEMENTS, LINKS } from '../resources/resources';
import { LayoutLink, LayoutElement, LinkTypeIri, SerializedDiagram, Workspace, WorkspaceProps, DemoDataProvider } from 'ontodia';

export interface GeneralResultProps {
}

interface GeneralResultState {
	deviceDiagram: SerializedDiagram;
}

export class GeneralResult extends React.Component<GeneralResultProps, GeneralResultState> {
	private grateResult: GrateResultData;

	private sandTrapResult: SandTrapResultData;
	private sandTrapHorizontalForwardResult: SandTrapHorizontalForwardResult;
	private sandTrapHorizontalCircleResult: SandTrapHorizontalCircleResult;
	private sandTrapTangentialResult: SandTrapVerticalAndTangentialResult;
	private sandTrapVerticalResult: SandTrapVerticalAndTangentialResult;
	private sandTrapAeratedResult: SandTrapAeratedResult;

	private sumpResult: SumpResultData;

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
		if (this.sandTrapResult && this.sandTrapResult.aerated) {
			this.sandTrapAeratedResult = this.sandTrapResult.aerated;
		} else if (this.sandTrapResult && this.sandTrapResult.horizontalCircle) {
			this.sandTrapHorizontalCircleResult = this.sandTrapResult.horizontalCircle;
		} else if (this.sandTrapResult && this.sandTrapResult.horizontalForward) {
			this.sandTrapHorizontalForwardResult = this.sandTrapResult.horizontalForward;
		} else if (this.sandTrapResult && this.sandTrapResult.tangential) {
			this.sandTrapTangentialResult = this.sandTrapResult.tangential;
		} else if (this.sandTrapResult && this.sandTrapResult.vertical) {
			this.sandTrapVerticalResult = this.sandTrapResult.vertical;
		}
		this.sumpResult = dataModel.getSumpResult();
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
				{this.grateResult.currentSuitableGrate
					? <tr>
						<td>Марка решетки</td>
						<td>{this.grateResult.currentSuitableGrate.mark}</td>
					</tr>
					: null}
				{this.grateResult.currentGrateCrusher
					? <tr>
						<td>Марка решетки дробилки</td>
						<td>{this.grateResult.currentGrateCrusher.mark}</td>
					</tr>
					: null}
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
				<tr>
					<td>Полная высота отстойника, м</td>
					<td>{this.sumpResult.fullSumpHeight}</td>
				</tr>
				<tr>
					<td>Количество секций отстойника, шт</td>
					<td>{this.sumpResult.amountOfSection}</td>
				</tr>
			</>
		);
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
							</tbody>
						</Table>
					</div>
					</Col>
				</Row>
			</Container>
		);
	}

	private generateSchema = () => {
		const grateElement = this.grateResult.currentSuitableGrate
			? (ELEMENTS as any)[this.grateResult.currentSuitableGrate.iri]
			: this.grateResult.currentGrateCrusher
				? (ELEMENTS as any)[this.grateResult.currentGrateCrusher.iri]
				: undefined;
		const sandTrapElement = this.getSandTrapElement();
		const sumpElement = {
			id: 'http://tonya-diploma.com/device/sump/standart',
			types: ['http://tonya-diploma.com/type/Device'],
			image: '',
			label: { values: [ { value: 'Типовой отстойник', language: 'ru' } ] },
			properties: {
				'http://tonya-diploma.com/device/sump/standartamountOfSection': { type: 'string', values: [ { value: this.sumpResult.amountOfSection } ] },
				'http://tonya-diploma.com/device/sump/standartfullSumpHeight': { type: 'string', values: [ { value: this.sumpResult.fullSumpHeight } ] },
				'http://tonya-diploma.com/device/sump/standarthighLightEffect': { type: 'string', values: [ { value: this.sumpResult.highLightEffect } ] },
				'http://tonya-diploma.com/device/sump/standarthydraulicHugest': { type: 'string', values: [ { value: this.sumpResult.hydraulicHugest } ] },
				'http://tonya-diploma.com/device/sump/standartsedimentAmountDaily': { type: 'string', values: [ { value: this.sumpResult.sedimentAmountDaily } ] },
				'http://tonya-diploma.com/device/sump/standartsummaWidthAllSection': { type: 'string', values: [ { value: this.sumpResult.summaWidthAllSection } ] },
			}
		};
		const links: LayoutLink[] = [
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
		];
		const elements: LayoutElement[] = [
			{
				'@type': 'Element',
				'@id': grateElement.id,
				iri: grateElement.id,
				position: { x: 100, y: 400 },
			},
			{
				'@type': 'Element',
				'@id': sandTrapElement.id,
				iri: sandTrapElement.id,
				position: { x: 300, y: 400 },
			},
			{
				'@type': 'Element',
				'@id': sumpElement.id,
				iri: sumpElement.id,
				position: { x: 500, y: 400 },
			},
		];
		const testDiagram: SerializedDiagram = {
			'@context': 'https://ontodia.org/context/v1.json',
			'@type': 'Diagram',
			layoutData: {
				'@type': 'Layout',
				elements: elements,
				links: links,
			}
		};
		this.elements = {
			'http://tonya-diploma.com/device/sandTrap/standard': sandTrapElement,
			'http://tonya-diploma.com/device/sump/standard': sumpElement,
			...ELEMENTS
		};
		this.setState({ deviceDiagram: testDiagram });
	}

	private getSandTrapElement = () => {
		if (this.sandTrapHorizontalForwardResult) {
			return {
				id: 'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move/standart',
				types: ['http://tonya-diploma.com/type/Device'],
				image: '',
				label: { values: [ { value: 'Горизонтальные с прямолинейным движением воды', language: 'ru' } ] },
				properties: {
					'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move/amountOfSandTrapSection': { type: 'string', values: [ { value: this.sandTrapHorizontalForwardResult.amountOfSandTrapSection } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move/deepSandTrapSection': { type: 'string', values: [ { value: this.sandTrapHorizontalForwardResult.deepSandTrapSection } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move/fullSandTrapHeight': { type: 'string', values: [ { value: this.sandTrapHorizontalForwardResult.fullSandTrapHeight } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move/lengthOfSandTrap': { type: 'string', values: [ { value: this.sandTrapHorizontalForwardResult.lengthOfSandTrap } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-forward-water-move/widthOfSandTrap': { type: 'string', values: [ { value: this.sandTrapHorizontalForwardResult.widthOfSandTrap } ] },
				}
			};
		} else if (this.sandTrapHorizontalCircleResult) {
			return {
				id: 'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/standart',
				types: ['http://tonya-diploma.com/type/Device'],
				image: '',
				label: { values: [ { value: 'Горизонтальные с круговым движением воды', language: 'ru' } ] },
				properties: {
					'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/amountOfSandTrapSection': { type: 'string', values: [ {  value: this.sandTrapHorizontalCircleResult.amountOfSandTrapSection } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/bunkerHeightConusPart': { type: 'string', values: [ { value: this.sandTrapHorizontalCircleResult.bunkerHeightConusPart } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/fullSandTrapHeight': { type: 'string', values: [ { value: this.sandTrapHorizontalCircleResult.fullSandTrapHeight } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/lengthOfSandTrap': { type: 'string', values: [ { value: this.sandTrapHorizontalCircleResult.lengthOfSandTrap } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/middleDiameter': { type: 'string', values: [ { value: this.sandTrapHorizontalCircleResult.middleDiameter } ] },
					'http://tonya-diploma.com/device/sandTrap/horizontal-circle-water-move/outputDiameter': { type: 'string', values: [ { value: this.sandTrapHorizontalCircleResult.outputDiameter } ] },
				}
			};
		} else if (this.sandTrapTangentialResult) {
			return {
				id: 'http://tonya-diploma.com/device/sandTrap/tangential/standart',
				types: ['http://tonya-diploma.com/type/Device'],
				image: '',
				label: { values: [ { value: 'Тангенциальные', language: 'ru' } ] },
				properties: {
					'http://tonya-diploma.com/device/sandTrap/tangential/amountOfSandTrapSection': { type: 'string', values: [ {  value: this.sandTrapTangentialResult.amountOfSandTrapSection } ] },
					'http://tonya-diploma.com/device/sandTrap/tangential/deepOfTheBunker': { type: 'string', values: [ { value: this.sandTrapTangentialResult.deepOfTheBunker } ] },
					'http://tonya-diploma.com/device/sandTrap/tangential/fullSandTrapHeight': { type: 'string', values: [ { value: this.sandTrapTangentialResult.fullSandTrapHeight } ] },
					'http://tonya-diploma.com/device/sandTrap/tangential/diameterOfEachCompartment': { type: 'string', values: [ { value: this.sandTrapTangentialResult.diameterOfEachCompartment } ] },
					'http://tonya-diploma.com/device/sandTrap/tangential/heightOfTheBunker': { type: 'string', values: [ { value: this.sandTrapTangentialResult.heightOfTheBunker } ] },
					'http://tonya-diploma.com/device/sandTrap/tangential/squareOfEachCompartment': { type: 'string', values: [ { value: this.sandTrapTangentialResult.squareOfEachCompartment } ] },
				}
			};
		} else if (this.sandTrapVerticalResult) {
			return {
				id: 'http://tonya-diploma.com/device/sandTrap/vertical/standart',
				types: ['http://tonya-diploma.com/type/Device'],
				image: '',
				label: { values: [ { value: 'Вертикальные', language: 'ru' } ] },
				properties: {
					'http://tonya-diploma.com/device/sandTrap/vertical/amountOfSandTrapSection': { type: 'string', values: [ { value: this.sandTrapVerticalResult.amountOfSandTrapSection } ] },
					'http://tonya-diploma.com/device/sandTrap/vertical/deepOfTheBunker': { type: 'string', values: [ { value: this.sandTrapVerticalResult.deepOfTheBunker } ] },
					'http://tonya-diploma.com/device/sandTrap/vertical/fullSandTrapHeight': { type: 'string', values: [ { value: this.sandTrapVerticalResult.fullSandTrapHeight } ] },
					'http://tonya-diploma.com/device/sandTrap/vertical/diameterOfEachCompartment': { type: 'string', values: [ { value: this.sandTrapVerticalResult.diameterOfEachCompartment } ] },
					'http://tonya-diploma.com/device/sandTrap/vertical/heightOfTheBunker': { type: 'string', values: [ { value: this.sandTrapVerticalResult.heightOfTheBunker } ] },
					'http://tonya-diploma.com/device/sandTrap/vertical/squareOfEachCompartment': { type: 'string', values: [ { value: this.sandTrapVerticalResult.squareOfEachCompartment } ] },
				}
			};
		} else if (this.sandTrapAeratedResult) {
			return {
				id: 'http://tonya-diploma.com/device/sandTrap/aerated/standart',
				types: ['http://tonya-diploma.com/type/Device'],
				image: '',
				label: { values: [ { value: 'Аэрируемые', language: 'ru' } ] },
				properties: {
					'http://tonya-diploma.com/device/sandTrap/aerated/amountOfSandTrapSection': { type: 'string', values: [ { value: this.sandTrapAeratedResult.amountOfSandTrapSection } ] },
					'http://tonya-diploma.com/device/sandTrap/aerated/deepSandTrapSection': { type: 'string', values: [ { value: this.sandTrapAeratedResult.deepSandTrapSection } ] },
					'http://tonya-diploma.com/device/sandTrap/aerated/generalAirFlow': { type: 'string', values: [ { value: this.sandTrapAeratedResult.generalAirFlow } ] },
					'http://tonya-diploma.com/device/sandTrap/aerated/hydroMechanicWaterFlow': { type: 'string', values: [ { value: this.sandTrapAeratedResult.hydroMechanicWaterFlow } ] },
					'http://tonya-diploma.com/device/sandTrap/aerated/lengthOfSandTrap': { type: 'string', values: [ { value: this.sandTrapAeratedResult.lengthOfSandTrap } ] },
					'http://tonya-diploma.com/device/sandTrap/aerated/outputPipePressure': { type: 'string', values: [ { value: this.sandTrapAeratedResult.outputPipePressure } ] },
					'http://tonya-diploma.com/device/sandTrap/aerated/widthOfSandTrap': { type: 'string', values: [ { value: this.sandTrapAeratedResult.widthOfSandTrap } ] },
				}
			};
		}
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
				{this.renderResultTable()}
				{this.renderScheme()}
			</div>
		);
	}

	render() {
		return this.renderResults();
	}
}
