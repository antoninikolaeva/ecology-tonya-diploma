import * as React from 'react';
import { Nav, InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';

import {
    getUniqueWidthSection,
    getUniqueRodThickness,
    onlySecondConst,
    checkIsNumber,
    commonConst,
    transferRadiansToDegrees,
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
            currentStandardWidthOfChannel: onlySecondConst.standardWidthsOfChannel[0],
            commonLengthOfChamberGrate: undefined,
            maxSecondFlow: undefined,
            currentGrateCrusher: grateCrushers[0],
            validateErrors: []
        }
    }

    componentDidMount() {
    }

    private inputAmountOfWasteWater = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {sourceOfWasteWater} = this.state;
        if(!checkIsNumber(event.target.value)) {
           return; // to do Error notification 
        }
        const amountOfWasteWater = parseFloat(event.target.value);
        let amountOfWaste
        if (sourceOfWasteWater === SourceOfWasteWater.manufacture) {
            amountOfWaste = commonConst.manufacture * amountOfWasteWater * commonConst.k /
                commonConst.hoursInDay;
        } else {
            amountOfWaste = commonConst.amountOfWasteFixed * amountOfWasteWater / commonConst.city;
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

    private checkAllInputForCounting = (): any[] => {
        const {grateTypeOne, maxSecondFlow} = this.state;
        const allError = [];
        if (!maxSecondFlow) {
            allError.push(<Alert variant={'danger'}>Максимальный секундный расход, не введен</Alert>);
        }
        if (!this.speedOfWaterInChannel) {
            allError.push(<Alert variant={'danger'}>Скрость течения воды в канале, не введенa</Alert>);
        }
        if (this.speedOfWaterInChannel < 0.6 || this.speedOfWaterInChannel > 0.8) {
            allError.push(<Alert variant={'danger'}>Скрость течения воды в канале, введенa не верно, выход за рамки диапазона</Alert>);
        }
        if (!this.speedOfWaterInSection) {
            allError.push(<Alert variant={'danger'}>Скорость движения воды в прозорах решетки, не введенa</Alert>);
        }
        if (this.speedOfWaterInSection < 0.8 || this.speedOfWaterInSection > 1) {
            allError.push(<Alert variant={'danger'}>Скорость движения воды в прозорах решетки, введенa не верно, выход за рамки диапазона</Alert>);
        }
        if (!this.inclineAngle) {
            allError.push(<Alert variant={'danger'}>Угол наклона решетки к горизонту, не введен</Alert>);
        }
        if (this.inclineAngle < 60 || this.inclineAngle > 70) {
            allError.push(<Alert variant={'danger'}>Угол наклона решетки к горизонту, введен не верно, выход за рамки диапазона</Alert>);
        }
        if (grateTypeOne) {
            if (!this.flowRestrictionRake) {
                allError.push(<Alert variant={'danger'}>
                    Коэффициент, учитывающий стеснение потока механическими граблями, диапазон, не введен
                </Alert>);
            }
            if (this.flowRestrictionRake < 1.05 || this.flowRestrictionRake > 1.1) {
                allError.push(<Alert variant={'danger'}>
                    Коэффициент, учитывающий стеснение потока механическими граблями, диапазон, введен не верно, выход за рамки диапазона
                </Alert>);
            }
        }
        return allError;
    }

    private grateCounting = () => {
        const {grateTypeOne, grateTypeTwo, maxSecondFlow} = this.state;
        const errors = this.checkAllInputForCounting();
        if(errors.length > 0 ) {
            this.setState({validateErrors: errors});
            return;
        }
        // to do check to number value > 0
        let n;
        if (grateTypeOne) {
            n = (this.flowRestrictionRake * maxSecondFlow) /
            (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
            this.speedOfWaterInSection * this.currentWidthSection);
        }
        if (grateTypeTwo) {
            n = (1 * maxSecondFlow) /
            (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
            this.speedOfWaterInSection * this.currentWidthSection);
        }
        const bp =  this.currentRodThickness * (n - 1) + this.currentWidthSection * n;

        let amountOfSuitableGrates = 1;
        this.suitableGrates = [];
        while (amountOfSuitableGrates > 0) {
            this.suitableGrates = grates.filter(grate => {
                const isSuitableGrate = bp <= (amountOfSuitableGrates * grate.size.width) &&
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
            this.amountOfSectionInEachGrate = n / amountOfSuitableGrates;
            this.widthOfGrateCounted = bp / amountOfSuitableGrates;
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
        let checkVp;
        if (grateTypeOne) {
            checkVp = (this.flowRestrictionRake * maxSecondFlow) /
                (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
                currentSuitableGrate.numberOfSection * this.currentWidthSection *
                amountOfSuitableGratesReal);
        }
        if (grateTypeTwo) {
            checkVp = (1 * maxSecondFlow) /
                (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
                this.amountOfSectionInEachGrate * this.currentWidthSection *
                amountOfSuitableGratesReal);
        }
        if (!(checkVp >= 0.8) && !(checkVp <= 1)) {
            alert('К сожалению, выбранная марка решетки не подходит для заданных параметров.' +
             'Пожалуйста, выберите другую марку решетки или иные' +
             'входные данные (ширину прозоров и/или толщину стержней).');
        }
        const dzeta = this.formOfRod * Math.sin(transferRadiansToDegrees(this.inclineAngle)) *
            Math.pow(this.currentRodThickness / this.currentWidthSection, (4 / 3));
        const valueOfLedgeInstallationPlace = dzeta * Math.pow(checkVp, 2) / (2 * commonConst.g) * commonConst.p;
        this.setState({valueOfLedgeInstallationPlace});
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
            (2 * transferRadiansToDegrees(commonConst.pfi));
        this.sizeOfOutputChannelPart = 0.5 * this.sizeOfInputChannelPart;
        if (typeOfGrate === TypeOfGrates.vertical) {
            this.lengthOfIncreaseChannelPart = 1.8 * currentStandardWidthOfChannel;
        } else {
            this.lengthOfIncreaseChannelPart = (1.8 * currentStandardWidthOfChannel) +
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
        let N = 1; // amount of grateCrusher
        while (1) {
            if ((N * currentGrateCrusher.maxPerformance) > maxSecondFlow) {
                break;
            }
            N++;
        }
        const v = maxSecondFlow / (N * currentGrateCrusher.squareHeliumHole);
        if (v > currentGrateCrusher.speedOfMoveInSectionMin && v < currentGrateCrusher.speedOfMoveInSectionMax) {
            this.checkGrateCrusherSpeed = parseFloat(v.toFixed(3));
            this.amountGrateOfCrushers = N;
        } else {
            this.checkGrateCrusherSpeed = parseFloat(v.toFixed(3));
            this.amountGrateOfCrushers = N;
            alert('Проверка прошла неудачно - данный тип решетки-дробилки ' +
                'не подходит, либо скорость близка к нужному значению, ' +
                'но таковой не является');
        }
    }

    private renderCommonInputData = () => {
        return (
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        Максимальный секундный расход, м3/с
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <input className={'grate-input-value'}
                    type={'text'}
                    placeholder={'Введите значение qmax...'}
                    onChange={(event) => {
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
                    }}/>
            </InputGroup>
        ); 
    }

    private renderCommonFirstAndSecondInputData = () => {
        return <div>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        Скрость течения воды в канале, м/с, диапазон [0.6 - 0.8]
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <input className={'grate-input-value'}
                type={'text'}
                placeholder={'Введите значение Vk...'}
                onChange={(event) => {
                    if (!checkIsNumber(event.target.value)) {
                        return;
                    }
                    this.speedOfWaterInChannel = parseFloat(event.target.value);
                }}/>
            </InputGroup>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        Скорость движения воды в прозорах решетки, м/с, диапазон [0.8 - 1]
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <input className={'grate-input-value'}
                type={'text'}
                placeholder={'Введите значение Vp...'}
                onChange={(event) => {
                    if (!checkIsNumber(event.target.value)) {
                        return;
                    }
                    this.speedOfWaterInSection = parseFloat(event.target.value);
                }}/>
            </InputGroup>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Выбор формы стержней'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => this.formOfRod = parseFloat(event.target.value)}>
                    <option value={2.42}>Прямоугольная форма</option>
                    <option value={1.83}>Прямоугольная форма с закругленной лобовой частью</option>
                    <option value={1.79}>Круглая форма</option>
                </select>
            </InputGroup>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        Угол наклона решетки к горизонту, диапазон [60 - 70]
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <input className={'grate-input-value'}
                type={'text'}
                placeholder={'Введите значение α...'}
                onChange={(event) => {
                    if (!checkIsNumber(event.target.value)) {
                        return;
                    }
                    this.inclineAngle = parseFloat(event.target.value);
                }}/>
            </InputGroup>
        </div>;
    }

    private renderCountingButton = () => {
        return <Button variant={'outline-primary'}
            className={'grate-counting-btn'}
            onClick={() => this.grateCounting()}>
            Подобрать марку решеток
        </Button>
    }

    private renderFirstTypeOfGrate = () => {
        const {
            sourceOfWasteWater,
            validateErrors,
            listOfRodThickness,
            amountOfHammerCrushers,
            amountOfSuitableGrates,
            valueOfLedgeInstallationPlace
        } = this.state;
        return <div>
            {this.renderCommonInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Источник сточных вод'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => this.setState({sourceOfWasteWater: parseFloat(event.target.value)})}>
                    <option value={SourceOfWasteWater.manufacture}>Производсвенный сток</option>
                    <option value={SourceOfWasteWater.city}>Городской сток</option>
                </select>
            </InputGroup>
            {
                sourceOfWasteWater === SourceOfWasteWater.manufacture ?
                    <InputGroup className={'grate-input-group'}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className={'grate-input-title'}>
                                Количество образующихся отбросов, м3/сут
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <input className={'grate-input-value'}
                            type={'text'}
                            placeholder={'Введите значение Wотб...'}
                            onChange={(event) => this.inputAmountOfWasteWater(event)}/>
                    </InputGroup> :
                    <InputGroup className={'grate-input-group'}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className={'grate-input-title'}>
                                Приведенное население, чел
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <input className={'grate-input-value'}
                            type={'text'}
                            placeholder={'Введите значение Nпр...'}
                            onChange={(event) => this.inputAmountOfWasteWater(event)}/>
                    </InputGroup>
            }
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Выбор молотковых дробилок'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => {this.selectHammerCrusher(event)}}>
                    {hammerCrushers.map((crusher, index) => {
                        return <option key={index} value={crusher.performance}>
                            {crusher.mark}
                        </option>;
                    })}
                </select>
            </InputGroup>
            {
                amountOfHammerCrushers ?
                    this.labelTemplate('Количество молотковых дробилок необходимых для очистки, шт',
                        amountOfHammerCrushers) :
                    null
            }
            {this.renderCommonFirstAndSecondInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        Коэффициент, учитывающий стеснение потока механическими граблями, диапазон [1.05 - 1.1]
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <input className={'grate-input-value'}
                type={'text'}
                placeholder={'Введите значение Kst...'}
                onChange={(event) => {
                    if (!checkIsNumber(event.target.value)) {
                        return;
                    }
                    this.flowRestrictionRake = parseFloat(event.target.value);
                }}/>
            </InputGroup>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Ширина прозоров решетки, м'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => { this.selectWidthSection(event) }}>
                    {
                        this.listOfWidthSection.map((section, index) => {
                            return <option key={index}
                                value={section}>
                                {section}
                            </option>;
                        })
                    }
                </select>
            </InputGroup>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Толщина стержней решетки, м'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event => {this.currentRodThickness = parseFloat(event.target.value)})}>
                    {listOfRodThickness.map((rodThickness, index) => {
                        return <option key={index} value={rodThickness}>
                            {rodThickness}
                        </option>;
                    })}
                </select>
            </InputGroup>
            {this.renderCountingButton()}
            {
                amountOfSuitableGrates > 0 ?
                    <div>
                        {this.labelTemplate('Количество рабочих решеток, шт', amountOfSuitableGrates)}
                        {this.labelTemplate('Количество резервных решеток, шт', amountOfSuitableGrates > 3 ? 2 : 1)}
            
                        <InputGroup className={'grate-input-group'}>
                            <InputGroup.Prepend>
                                <InputGroup.Text className={'grate-input-title'}>{'Выбор решетки'}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <select className={'grate-input-value'}
                                onChange={(event) => {this.checkWaterSpeed(event)}}>
                                {
                                    this.suitableGrates.map((item, index) => {
                                        return <option key={index}>
                                            {item.mark}
                                        </option>
                                    })
                                }
                            </select>
                        </InputGroup>
                        {valueOfLedgeInstallationPlace ?
                            <div>
                                {this.labelTemplate('Величина уступа в месте установки решетки, м', valueOfLedgeInstallationPlace.toFixed(4))}
                                {this.labelTemplate('Количество технической воды, подводимой к дробилками, м3/ч',
                                    (commonConst.amountOfWasteWater * valueOfLedgeInstallationPlace).toFixed(4))}
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
            sourceOfWasteWater,
            amountOfWaste,
            listOfRodThickness,
            amountOfSuitableGrates,
            valueOfLedgeInstallationPlace,
            commonLengthOfChamberGrate,
            validateErrors
        } = this.state;
        this.currentWidthSection = 0.016;
        return <div>
            {this.renderCommonInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Источник сточных вод'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => this.setState({sourceOfWasteWater: parseFloat(event.target.value)})}>
                    <option value={SourceOfWasteWater.manufacture}>Производсвенный сток</option>
                    <option value={SourceOfWasteWater.city}>Городской сток</option>
                </select>
            </InputGroup>
            {
                sourceOfWasteWater === SourceOfWasteWater.city ?
                    <InputGroup className={'grate-input-group'}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className={'grate-input-title'}>
                                Приведенное население, чел
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <input className={'grate-input-value'}
                            type={'text'}
                            placeholder={'Введите значение Nпр...'}
                            onChange={(event) => this.inputAmountOfWasteWater(event)}/>
                    </InputGroup> :
                    <InputGroup className={'grate-input-group'}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className={'grate-input-title'}>
                                Количество образующихся отбросов, м3/сут
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <input className={'grate-input-value'}
                            type={'text'}
                            placeholder={'Введите значение Wотб...'}
                            onChange={(event) => this.inputAmountOfWasteWater(event)}/>
                    </InputGroup> 
            }
            {this.renderCommonFirstAndSecondInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Толщина стержней решетки, м'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event => {this.currentRodThickness = parseFloat(event.target.value)})}>
                    {listOfRodThickness.map((rodThickness, index) => {
                        return <option key={index} value={rodThickness}>
                            {rodThickness}
                        </option>;
                    })}
                </select>
            </InputGroup>
            {this.renderCountingButton()}
            {
                amountOfSuitableGrates > 0 ?
                    <div>
                        {this.labelTemplate('Количество рабочих решеток, шт', amountOfSuitableGrates)}
                        {this.labelTemplate('Количество резервных решеток, шт', amountOfSuitableGrates > 3 ? 2 : 1)}
            
                        <InputGroup className={'grate-input-group'}>
                            <InputGroup.Prepend>
                                <InputGroup.Text className={'grate-input-title'}>{'Выбор решетки'}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <select className={'grate-input-value'}
                                onChange={(event) => {this.checkWaterSpeed(event)}}>
                                {
                                    this.suitableGrates.map((item, index) => {
                                        return <option key={index}>
                                            {item.mark}
                                        </option>
                                    })
                                }
                            </select>
                        </InputGroup>
                        {valueOfLedgeInstallationPlace ?
                            <div>
                                {this.labelTemplate('Величина уступа в месте установки решетки, м', valueOfLedgeInstallationPlace.toFixed(4))}
                                <InputGroup className={'grate-input-group'}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className={'grate-input-title'}>{'Выбор стандартной ширины канала'}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <select className={'grate-input-value'}
                                        onChange={(event) => this.selectStandardWidthOfChannel(event)}>
                                        {onlySecondConst.standardWidthsOfChannel.map((width, index) => {
                                            return <option key={index} value={width}>{width}</option>
                                        })}
                                    </select>
                                </InputGroup>
                                <InputGroup className={'grate-input-group'}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className={'grate-input-title'}>{'Выбор типа решетки'}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <select className={'grate-input-value'}
                                        onChange={(event) => {this.selectTypeOfGrate(event)}}>
                                        <option value={'vertical'}>Вертикальные решетки</option>
                                        <option value={'incline'}>Наклонные решетки</option>
                                    </select>
                                </InputGroup>
                                {
                                    commonLengthOfChamberGrate ?
                                        <div>
                                            {this.labelTemplate('Длина входной части канала, м', this.sizeOfInputChannelPart.toFixed(4))}
                                            {this.labelTemplate('Длина выходной части канала, м', this.sizeOfOutputChannelPart.toFixed(4))}
                                            {this.labelTemplate('Длина расширенной части канала, м', this.lengthOfIncreaseChannelPart.toFixed(4))}
                                            {this.labelTemplate('Общая длина камеры решетки, м', commonLengthOfChamberGrate.toFixed(4))}
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
        return <div>
            {this.renderCommonInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Толщина стержней решетки, м'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={event => this.selectGrateCrusher(event)}>
                    {grateCrushers.map((grateCrusher, index) => {
                        return <option key={index} value={grateCrusher.mark}>{grateCrusher.mark}</option>
                    })}
                </select>
            </InputGroup>
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

    render() {
        const {grateTypeOne, grateTypeTwo, grateTypeThree} = this.state;
        return (
            <div>
                <Nav fill variant={'tabs'} defaultActiveKey={'/'}>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate1'} 
                            onClick={() => {this.setState({
                                grateTypeOne: true, grateTypeTwo: false, grateTypeThree: false,
                            })}}>
                            Решетки с механизированной очисткой
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate2'}
                            onClick={() => {this.setState({
                                grateTypeOne: false, grateTypeTwo: true, grateTypeThree: false,
                            })}}>
                            Решетки с ручной очисткой
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate3'}
                            onClick={() => {this.setState({
                                grateTypeOne: false, grateTypeTwo: false, grateTypeThree: true,
                            })}}>
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