import * as React from 'react';
import { Nav, InputGroup, Alert } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import {
    getUniqueWidthSection,
    getUniqueRodThickness,
    GRATE_CONST as _,
    checkIsNumber,
    transferRadiansToDegrees,
    OutputError,
} from './grate.service';
import { 
    grates,
    Grate,
    hammerCrushers,
    HammerCrusher,
    GrateCrusher,
    grateCrushers,
    TypeOfGrates,
    SourceOfWasteWater,
    FormOfRods,
    CheckObject,
} from './grate-resources';

interface Props {
}

interface State {
    grateTypeOne: boolean;
    grateTypeTwo: boolean;
    grateTypeThree: boolean;
    sourceOfWasteWater: SourceOfWasteWater;
    amountOfWaste: number;
    amountOfHammerCrushers: number;
    listOfRodThickness: number[];
    amountOfSuitableGrates: number;
    valueOfLedgeInstallationPlace: number;
    currentTypeOfGrates: TypeOfGrates;
    currentStandardWidthOfChannel: number;
    commonLengthOfChamberGrate: number;
    maxSecondFlow: number;
    currentGrateCrusher: GrateCrusher;
    validateErrors: any[];
    checkWaterError: boolean;
    checkGrateCrusherError: boolean;
}

export class GrateComponent extends React.Component<Props, State> {
    private speedOfWaterInChannel: number = undefined;
    private speedOfWaterInSection: number = undefined;
    private formOfRod: FormOfRods = FormOfRods.prizma;
    private inclineAngle: number = undefined;
    private flowRestrictionRake: number = undefined;
    private listOfWidthSection: number[] = getUniqueWidthSection();
    private currentWidthSection: number = this.listOfWidthSection[0];
    private currentRodThickness: number = getUniqueRodThickness(this.currentWidthSection)[0];
    private currentHammerCrusher: HammerCrusher = hammerCrushers[0];
    private suitableGrates: Grate[] = [];
    private currentSuitableGrate: Grate = undefined;
    private amountOfSectionInEachGrate: number= undefined;
    private widthOfGrateCounted: number= undefined;
    private sizeOfInputChannelPart: number = undefined;
    private sizeOfOutputChannelPart: number = undefined;
    private lengthOfIncreaseChannelPart: number = undefined;
    private checkGrateCrusherSpeed: number = undefined;
    private amountGrateOfCrushers: number = undefined;

    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            grateTypeOne: true,
            grateTypeTwo: false,
            grateTypeThree: false,
            sourceOfWasteWater: SourceOfWasteWater.manufacture,
            amountOfWaste: undefined,
            amountOfHammerCrushers: undefined,
            listOfRodThickness: getUniqueRodThickness(this.currentWidthSection),
            amountOfSuitableGrates: undefined,
            valueOfLedgeInstallationPlace: undefined,
            currentTypeOfGrates: TypeOfGrates.vertical,
            currentStandardWidthOfChannel: _.STANDARD_WIDTH_OF_CHANNEL[0],
            commonLengthOfChamberGrate: undefined,
            maxSecondFlow: undefined,
            currentGrateCrusher: grateCrushers[0],
            validateErrors: [],
            checkWaterError: false,
            checkGrateCrusherError: false,
        }
    }

    private defaultLocalSettings = () => {
        this.speedOfWaterInChannel = undefined;
        this.speedOfWaterInSection = undefined;
        this.formOfRod = FormOfRods.prizma;
        this.inclineAngle = undefined;
        this.flowRestrictionRake = undefined;
        this.listOfWidthSection = getUniqueWidthSection();
        this.currentWidthSection = this.listOfWidthSection[0];
        this.currentRodThickness = getUniqueRodThickness(this.currentWidthSection)[0];
        this.currentHammerCrusher = hammerCrushers[0];
        this.suitableGrates = [];
        this.currentSuitableGrate = undefined;
        this.amountOfSectionInEachGrate = undefined;
        this.widthOfGrateCounted = undefined;
        this.sizeOfInputChannelPart = undefined;
        this.sizeOfOutputChannelPart = undefined;
        this.lengthOfIncreaseChannelPart = undefined;
        this.checkGrateCrusherSpeed = undefined;
        this.amountGrateOfCrushers = undefined;
    }

    private defaultStateSettings = () => {
        this.setState({
            sourceOfWasteWater: SourceOfWasteWater.manufacture,
            amountOfWaste: undefined,
            amountOfHammerCrushers: undefined,
            listOfRodThickness: getUniqueRodThickness(this.currentWidthSection),
            amountOfSuitableGrates: undefined,
            valueOfLedgeInstallationPlace: undefined,
            currentTypeOfGrates: TypeOfGrates.vertical,
            currentStandardWidthOfChannel: _.STANDARD_WIDTH_OF_CHANNEL[0],
            commonLengthOfChamberGrate: undefined,
            maxSecondFlow: undefined,
            currentGrateCrusher: grateCrushers[0],
            validateErrors: [],
            checkWaterError: false,
            checkGrateCrusherError: false,
        });
    }

    private createFinalCheckObject = (): CheckObject => {
        const {
            grateTypeOne,
            maxSecondFlow
        } = this.state;
        const check: CheckObject = {
            flowRestrictionRake: this.flowRestrictionRake,
            grateTypeOne,
            inclineAngle: this.inclineAngle,
            maxSecondFlow,
            speedOfWaterInChannel: this.speedOfWaterInChannel,
            speedOfWaterInSection: this.speedOfWaterInSection,
        };
        return check;
    }

    private inputAmountOfWasteWater = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {sourceOfWasteWater} = this.state;
        if(!checkIsNumber(event.target.value)) {
           return; // to do Error notification 
        }
        const amountOfWasteWater = parseFloat(event.target.value);
        let amountOfWaste
        if (sourceOfWasteWater === SourceOfWasteWater.manufacture) {
            amountOfWaste = _.WOTB_MANUFACTURE * amountOfWasteWater * _.K /
                _.HOURS_IN_DAY;
        } else {
            amountOfWaste = _.QOTB * amountOfWasteWater / _.WOTB_CITY;
        }
        const amountOfHammerCrushers = (amountOfWaste / this.currentHammerCrusher.performance) > 1 ?
            Math.ceil(amountOfWaste / this.currentHammerCrusher.performance) :
            1;
        this.setState({amountOfWaste, amountOfHammerCrushers});
    }

    private selectHammerCrusher = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {amountOfWaste} = this.state;
        if(!checkIsNumber(event.target.value)) {
            return; // to do Error notification 
        }
        const performanceOfCrusher = parseFloat(event.target.value);
        const amountOfHammerCrushers = (amountOfWaste / performanceOfCrusher) > 1 ?
            Math.ceil(amountOfWaste / performanceOfCrusher) :
            1;
        this.setState({amountOfHammerCrushers});
    }

    private selectWidthSection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!checkIsNumber(event.target.value)) {
            return;
        }
        this.currentWidthSection = parseFloat(event.target.value);
        const listOfRodThickness = getUniqueRodThickness(this.currentWidthSection);
        this.currentRodThickness = listOfRodThickness[0];
        this.setState({listOfRodThickness});
    }

    private grateCounting = () => {
        const {grateTypeOne, grateTypeTwo, maxSecondFlow} = this.state;
        const errors = checkAllInputForCounting(this.createFinalCheckObject());
        if(errors.length > 0 ) {
            this.setState({validateErrors: errors});
            return;
        }
        // to do check to number value > 0
        let amountOfSection;
        if (grateTypeOne) {
            amountOfSection = (this.flowRestrictionRake * maxSecondFlow) /
            (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
            this.speedOfWaterInSection * this.currentWidthSection);
        }
        if (grateTypeTwo) {
            amountOfSection = (_.FLOW_RESTRICTION_RAKE * maxSecondFlow) /
            (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
            this.speedOfWaterInSection * this.currentWidthSection);
        }
        const commonWidthOfGrate =  this.currentRodThickness * (amountOfSection - 1) +
            this.currentWidthSection * amountOfSection;

        let amountOfSuitableGrates = 1;
        this.suitableGrates = [];
        while (amountOfSuitableGrates > 0) {
            this.suitableGrates = grates.filter(grate => {
                const isSuitableGrate = commonWidthOfGrate <= (amountOfSuitableGrates * grate.size.width) &&
                    grate.widthSection === this.currentWidthSection &&
                    grate.rodThickness ===  this.currentRodThickness;
                return isSuitableGrate;
            });
            if (this.suitableGrates.length > 0) {
                break;
            } else {
                amountOfSuitableGrates++;
            }
        }
        this.currentSuitableGrate = this.suitableGrates[0];
        if (grateTypeTwo) {
            this.amountOfSectionInEachGrate = amountOfSection / amountOfSuitableGrates;
            this.widthOfGrateCounted = commonWidthOfGrate / amountOfSuitableGrates;
        }
        this.checkWaterSpeedCounting(this.currentSuitableGrate, amountOfSuitableGrates);
        this.setState({
            amountOfSuitableGrates,
            validateErrors: [],
        });
    }

    private checkWaterSpeed = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const currentGrateMark = event.target.value;
        this.currentSuitableGrate = this.suitableGrates.find(grate => grate.mark === currentGrateMark);
        this.checkWaterSpeedCounting(this.currentSuitableGrate);
    }

    private checkWaterSpeedCounting = (currentSuitableGrate: Grate, amountOfSuitableGratesDefault?: number) => {
        const {amountOfSuitableGrates, grateTypeTwo, grateTypeOne, maxSecondFlow} = this.state;
        const amountOfSuitableGratesReal = amountOfSuitableGrates && !amountOfSuitableGratesDefault ?
            amountOfSuitableGrates :
            amountOfSuitableGratesDefault;
        let checkSpeedOfWater;
        if (grateTypeOne) {
            checkSpeedOfWater = (this.flowRestrictionRake * maxSecondFlow) /
                (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
                currentSuitableGrate.numberOfSection * this.currentWidthSection *
                amountOfSuitableGratesReal);
        }
        if (grateTypeTwo) {
            checkSpeedOfWater = (_.FLOW_RESTRICTION_RAKE * maxSecondFlow) /
                (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
                this.amountOfSectionInEachGrate * this.currentWidthSection *
                amountOfSuitableGratesReal);
        }
        if (!(checkSpeedOfWater >= _.MIN_CHECK_SPEED_WATER) && !(checkSpeedOfWater <= _.MAX_CHECK_SPEED_WATER)) {
            this.setState({checkWaterError: true});
            return;
        }
        const dzeta = this.formOfRod * Math.sin(transferRadiansToDegrees(this.inclineAngle)) *
            Math.pow(this.currentRodThickness / this.currentWidthSection, (4 / 3));
        const valueOfLedgeInstallationPlace = dzeta * Math.pow(checkSpeedOfWater, 2) / (2 * _.G) * _.P;
        this.setState({valueOfLedgeInstallationPlace, checkWaterError: false});
    };

    private selectStandardWidthOfChannel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {currentTypeOfGrates} = this.state;
        if (!checkIsNumber(event.target.value)) {
            return;
        }
        const standardWidthChannel = parseFloat(event.target.value);
        this.countingLengths(standardWidthChannel, currentTypeOfGrates);
    }

    private selectTypeOfGrate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {currentStandardWidthOfChannel,} = this.state;
        const typeOfGrate = parseFloat(event.target.value);
        this.countingLengths(currentStandardWidthOfChannel, typeOfGrate);
    }

    private countingLengths = (currentStandardWidthOfChannel: number, typeOfGrate: number) => {
        const {maxSecondFlow} = this.state;
        this.sizeOfInputChannelPart = (this.widthOfGrateCounted - currentStandardWidthOfChannel) /
            (2 * transferRadiansToDegrees(_.PFI));
        this.sizeOfOutputChannelPart = 0.5 * this.sizeOfInputChannelPart;
        if (typeOfGrate === TypeOfGrates.vertical) {
            this.lengthOfIncreaseChannelPart = _.CHANNEL_PORT * currentStandardWidthOfChannel;
        } else {
            this.lengthOfIncreaseChannelPart = (_.CHANNEL_PORT * currentStandardWidthOfChannel) +
                Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) /
                Math.tan(transferRadiansToDegrees(this.inclineAngle));
        }
        this.setState({commonLengthOfChamberGrate:
            this.sizeOfInputChannelPart + this.sizeOfOutputChannelPart + this.lengthOfIncreaseChannelPart,
        });
    }

    private selectGrateCrusher = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {maxSecondFlow} = this.state;
        const markOfGrateCrusher = event.target.value;
        const currentGrateCrusher = grateCrushers.find(grateCrusher => grateCrusher.mark === markOfGrateCrusher);
        this.countingGrateCrusher(maxSecondFlow, currentGrateCrusher);
        this.setState({currentGrateCrusher});
    }

    private countingGrateCrusher = (maxSecondFlow: number, currentGrateCrusher: GrateCrusher) => {
        this.amountGrateOfCrushers = 1;
        while (1) {
            if ((this.amountGrateOfCrushers * currentGrateCrusher.maxPerformance) > maxSecondFlow) {
                break;
            }
            this.amountGrateOfCrushers++;
        }
        const v = maxSecondFlow / (this.amountGrateOfCrushers * currentGrateCrusher.squareHeliumHole);
        if (v > currentGrateCrusher.speedOfMoveInSectionMin && v < currentGrateCrusher.speedOfMoveInSectionMax) {
            this.checkGrateCrusherSpeed = parseFloat(v.toFixed(3));
            this.setState({checkGrateCrusherError: false});
        } else {
            this.checkGrateCrusherSpeed = parseFloat(v.toFixed(3));
            this.setState({checkGrateCrusherError: true});
        }
    }

    private inputMaxSecondFlow = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {grateTypeThree, currentGrateCrusher} = this.state;
        if (!checkIsNumber(event.target.value)) {
            return;
        }
        const maxSecondFlow = parseFloat(event.target.value);
        if (grateTypeThree) {
            this.countingGrateCrusher(maxSecondFlow, currentGrateCrusher);
            this.setState({maxSecondFlow});
        } else {
            this.setState({maxSecondFlow});
        }
    }

    private renderCommonInputData = () => {
        return (
            this.selectAndInputTemplate('Максимальный секундный расход, м3/с',
                <input className={'grate-input-value'} type={'text'} placeholder={'Введите значение qmax...'}
                    onChange={(event) => this.inputMaxSecondFlow(event)}/>
            )
        ); 
    }

    private renderCommonFirstAndSecondInputData = () => {
        return <div>
            {this.selectAndInputTemplate('Скрость течения воды в канале, м/с, диапазон [0.6 - 0.8]',
                <input className={'grate-input-value'} type={'text'} placeholder={'Введите значение Vk...'}
                    onChange={(event) => {
                        if (!checkIsNumber(event.target.value)) return;
                        this.speedOfWaterInChannel = parseFloat(event.target.value);
                    }}/>
            )}
            {this.selectAndInputTemplate('Скорость движения воды в прозорах решетки, м/с, диапазон [0.8 - 1]',
                <input className={'grate-input-value'} type={'text'} placeholder={'Введите значение Vp...'}
                    onChange={(event) => {
                        if (!checkIsNumber(event.target.value)) return;
                        this.speedOfWaterInSection = parseFloat(event.target.value);
                    }}/>
            )}
            {this.selectAndInputTemplate('Выбор формы стержней',
                <select className={'grate-input-value'}
                    onChange={(event) => this.formOfRod = parseFloat(event.target.value)}>
                    <option value={FormOfRods.prizma}>Прямоугольная форма</option>
                    <option value={FormOfRods.prizmaWithCircleEdge}>Прямоугольная форма с закругленной лобовой частью</option>
                    <option value={FormOfRods.circle}>Круглая форма</option>
                </select>)}
            {this.selectAndInputTemplate('Угол наклона решетки к горизонту, диапазон [60 - 70]',
                <input className={'grate-input-value'} type={'text'} placeholder={'Введите значение α...'}
                    onChange={(event) => {
                        if (!checkIsNumber(event.target.value)) return;
                        this.inclineAngle = parseFloat(event.target.value);
                }}/>
            )}
        </div>;
    }

    private renderCountingButton = () => {
        return <Button variant={'outline-primary'}
            className={'grate-counting-btn'}
            onClick={() => this.grateCounting()}>
            Подобрать марку решеток
        </Button>
    }

    private renderSourceOfWasteWater = () => {
        const {sourceOfWasteWater} = this.state;
        return <div>
            {this.selectAndInputTemplate('Источник сточных вод',
                <select className={'grate-input-value'}
                    onChange={(event) => this.setState({sourceOfWasteWater: parseFloat(event.target.value)})}>
                    <option value={SourceOfWasteWater.manufacture}>Производсвенный сток</option>
                    <option value={SourceOfWasteWater.city}>Городской сток</option>
                </select>)}
            {
                sourceOfWasteWater === SourceOfWasteWater.city ?
                    this.selectAndInputTemplate('Приведенное население, чел',
                        <input className={'grate-input-value'} type={'text'}
                        placeholder={'Введите значение Nпр...'} onChange={(event) => this.inputAmountOfWasteWater(event)}/>) :
                    this.selectAndInputTemplate('Количество образующихся отбросов, м3/сут',
                    <input className={'grate-input-value'} type={'text'}
                        placeholder={'Введите значение Wотб...'} onChange={(event) => this.inputAmountOfWasteWater(event)}/>)
            }
        </div>;
    }

    private renderFirstTypeOfGrate = () => {
        const {
            validateErrors,
            listOfRodThickness,
            amountOfHammerCrushers,
            amountOfSuitableGrates,
            valueOfLedgeInstallationPlace,
            checkWaterError,
        } = this.state;
        return <div>
            {this.renderCommonInputData()}
            {this.renderSourceOfWasteWater()}
            {this.selectAndInputTemplate('Выбор молотковых дробилок',
                <select className={'grate-input-value'}
                    onChange={(event) => {this.selectHammerCrusher(event)}}>
                    {hammerCrushers.map((crusher, index) => {
                        return <option key={index} value={crusher.performance}>{crusher.mark}</option>;
                    })}
                </select>)}
            {
                amountOfHammerCrushers ?
                    this.labelTemplate('Количество молотковых дробилок необходимых для очистки, шт',
                        amountOfHammerCrushers) :
                    null
            }
            {this.renderCommonFirstAndSecondInputData()}
            {this.selectAndInputTemplate('Коэффициент, учитывающий стеснение потока механическими граблями, диапазон [1.05 - 1.1]',
                <input className={'grate-input-value'} type={'text'} placeholder={'Введите значение Kst...'}
                    onChange={(event) => {
                        if (!checkIsNumber(event.target.value)) return;
                        this.flowRestrictionRake = parseFloat(event.target.value);
                    }}/>
                )}
            {this.selectAndInputTemplate('Ширина прозоров решетки, м',
                <select className={'grate-input-value'}
                    onChange={(event) => { this.selectWidthSection(event) }}>
                    {this.listOfWidthSection.map((section, index) => {
                            return <option key={index}value={section}>{section}</option>;
                        })}
                </select>)}
            {this.selectAndInputTemplate('Толщина стержней решетки, м',
                <select className={'grate-input-value'}
                    onChange={(event => {this.currentRodThickness = parseFloat(event.target.value)})}>
                    {listOfRodThickness.map((rodThickness, index) => {
                        return <option key={index} value={rodThickness}>{rodThickness}</option>;
                    })}
                </select>)}
            {this.renderCountingButton()}
            {
                amountOfSuitableGrates > 0 ?
                    <div>
                        {this.labelTemplate('Количество рабочих решеток, шт', amountOfSuitableGrates)}
                        {this.labelTemplate('Количество резервных решеток, шт',
                            amountOfSuitableGrates > _.BASE_AMOUNT_OF_GRATES ? _.ADDITIONAL_AMOUNT_OF_GRATES : 1)}
            
                        {this.selectAndInputTemplate('Выбор решетки',
                            <select className={'grate-input-value'}
                                onChange={(event) => {this.checkWaterSpeed(event)}}>
                                {this.suitableGrates.map((item, index) => {
                                        return <option key={index} value={item.mark}>{item.mark}</option>
                                    })}
                            </select>)}
                        {
                            checkWaterError ? 
                                <OutputError errorMessage={'К сожалению, выбранная марка решетки не подходит для заданных параметров.' +
                                    'Пожалуйста, выберите другую марку решетки или иные' +
                                    'входные данные (ширину прозоров и/или толщину стержней).'} /> :
                                null
                        }
                        {valueOfLedgeInstallationPlace ?
                            <div>
                                {this.labelTemplate('Величина уступа в месте установки решетки, м', valueOfLedgeInstallationPlace.toFixed(3))}
                                {this.labelTemplate('Количество технической воды, подводимой к дробилками, м3/ч',
                                    (_.TECHNICAL_WATER * valueOfLedgeInstallationPlace).toFixed(3))}
                            </div> :
                            null
                        }
                    </div> :
                    undefined
            }
            {
                validateErrors.length > 0 ?
                    this.renderValidateErrors() :
                    null
            }
        </div>;
    }

    private renderSecondTypeOfGrate = () => {
        const {
            amountOfWaste,
            listOfRodThickness,
            amountOfSuitableGrates,
            valueOfLedgeInstallationPlace,
            commonLengthOfChamberGrate,
            validateErrors
        } = this.state;
        this.currentWidthSection = _.FIXED_WIDTH_SECTION;
        return <div>
            {this.renderCommonInputData()}
            {this.renderSourceOfWasteWater()}
            {this.renderCommonFirstAndSecondInputData()}
            {this.selectAndInputTemplate('Толщина стержней решетки, м',
                <select className={'grate-input-value'}
                    onChange={(event => {this.currentRodThickness = parseFloat(event.target.value)})}>
                    {listOfRodThickness.map((rodThickness, index) => {
                        return <option key={index} value={rodThickness}>{rodThickness}</option>;
                    })}
                </select>)}
            {this.renderCountingButton()}
            {
                amountOfSuitableGrates > 0 ?
                    <div>
                        {this.labelTemplate('Количество рабочих решеток, шт', amountOfSuitableGrates)}
                        {this.labelTemplate('Количество резервных решеток, шт',
                            amountOfSuitableGrates > _.BASE_AMOUNT_OF_GRATES ? _.ADDITIONAL_AMOUNT_OF_GRATES : 1)}
                        {this.selectAndInputTemplate('Выбор решетки',
                            <select className={'grate-input-value'}
                                onChange={(event) => {this.checkWaterSpeed(event)}}>
                                {this.suitableGrates.map((item, index) => {
                                        return <option key={index} value={item.mark}>{item.mark}</option>
                                    })}
                            </select>)}
                        {valueOfLedgeInstallationPlace ?
                            <div>
                                {this.labelTemplate('Величина уступа в месте установки решетки, м', valueOfLedgeInstallationPlace.toFixed(3))}
                                {this.selectAndInputTemplate('Выбор стандартной ширины канала, м',
                                    <select className={'grate-input-value'}
                                        onChange={(event) => this.selectStandardWidthOfChannel(event)}>
                                        {_.STANDARD_WIDTH_OF_CHANNEL.map((width, index) => {
                                            return <option key={index} value={width}>{width}</option>
                                        })}
                                    </select>)}
                                {this.selectAndInputTemplate('Выбор типа решетки',
                                        <select className={'grate-input-value'}
                                        onChange={(event) => {this.selectTypeOfGrate(event)}}>
                                            <option value={'vertical'}>Вертикальные решетки</option>
                                            <option value={'incline'}>Наклонные решетки</option>
                                        </select>)}
                                {
                                    commonLengthOfChamberGrate ?
                                        <div>
                                            {this.labelTemplate('Длина входной части канала, м', this.sizeOfInputChannelPart.toFixed(3))}
                                            {this.labelTemplate('Длина выходной части канала, м', this.sizeOfOutputChannelPart.toFixed(3))}
                                            {this.labelTemplate('Длина расширенной части канала, м', this.lengthOfIncreaseChannelPart.toFixed(3))}
                                            {this.labelTemplate('Общая длина камеры решетки, м', commonLengthOfChamberGrate.toFixed(3))}
                                        </div> :
                                        null
                                }
                                {
                                    amountOfWaste ? 
                                        this.labelTemplate('Количество отходов в час', amountOfWaste) :
                                        null
                                }
                            </div> :
                            null
                        }
                    </div> :
                    null
            }
            {
                validateErrors.length > 0 ?
                    this.renderValidateErrors() :
                    null
            }
        </div>;
    }

    private renderThirdTypeOfGrate = () => {
        const {checkGrateCrusherError} = this.state;
        return <div>
            {this.renderCommonInputData()}
            {
                this.selectAndInputTemplate('Толщина стержней решетки, м',
                    <select className={'grate-input-value'} onChange={event => this.selectGrateCrusher(event)}>
                        {grateCrushers.map((grateCrusher, index) => {
                            return <option key={index} value={grateCrusher.mark}>{grateCrusher.mark}</option>
                        })}
                    </select>)
            }
            {
                checkGrateCrusherError ? 
                    <OutputError errorMessage={'Проверка прошла неудачно - данный тип решетки-дробилки ' +
                        'не подходит, либо скорость близка к нужному значению, ' +
                        'но таковой не является.'} /> :
                    null
            }
            {
                this.checkGrateCrusherSpeed ? 
                    <div>
                        {this.labelTemplate('Количество решеток дробилок необходимых для очистки, шт',
                            this.amountGrateOfCrushers)}
                        {this.labelTemplate('Проверка дробилки, скорость должна входить в диапазон [1 - 1.2], м/с',
                            this.checkGrateCrusherSpeed)}
                    </div> :
                    null
            }
        </div>;
    }

    private renderValidateErrors = () => {
        const {validateErrors} = this.state;
        return <div className={'grate-input-group'}>
            {validateErrors.map(error => <div className={'grate-input-title'}>{error}</div>)}
        </div>;
    }

    private labelTemplate = (title: string, value: string | number) => {
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

    private selectAndInputTemplate = (title: string, template: JSX.Element) => {
        return <InputGroup className={'grate-input-group'}>
            <InputGroup.Prepend>
                <InputGroup.Text className={'grate-input-title'}>
                    {title}
                </InputGroup.Text>
            </InputGroup.Prepend>
            {template}
        </InputGroup>;
    }

    private clearDataToDefault = () => {
        this.defaultLocalSettings();
        this.defaultStateSettings();
    }

    render() {
        const {grateTypeOne, grateTypeTwo, grateTypeThree} = this.state;
        return (
            <div>
                <Nav fill variant={'tabs'} defaultActiveKey={'/'}>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate1'} 
                            onClick={() => {
                                this.clearDataToDefault();
                                this.setState({
                                    grateTypeOne: true,
                                    grateTypeTwo: false,
                                    grateTypeThree: false});
                            }}>
                            Решетки с механизированной очисткой
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate2'}
                            onClick={() => {
                                this.clearDataToDefault();
                                this.setState({
                                    grateTypeOne: false,
                                    grateTypeTwo: true,
                                    grateTypeThree: false});
                            }}>
                            Решетки с ручной очисткой
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate3'}
                            onClick={() => {
                                this.clearDataToDefault();
                                this.setState({
                                    grateTypeOne: false,
                                    grateTypeTwo: false,
                                    grateTypeThree: true});
                            }}>
                            Решетки-дробилки
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {
                    grateTypeOne ? this.renderFirstTypeOfGrate() : null
                }
                {
                    grateTypeTwo ? this.renderSecondTypeOfGrate() : null
                }
                {
                    grateTypeThree ? this.renderThirdTypeOfGrate() : null
                }
            </div>
        );
    }
}

