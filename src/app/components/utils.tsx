import * as React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { ErrorAlert } from './error/error';

export const NULLSTR = '';

export enum ErrorNames {
	isNotNumber = 'The value is not a number',
	isNotRange = 'The value is not a proper to range',
}

enum NumberExceptions { zero = '0', zeroFloatPoint = '0.', zeroFloatComma = '0,' }

export interface RangeOfNumber {
	minValue: number;
	maxValue: number;
}

export function checkValueToNumber(value: string, range?: RangeOfNumber): number | Error {
	const errorNumber = new Error(ErrorNames.isNotNumber);
	errorNumber.name = ErrorNames.isNotNumber;
	if (!value) {
		return undefined;
	}
	const valueWithLetters = value.match(/[a-zA-Z]/g);
	if (valueWithLetters) {
		return errorNumber;
	}
	if (value === NumberExceptions.zero ||
		value === NumberExceptions.zeroFloatComma ||
		value === NumberExceptions.zeroFloatPoint) {
		return 0;
	}
	value = onInputChange(value);
	const number = parseFloat(value);
	if (number) {
		if (range && range.minValue <= number && range.maxValue >= number) {
			return number;
		} else if (!range) {
			return number;
		} else {
			const errorRange = new Error(ErrorNames.isNotRange);
			errorRange.name = ErrorNames.isNotRange;
			return errorRange;
		}
	} else {
		return errorNumber;
	}
}

export function onInputChange(value: string) {
	return value.replace(/\,/g, '.');
}

export function checkInputData(
	event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
	range?: RangeOfNumber
): number | Error {
	if (!event.target.value) {
		return;
	}
	const value = checkValueToNumber(event.target.value, range);
	if (value instanceof Error) {
		if (value.name === ErrorNames.isNotNumber) {
			value.message = 'Данное значение не является числом, исправьте введенное значение';
			return value;
		}
		if (value.name === ErrorNames.isNotRange) {
			value.message = 'Данное значение не входит в заданный диапазон, исправьте введенное значение';
			return value;
		}
	} else {
		return value;
	}
}

export function labelTemplate(title: string, value: string | number): JSX.Element {
	return <div className={'label-template'}>
		<div className={'input-label'}>
			{title}
		</div>
		<div className={'readonly-text'}>
			{value}
		</div>
	</div>
}

export interface ItemList {
	value: number | string;
	label: string;
}

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
		return <div className={'select-template'}>
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
		</div>;
	}
}

/** Component to input data like a number */
interface InputTemplateProps {
	title: string;
	placeholder: string;
	onErrorExist(isError: boolean): void;
	range?: RangeOfNumber;
	onInputRef?(input: HTMLInputElement): void;
	onInput?(value: number): void;

}

interface InputTemplateState {
	error: Error;
	value: string;
}

export class InputTemplate extends React.Component<InputTemplateProps, InputTemplateState> {
	private inputRef: HTMLInputElement;
	constructor(props: InputTemplateProps) {
		super(props);
		this.state = {
			error: undefined,
			value: undefined,
		};
	}

	private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { range, onInput, onErrorExist } = this.props;
		const value = checkInputData(event, range);
		if (value instanceof Error) {
			onErrorExist(true);
			this.setState({ error: value, value: event.target.value });
			return;
		}
		if (onInput) {
			onErrorExist(false);
			this.props.onInput(value);
			this.setState({ error: undefined, value: event.target.value });
		}
	}

	private onInputRefChange = (input: HTMLInputElement) => {
		if (input && this.props.onInputRef) {
			this.props.onInputRef(input);
		}
	}

	private resetValue = () => {
		if (this.inputRef) {
			this.inputRef.value = '';
			this.setState({value: undefined, error: undefined});
		}
	}

	render() {
		const { title, placeholder } = this.props;
		const { error, value } = this.state;
		return <div>
			<div className={'input-template'}>
				<div className={'input-label'}>
					{title}
				</div>
				<div className={'input-with-clear-button'}>
					<input className={'text-input'} type={'text'}
						placeholder={placeholder} ref={input => {
							this.inputRef = input; this.onInputRefChange(input);
							}
						} onChange={this.onInputChange} />
					{value ? <button className={'input-clear-button'} onClick={this.resetValue}>
							<i className={'fas fa-times'}></i>
						</button> : null}
				</div>
			</div>
			{error ? <ErrorAlert errorValue={error} /> : null}
		</div>;
	}
}
