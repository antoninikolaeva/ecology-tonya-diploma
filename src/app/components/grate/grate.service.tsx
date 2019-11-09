import * as React from 'react';
import { Alert, Form } from 'react-bootstrap';

import { grates } from './grate-resources';
import { InputGroup } from 'react-bootstrap';

export const GRATE_CONST = {
    G: 9.80666,
    P: 3,
    K: 2,
    HOURS_IN_DAY: 24,
    WOTB_MANUFACTURE: 750,
    WOTB_CITY: 365000,
    PFI: 20,
    CHANNEL_PORT: 1.8,
    TECHNICAL_WATER: 40,
    QOTB: 8,
    STANDARD_WIDTH_OF_CHANNEL: [0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2],
    FLOW_RESTRICTION_RAKE: 1,
    MIN_CHECK_SPEED_WATER: 0.8,
    MAX_CHECK_SPEED_WATER: 1,
    FIXED_WIDTH_SECTION: 0.016,
    BASE_AMOUNT_OF_GRATES: 3,
    ADDITIONAL_AMOUNT_OF_GRATES: 2,
    SPEED_WATER_IN_CHANNEL_MIN: 0.6,
    SPEED_WATER_IN_CHANNEL_MAX: 0.8,
    SPEED_WATER_IN_SECTION_MIN: 0.8,
    SPEED_WATER_IN_SECTION_MAX: 1,
    INCLINE_ANGLE_MIN: 60,
    INCLINE_ANGLE_MAX: 70,
    FLOW_RESTRICTION_RAKE_MIN: 1.05,
    FLOW_RESTRICTION_RAKE_MAX: 1.1,
    TRANSFORM_LITER_TO_VOLUME_METER: 1000,
};

export interface InputProps {
    title: string;
    placeholder: string;
    onChange?(value: string): void;
}

export class InputTemplate extends React.Component<InputProps, {}> {
    constructor(props: InputProps) {
        super(props);
    }

    onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value) this.props.onChange('0');
        if (!checkIsNumber(event.target.value)) return;
        const value = event.target.value.replace(/\,/g, '.');
        this.props.onChange(value);
    }

    render() {
        const {title, placeholder} = this.props;
        return <InputGroup className={'grate-input-group'}>
            <InputGroup.Prepend>
                <InputGroup.Text className={'grate-input-title'}>
                    {title}
                </InputGroup.Text>
            </InputGroup.Prepend>
            <input className={'grate-input-value'} type={'text'}
                placeholder={placeholder}
                onChange={(event) => this.onInputChange(event)}/>
        </InputGroup>;
    }

}

export function transferRadiansToDegrees(radians: number): number {
    return radians * Math.PI / 180;
}

export function getUniqueWidthSection(): number[] {
    const onlyWidthSections = grates.map(grate => {
        return grate.widthSection;
    });
    return getUniqueValuesArray(onlyWidthSections);
}

export function getUniqueRodThickness(currentWidthSection: number): number[] {
    const currentGrates = grates.filter(grate => {
        return grate.widthSection === currentWidthSection;
    });
    const currentRodThickness = currentGrates.map(grate => grate.rodThickness);
    return getUniqueValuesArray(currentRodThickness);
}

export function checkIsNumber(value: number | string): boolean {
    if (typeof value === 'number') {
        return true;
    } else {
        const regExp = /[^\D]/g;
        const isSymbols = regExp.test(value);
        return isSymbols;
    }
}

export class OutputError extends React.Component<{errorMessage: string}, {}> {
    constructor(props: {errorMessage: string}) {
        super(props);
    }

    render() {
        const {errorMessage} = this.props;
        return <Alert variant={'danger'}>
            {errorMessage}
        </Alert>;
    }
}

function getUniqueValuesArray(array: number[]) {
    return array.filter(
        (value, index, self) => self.indexOf(value) === index);
}