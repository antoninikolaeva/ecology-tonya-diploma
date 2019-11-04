import * as React from 'react';
import { selectTemplate, GRATE_CONST as _, labelTemplate, inputTemplate, } from './grate.service';
import { SourceOfWasteWater, HammerCrusher, hammerCrushers } from './grate-resources';
import { checkInputData } from '../general';
import { ErrorAlert } from '../error/error';

interface GrateMechanicProps {
    secondMaxFlow: number;
    dailyWaterFlow: number;
}

interface GrateMechanicState {
    sourceOfWasteWater: SourceOfWasteWater;
    dailyWasteGenerated: number;
    dailyWasteGeneratedError: Error;
    amountOfWaste: number;
    amountOfHammerCrushers: number;
    normOfWaterOut: number;
    normOfWaterOutError: Error;
    // listOfRodThickness: number[];
    // amountOfSuitableGrates: number;
    // valueOfLedgeInstallationPlace: number;
    // currentTypeOfGrates: TypeOfGrates;
    // currentStandardWidthOfChannel: number;
    // commonLengthOfChamberGrate: number;
    // maxSecondFlow: number;
    // currentGrateCrusher: GrateCrusher;
    // validateErrors: any[];
    // checkWaterError: boolean;
    // checkGrateCrusherError: boolean;
    // dailyFlow: number;
}

export class GrateMechanic extends React.Component<GrateMechanicProps, GrateMechanicState> {
    private dailyWasteGeneratedRef: HTMLInputElement = undefined;
    private normOfWaterOutRef: HTMLInputElement = undefined;
    private currentHammerCrusher: HammerCrusher = hammerCrushers[0];

    constructor(props: GrateMechanicProps) {
        super(props);
        this.state = {
            sourceOfWasteWater: SourceOfWasteWater.manufacture,
            dailyWasteGenerated: undefined,
            amountOfWaste: undefined,
            amountOfHammerCrushers: undefined,
            normOfWaterOut: undefined,
            dailyWasteGeneratedError: undefined,
            normOfWaterOutError: undefined,
        };
    }