function checkAllInputForCounting(checkObject: CheckObject): JSX.Element[] {
    const allError = [];
    if (!checkObject.maxSecondFlow) {
        allError.push(<Alert variant={'danger'}>Максимальный секундный расход, не введен</Alert>);
    }
    if (!checkObject.speedOfWaterInChannel) {
        allError.push(<Alert variant={'danger'}>Скрость течения воды в канале, не введенa</Alert>);
    }
    if (checkObject.speedOfWaterInChannel < _.SPEED_WATER_IN_CHANNEL_MIN ||
        checkObject.speedOfWaterInChannel >_.SPEED_WATER_IN_CHANNEL_MAX) {
        allError.push(<Alert variant={'danger'}>Скрость течения воды в канале, введенa не верно, выход за рамки диапазона</Alert>);
    }
    if (!checkObject.speedOfWaterInSection) {
        allError.push(<Alert variant={'danger'}>Скорость движения воды в прозорах решетки, не введенa</Alert>);
    }
    if (checkObject.speedOfWaterInSection < _.SPEED_WATER_IN_SECTION_MIN ||
        checkObject.speedOfWaterInSection > _.SPEED_WATER_IN_SECTION_MAX) {
        allError.push(<Alert variant={'danger'}>Скорость движения воды в прозорах решетки, введенa не верно, выход за рамки диапазона</Alert>);
    }
    if (!checkObject.inclineAngle) {
        allError.push(<Alert variant={'danger'}>Угол наклона решетки к горизонту, не введен</Alert>);
    }
    if (checkObject.inclineAngle < _.INCLINE_ANGLE_MIN || checkObject.inclineAngle > _.INCLINE_ANGLE_MAX) {
        allError.push(<Alert variant={'danger'}>Угол наклона решетки к горизонту, введен не верно, выход за рамки диапазона</Alert>);
    }
    if (checkObject.grateTypeOne) {
        if (!checkObject.flowRestrictionRake) {
            allError.push(<Alert variant={'danger'}>
                Коэффициент, учитывающий стеснение потока механическими граблями, диапазон, не введен
            </Alert>);
        }
        if (checkObject.flowRestrictionRake < _.FLOW_RESTRICTION_RAKE_MIN || checkObject.flowRestrictionRake > _.FLOW_RESTRICTION_RAKE_MAX) {
            allError.push(<Alert variant={'danger'}>
                Коэффициент, учитывающий стеснение потока механическими граблями, диапазон, введен не верно, выход за рамки диапазона
            </Alert>);
        }
    }
    return allError;
};