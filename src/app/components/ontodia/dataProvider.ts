import {
	Workspace,
	WorkspaceProps,
	SerializedDiagram,
	convertToSerializedDiagram,
	DataProvider,
	ClassModel,
	Dictionary,
	ElementModel,
	LinkModel,
} from 'ontodia';
import { cloneDeep, keyBy, map, each } from 'lodash';

import { CLASSES, LINK_TYPES, ELEMENTS, LINKS } from '../resources/resources';

export type LinkTypeIri = string & { readonly linkTypeBrand: void };
export type ElementTypeIri = string & { readonly classBrand: void };
export type ElementIri = string & { readonly elementBrand: void };

export interface LocalizedString {
	readonly value: string;
	readonly language: string;
	/** Equals `xsd:string` if not defined. */
	readonly datatype?: { readonly value: string };
}

export interface LinkTypeModel {
	id: LinkTypeIri;
	label: { values: LocalizedString[] };
	count?: number;
}

export interface LinkCount {
	id: LinkTypeIri;
	inCount: number;
	outCount: number;
}

export interface LinkElementsParams {
	elementId: ElementIri;
	linkId: LinkTypeIri;
	limit?: number;
	offset: number;
	direction?: 'in' | 'out';
}

export interface FilterParams {
	elementTypeId?: ElementTypeIri;
	text?: string;
	refElementId?: ElementIri;
	refElementLinkId?: LinkTypeIri;
	linkDirection?: 'in' | 'out';
	limit?: number;
	offset: number;
	languageCode: string;
}

class DemoDataProvider implements DataProvider {
	constructor(
		private allClasses: ClassModel[],
		private allLinkTypes: LinkTypeModel[],
		private allElements: Dictionary<ElementModel>,
		private allLinks: LinkModel[],
	) { }

	private simulateNetwork<T>(result: T) {
		const cloned = cloneDeep(result);
		return new Promise<T>(resolve => resolve(cloned));
	}

	classTree() {
		return this.simulateNetwork(this.allClasses);
	}

	classInfo(params: { classIds: ElementTypeIri[] }) {
		const classIds = params.classIds || [];
		return this.simulateNetwork(this.allClasses.filter(cl => classIds.indexOf(cl.id)));
	}

	linkTypes() {
		return this.simulateNetwork(this.allLinkTypes);
	}

	linkTypesInfo(params: { linkTypeIds: LinkTypeIri[] }): Promise<LinkTypeModel[]> {
		const types = keyBy(params.linkTypeIds);
		const linkTypes = this.allLinkTypes.filter(type => types[type.id]);
		return this.simulateNetwork(linkTypes);
	}

	elementInfo(params: { elementIds: ElementIri[] }): Promise<Dictionary<ElementModel>> {
		const elements = params.elementIds
			.map(elementId => this.allElements[elementId])
			.filter(element => element !== undefined);
		return this.simulateNetwork(
			keyBy(elements, (element: ElementModel) => element.id));
	}

	linksInfo(params: {
		elementIds: ElementIri[];
		linkTypeIds: LinkTypeIri[];
	}) {
		const nodes = keyBy(params.elementIds);
		const types = keyBy(params.linkTypeIds);
		const links = this.allLinks.filter(link =>
			types[link.linkTypeId] && nodes[link.sourceId] && nodes[link.targetId]);
		return this.simulateNetwork(links);
	}

	linkTypesOf(params: { elementId: ElementIri }) {
		const counts: Dictionary<LinkCount> = {};
		for (const link of this.allLinks) {
			if (link.sourceId === params.elementId ||
				link.targetId === params.elementId
			) {
				const linkCount = counts[link.linkTypeId];
				const isSource = link.sourceId === params.elementId;
				if (linkCount) {
					isSource ? linkCount.outCount++ : linkCount.inCount++;
				} else {
					counts[link.linkTypeId] = isSource
						? { id: link.linkTypeId, inCount: 0, outCount: 1 }
						: { id: link.linkTypeId, inCount: 1, outCount: 0 };
				}
			}
		}
		return this.simulateNetwork(map(counts));
	}

