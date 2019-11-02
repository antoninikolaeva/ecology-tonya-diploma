export enum ErrorNames {
    isNotANumber = 'The value is not a number',
}

enum NumberExceptions {zero = '0', zeroFloatPoint = '0.', zeroFloatComma = '0,'}

export function checkValueToNumber(value: string): number | Error {
    if (!value) {
        return undefined;
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
        const error = new Error(ErrorNames.isNotANumber);
        error.name = ErrorNames.isNotANumber;
        return error;
    }
}

export function onInputChange (value: string) {
    return value.replace(/\,/g, '.');
}