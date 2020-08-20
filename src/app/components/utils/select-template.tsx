import * as React from 'react';
import { ItemList, checkInputData } from './utils';

interface SelectTemplateProps {
	title: string;
	itemList: ItemList[];
	onSelect(value: number | string): void;
	onSelectRef?(optionList: HTMLOptionElement[]): void;
}

export class SelectTemplate extends React.Component<SelectTemplateProps, {}> {
	private listOfOptionElements: HTMLOptionElement[] = [];
	constructor(props: SelectTemplateProps) {
		super(props);
	}

	componentDidMount() {
		this.onSelectRefChange();
	}

	private onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = checkInputData(event);
		// if we get an error, it means that we have a string field and we return it like a string
		if (value instanceof Error) {
			this.props.onSelect(event.target.value);
			return;
		}
		this.props.onSelect(value);
	}

	private onSelectRefChange = () => {
		if (this.listOfOptionElements.length !== 0 && this.props.onSelectRef) {
			this.props.onSelectRef(this.listOfOptionElements);
		}
	}

	render() {
		const { title, itemList } = this.props;
		this.listOfOptionElements = [];
		return (
			<div className={'select-template'}>
				<div className={'input-label'}>
					{title}
				</div>
				<select className={'select-input'} onChange={this.onSelectChange}>
					{itemList.map((item, index) => {
						if (index === 0) {
							return <option ref={option => this.listOfOptionElements.push(option)}
								key={`${item.value}-${index}`} value={item.value} disabled selected>{item.label}</option>;
						} else {
							return <option ref={option => this.listOfOptionElements.push(option)}
								key={`${item.value}-${index}`} value={item.value}>{item.label}</option>;
						}
					})}
				</select>
			</div>
		);
	}
}
