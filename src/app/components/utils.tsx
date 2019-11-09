import * as React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { ErrorAlert } from './error/error';

export const NULLSTR = '';

export enum ErrorNames {
    isNotANumber = 'The value is not a number',
}

enum NumberExceptions {zero = '0', zeroFloatPoint = '0.', zeroFloatComma = '0,'}

export function checkValueToNumber(value: string): number | Error {
    const error = new Error(ErrorNames.isNotANumber);
    error.name = ErrorNames.isNotANumber;
    if (!value) {
        return undefined;
    }
    const valueWithLetters = value.match(/[a-zA-Z]/g);
    if(valueWithLetters) {
        return error;
    }
    if (value === NumberExceptions.zero ||
        value === NumberExceptions.zeroFloatComma ||
        value === NumberExceptions.zeroFloatPoint) {
        return 0;
    }
    value = onInputChange(value);
    const number = parseFloat(value);
    if (number) {
        return number;
    } else {
        return error;
    }
}

export function onInputChange (value: string) {
    return value.replace(/\,/g, '.');
}

export function checkInputData(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
): number | Error {
    if (!event.target.value) {
        return;
    }
    const value = checkValueToNumber(event.target.value);
    if (value instanceof Error && value.name === ErrorNames.isNotANumber) {
        value.message = 'Данное значение не является числом, исправьте введенное значение';
        return value;
    } else {
        return value;
    }
}

export function labelTemplate (title: string, value: string | number): JSX.Element {
    return <InputGroup className={'grate-input-group'}>
        <InputGroup.Prepend>
            <InputGroup.Text className={'grate-input-title'}>
                {title}
            </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Label className={'grate-input-value'}>
            {value}
        </Form.Label>
    </InputGroup> 
}

export function selectTemplate (title: string, template: JSX.Element): JSX.Element {
    return <InputGroup className={'grate-input-group'}>
        <InputGroup.Prepend>
            <InputGroup.Text className={'grate-input-title'}>
                {title}
            </InputGroup.Text>
        </InputGroup.Prepend>
        {template}
    </InputGroup>;
}

export interface ItemList {
    value: number | string;
    label: string;
}

interface SelectTemplateProps {
    title: string;
    itemList: ItemList[];
    onSelect(value: number | string): void;
    onSelectRef?(input: HTMLSelectElement): void;
}

export class SelectTemplate extends React.Component<SelectTemplateProps, {}> {
    constructor(props: SelectTemplateProps) {
        super(props);
    }

    onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = checkInputData(event);
        // if we get an error, it means that we have a string field and we return it like a string
        if (value instanceof Error) {
            this.props.onSelect(event.target.value);
            return;
        }
        this.props.onSelect(value);
    }

    onSelectRefChange = (input: HTMLSelectElement) => {
        if (input && this.props.onSelectRef) {
            this.props.onSelectRef(input);
        }
    }

    render() {
        const {title, itemList} = this.props;
        return <InputGroup className={'grate-input-group'}>
            <InputGroup.Prepend>
                <InputGroup.Text className={'grate-input-title'}>
                    {title}
                </InputGroup.Text>
            </InputGroup.Prepend>
            <select className={'grate-input-value'} ref={input => this.onSelectRefChange(input)} onChange={this.onSelectChange}>
                {itemList.map((item, index) => {
                    return <option key={`${item.value}-${index}`} value={item.value}>{item.label}</option>
                })}
            </select>
        </InputGroup>
    }
}

/** Component to input data like a number */ 
interface InputTemplateProps {
    title: string;
    placeholder: string;
    onInputRef?(input: HTMLInputElement): void;
    onInput?(value: number): void;
}

interface InputTemplateState {
    error: Error;
}

export class InputTemplate extends React.Component<InputTemplateProps, InputTemplateState> {
    constructor(props: InputTemplateProps) {
        super(props);
        this.state = {
            error: undefined,
        }
    }

    onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = checkInputData(event);
        if (value instanceof Error) {
            this.setState({error: value});
            return;
        }
        if (this.props.onInput) {
            this.props.onInput(value);
            this.setState({error: undefined});
        }
    }

    onInputRefChange = (input: HTMLInputElement) => {
        if (input && this.props.onInputRef) {
            this.props.onInputRef(input);
        }
    }

    render() {
        const {title, placeholder} = this.props;
        const {error} = this.state;
        return <div>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        {title}
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <input type={'text'} placeholder={placeholder} ref={input => this.onInputRefChange(input)} onChange={this.onInputChange}/>
            </InputGroup>
            {error ? <ErrorAlert errorValue={error}/>: null}
        </div>
    }
}