	linkElements(params: LinkElementsParams): Promise<Dictionary<ElementModel>> {
		// for sparql we have rich filtering features and we just reuse filter.
		return this.filter({
			refElementId: params.elementId,
			refElementLinkId: params.linkId,
			linkDirection: params.direction,
			limit: params.limit,
			offset: params.offset,
			languageCode: '',
		});
	}

	filter(params: FilterParams): Promise<Dictionary<ElementModel>> {
		if (params.limit === undefined) { params.limit = 100; }

		if (params.offset > 0) { return Promise.resolve({}); }

		let filtered: Dictionary<ElementModel> = {};
		if (params.elementTypeId) {
			each(this.allElements, (element: ElementModel) => {
				if (element.types.indexOf(params.elementTypeId) >= 0) {
					filtered[element.id] = element;
				}
			});
		} else if (params.refElementId) {
			const filteredLinks = params.refElementLinkId
				? this.allLinks.filter(link => link.linkTypeId === params.refElementLinkId)
				: this.allLinks;
			const nodeId = params.refElementId;
			for (const link of filteredLinks) {
				let linkedElementId: string;
				if (link.sourceId === nodeId && params.linkDirection !== 'in') {
					linkedElementId = link.targetId;
				} else if (link.targetId === nodeId && params.linkDirection !== 'out') {
					linkedElementId = link.sourceId;
				}
				if (linkedElementId !== undefined) {
					const linkedElement = this.allElements[linkedElementId];
					if (linkedElement) {
						filtered[linkedElement.id] = linkedElement;
					}
				}
			}
		} else if (params.text) {
			filtered = this.allElements; // filtering by text is done below
		} else {
			return Promise.reject(new Error('This type of filter is not implemented'));
		}

		if (params.text) {
			const filteredByText: Dictionary<ElementModel> = {};
			const text = params.text.toLowerCase();
			each(filtered, (element: ElementModel) => {
				let found = false;
				if (element.id.toLowerCase().indexOf(text) >= 0) {
					found = true;
				} else {
					found = element.label.values.some(
						(label: LocalizedString) => label.value.toLowerCase().indexOf(text) >= 0);
				}
				if (found) {
					filteredByText[element.id] = element;
				}
			});
			return this.simulateNetwork(filteredByText);
		} else {
			return this.simulateNetwork(filtered);
		}
	}
}

function onWorkspaceMounted(workspace: Workspace) {
	if (!workspace) { return; }

	const diagram = tryLoadLayoutFromLocalStorage();
	workspace.getModel().importLayout({
		diagram,
		dataProvider: new DemoDataProvider(
			CLASSES as any,
			LINK_TYPES as any,
			ELEMENTS as any,
			LINKS as any
		),
		validateLinks: true,
	});
}

export const workspaceProps: WorkspaceProps & React.ClassAttributes<Workspace> = {
	ref: onWorkspaceMounted,
	onSaveDiagram: (workspace: Workspace) => {
		const diagram = workspace.getModel().exportLayout();
		window.location.hash = saveLayoutToLocalStorage(diagram);
		window.location.reload();
	},
};

export function saveLayoutToLocalStorage(diagram: SerializedDiagram): string {
	const randomKey = Math.floor((1 + Math.random()) * 0x10000000000)
		.toString(16).substring(1);
	localStorage.setItem(randomKey, JSON.stringify(diagram));
	return randomKey;
}

export function tryLoadLayoutFromLocalStorage(): SerializedDiagram | undefined {
	if (window.location.hash.length > 1) {
		try {
			const key = window.location.hash.substring(1);
			const unparsedLayout = localStorage.getItem(key);
			const entry = unparsedLayout && JSON.parse(unparsedLayout);

			// backward compatibility test. If we encounder old diagram,
			// wrap it into Diagram interface, jsonld - pass through
			if (entry['@context']) {
				return entry;
			} else {
				return convertToSerializedDiagram({ layoutData: entry, linkTypeOptions: [] });
			}
		} catch (e) { /* ignore */ }
	}
	return undefined;
}