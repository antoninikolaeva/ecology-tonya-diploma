import { grates } from "./grate-resources";

export const commonConst = {
    g: 9.80666,
    p: 3,
    k: 2,
    hoursInDay: 24,
    manufacture: 750,
    city: 365000,
    pfi: 20,
    increaseChannelPort: 1.8,
    amountOfWasteWater: 40,
    amountOfWasteFixed: 8,
};

export const onlyFirstConst = {

};

export const onlySecondConst = {
    standardWidthsOfChannel: [0.4, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2],
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

function getUniqueValuesArray(array: number[]) {
    return array.filter(
        (value, index, self) => self.indexOf(value) === index);
}