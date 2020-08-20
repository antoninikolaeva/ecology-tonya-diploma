import * as React from 'react';

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
	const valueWithLetters = value.match(/[a-zA-Zа-яА-Я]/gm);
	if (valueWithLetters) {
		return errorNumber;
	}
	if (value === NumberExceptions.zero ||
		value === NumberExceptions.zeroFloatComma ||
		value === NumberExceptions.zeroFloatPoint) {
		return 0;
	}
	value = onInputChange(value);
	const numValue = parseFloat(value);
	if (numValue) {
		if (range && range.minValue <= numValue && range.maxValue >= numValue) {
			return numValue;
		} else if (!range) {
			return numValue;
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
	return (
		<div className={'label-template'}>
			<div className={'input-label'}>
				{title}
			</div>
			<div className={'readonly-text'}>
				{value}
			</div>
		</div>
	);
}

export function resetSelectToDefault(itemListRef: HTMLOptionElement[], itemList: ItemList[]) {
	if (itemListRef && itemList && itemListRef.length !== 0 && itemList.length !== 0) {
		itemListRef[0].selected = true;
		itemListRef[0].disabled = true;
		itemListRef[0].value = itemList[0].label;
	}
}

export interface ItemList {
	value: number | string;
	label: string;
}