    // Динамический расчет количества загрязнений и количества молотковых дробилок
    private amountOfWasteGenerated = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {dailyWaterFlow} = this.props;
        const {sourceOfWasteWater} = this.state;
        // value - переменная используемая как для производства так и для городских стоков
        // определяет либо количество отбросов, либо норму водоотведения
        const value = checkInputData(event);
        if (value instanceof Error) {
            sourceOfWasteWater === SourceOfWasteWater.manufacture ?
                this.setState({dailyWasteGeneratedError: value}) :
                this.setState({normOfWaterOutError: value})
        } else {
            let amountOfWaste;
            if (sourceOfWasteWater === SourceOfWasteWater.manufacture) {
                amountOfWaste = _.WOTB_MANUFACTURE * value * _.K /
                    _.HOURS_IN_DAY;
            } else {
                const amountOfDwellers = _.TRANSFORM_LITER_TO_VOLUME_METER * dailyWaterFlow / value;
                amountOfWaste = _.QOTB * amountOfDwellers / _.WOTB_CITY;
            }
            let amountOfHammerCrushers = (amountOfWaste / this.currentHammerCrusher.performance) > 1 ?
                Math.ceil(amountOfWaste / this.currentHammerCrusher.performance) :
                1;
            // amountOfHammerCrushers = amountOfWaste === 0 ? 0 : amountOfHammerCrushers;
            sourceOfWasteWater === SourceOfWasteWater.manufacture ?
                this.setState({amountOfWaste, amountOfHammerCrushers,
                    dailyWasteGenerated: value, dailyWasteGeneratedError: undefined}) :
                this.setState({amountOfWaste, amountOfHammerCrushers,
                    normOfWaterOut: value, normOfWaterOutError: undefined})
        }
    }

    // Выбор источника сточных вод
    private selectSourceOfWasteWater = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!event.target.value) return;
        if (this.dailyWasteGeneratedRef) this.dailyWasteGeneratedRef.value = '';
        if (this.normOfWaterOutRef) this.normOfWaterOutRef.value = '';
        this.setState({sourceOfWasteWater: parseFloat(event.target.value),
            amountOfWaste: 0, amountOfHammerCrushers: 0, dailyWasteGenerated: 0, normOfWaterOut: 0});
    }

    // Выбор решеток дробилок из списка
    private selectHammerCrusher = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!event.target.value) return;
        const {amountOfWaste} = this.state;
        const performanceOfCrusher = parseFloat(event.target.value);
        const amountOfHammerCrushers = (amountOfWaste / performanceOfCrusher) > 1 ?
            Math.ceil(amountOfWaste / performanceOfCrusher) :
            1;
        this.setState({amountOfHammerCrushers});
    }

    // Отрисовка выбора источника грязной воды
    private renderSourceOfWasteWater = () => {
        const {dailyWaterFlow} = this.props;
        const {sourceOfWasteWater, amountOfHammerCrushers, dailyWasteGeneratedError, normOfWaterOutError} = this.state;
        return <div>
            {selectTemplate('Источник сточных вод',
                <select className={'grate-input-value'}
                    onChange={this.selectSourceOfWasteWater}>
                    <option value={SourceOfWasteWater.manufacture}>Производсвенный сток</option>
                    <option value={SourceOfWasteWater.city}>Городской сток</option>
                </select>)}
            {labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
            {sourceOfWasteWater === SourceOfWasteWater.city ? 
                inputTemplate('Норма водоотведения, л/(чел*сут)',
                    <input type={'text'} ref={input => this.normOfWaterOutRef = input} onChange={this.amountOfWasteGenerated}/>) :
                inputTemplate('Количество образующихся отбросов, м3/сут',
                    <input type={'text'} ref={input => this.dailyWasteGeneratedRef = input} onChange={this.amountOfWasteGenerated}/>)}
            {dailyWasteGeneratedError ? <ErrorAlert errorValue={dailyWasteGeneratedError}/>: null}
            {normOfWaterOutError ? <ErrorAlert errorValue={normOfWaterOutError}/>: null}
            {selectTemplate('Выбор молотковых дробилок',
                <select className={'grate-input-value'} onChange={(event) => {this.selectHammerCrusher(event)}}>
                    {hammerCrushers.map((crusher: HammerCrusher, index) => {
                        return <option key={index} value={crusher.performance}>{crusher.mark}</option>;
                    })}
                </select>)}
            {amountOfHammerCrushers ?
                labelTemplate('Количество молотковых дробилок необходимых для очистки, шт', amountOfHammerCrushers) : null}
        </div>
    }

    private renderFirstTypeOfGrate = () => {
        const {
            // validateErrors,
            // listOfRodThickness,
            // amountOfHammerCrushers,
            // dailyFlow,
            // checkWaterError,
        } = this.state;
        return <div>
            {this.renderSourceOfWasteWater()}
            {/* {dailyFlow ? <InputTemplate title={'Норма водоотведения, л/(чел*сут)'} placeholder={'Введите значение a...'} onChange={this.inputAmountOfWasteWater} /> : null}
            {selectTemplate('Выбор молотковых дробилок',
                <select className={'grate-input-value'} onChange={(event) => {this.selectHammerCrusher(event)}}>
                    {hammerCrushers.map((crusher, index) => {
                        return <option key={index} value={crusher.performance}>{crusher.mark}</option>;
                    })}
                </select>)}
            {amountOfHammerCrushers ?
                labelTemplate('Количество молотковых дробилок необходимых для очистки, шт', amountOfHammerCrushers) : null}
            {this.renderCommonFirstAndSecondInputData()}
            <InputTemplate title={'Коэффициент, учитывающий стеснение потока механическими граблями, диапазон [1.05 - 1.1]'}
                placeholder={'Введите значение Kst...'} onChange={(value) => {this.flowRestrictionRake = parseFloat(value)}} />
            {selectTemplate('Ширина прозоров решетки, м',
                <select className={'grate-input-value'} onChange={(event) => { this.selectWidthSection(event) }}>
                    {this.listOfWidthSection.map((section, index) => {
                        return <option key={index}value={section}>{section}</option>;
                    })}
                </select>)}
            {selectTemplate('Толщина стержней решетки, м',
                <select className={'grate-input-value'} onChange={(event => {this.currentRodThickness = parseFloat(event.target.value)})}>
                    {listOfRodThickness.map((rodThickness, index) => {
                        return <option key={index} value={rodThickness}>{rodThickness}</option>;
                    })}
                </select>)}
            {this.renderCountingButton()}
             {checkWaterError ? 
                <OutputError errorMessage={'К сожалению, для заданных параметров не подходит ни одна решетка.' +
                    'Пожалуйста, выберите иные входные данные (ширину прозоров и/или толщину стержней).'} /> :
                null}
            {this.resetData()}
            {this.commonResultFirstAndSecondCounting()}
            {validateErrors.length > 0 ? this.renderValidateErrors() : null} */}
        </div>;
    }

    render() {
        return this.renderFirstTypeOfGrate();
    }
}