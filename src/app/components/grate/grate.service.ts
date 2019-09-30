import { grates } from "./grate-resources";

export const commonConsts = {
    g: 9.80666,
    p: 3,
    k: 2,
    hoursInDay: 24,
    pOtbFirst: 750,
    pOtbSecond: 365000,
    fi: 20,
    increaseChannelPort: 1.8,
    amountOfWasteWater: 40,
};

export const onlyFirstConsts = {

};

export const onlySecondConsts = {
    standardWidthsOfChannel: [0.4, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2],
    amountOfWasteFixed: 8,
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

function getUniqueValuesArray(array: number[]) {
    return array.filter(
        (value, index, self) => self.indexOf(value) === index);
}