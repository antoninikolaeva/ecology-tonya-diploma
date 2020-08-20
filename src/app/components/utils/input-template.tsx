import * as React from 'react';
import { checkInputData, RangeOfNumber } from './utils';
import { ErrorAlert } from '../error/error';

interface InputTemplateProps {
	title: string | JSX.Element;
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
			this.setState({ value: undefined, error: undefined });
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
