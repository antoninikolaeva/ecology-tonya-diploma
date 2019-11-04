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