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
    InputTemplate,
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
    dailyFlow: number;
}

export class GrateComponent extends React.Component<Props, State> {
    // Инициализация всех использемых локальных переменных
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
    private sizeOfInputChannelPart: number = undefined;
    private sizeOfOutputChannelPart: number = undefined;
    private lengthOfIncreaseChannelPart: number = undefined;
    private checkGrateCrusherSpeed: number = undefined;
    private amountGrateOfCrushers: number = undefined;
    private limitedStandardWidthOfChannel: number[] = [];
    private checkSpeedOfWater: number = undefined;

    // Инициализация всех использемых переменных в state
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
            dailyFlow: undefined,
        }
    }

    // Инициализация всех использемых локальных переменных в состояние по умолчанию
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
        this.sizeOfInputChannelPart = undefined;
        this.sizeOfOutputChannelPart = undefined;
        this.lengthOfIncreaseChannelPart = undefined;
        this.checkGrateCrusherSpeed = undefined;
        this.amountGrateOfCrushers = undefined;
        this.limitedStandardWidthOfChannel = [];
        this.checkSpeedOfWater = undefined;
    }

    // Инициализация всех использемых переменных в state в состояние по умолчанию
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

    // Проверка входных данных для их последующей валидации
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

    // Динамический расчет количества загрязнений и количества молотковых дробилок
    private inputAmountOfWasteWater = (value: string) => {
        const {sourceOfWasteWater, dailyFlow} = this.state;
        // amountOfWasteWater - переменная используемая как для производства так и для городских стоков
        // определяет либо количество отбросов, либо норму водоотведения
        const amountOfWasteWater = parseFloat(value);
        let amountOfWaste;
        if (sourceOfWasteWater === SourceOfWasteWater.manufacture) {
            amountOfWaste = _.WOTB_MANUFACTURE * amountOfWasteWater * _.K /
                _.HOURS_IN_DAY;
        } else {
            const amountOfDwellers = _.TRANSFORM_LITER_TO_VOLUME_METER * dailyFlow / amountOfWasteWater;
            amountOfWaste = _.QOTB * amountOfDwellers / _.WOTB_CITY;
        }
        let amountOfHammerCrushers = (amountOfWaste / this.currentHammerCrusher.performance) > 1 ?
            Math.ceil(amountOfWaste / this.currentHammerCrusher.performance) :
            1;
        if(amountOfWaste === 0) {
            amountOfHammerCrushers = 0;
        }
        this.setState({amountOfWaste, amountOfHammerCrushers});
    }

    // Выбор решеток дробилок из списка
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

    // Выбор ширины прозоров
    private selectWidthSection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!checkIsNumber(event.target.value)) {
            return;
        }
        this.currentWidthSection = parseFloat(event.target.value);
        const listOfRodThickness = getUniqueRodThickness(this.currentWidthSection);
        this.currentRodThickness = listOfRodThickness[0];
        this.setState({listOfRodThickness});
    }

    // Основной расчет по нажатию на кнопку Подобрать марку решетки,
    // производит расчет и делает выбор всех удовлетворяемых решеток. 
    // Возможны ситуации когда для заданных параметров нет удовлетворительных
    // решеток, тогда нужно менять какие-либо параметры.
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
        this.suitableGrates = this.suitableGrates.filter(grate => this.checkWaterSpeedCounting(grate, amountOfSuitableGrates));
        if (this.suitableGrates.length === 0) {
            this.setState({amountOfSuitableGrates, validateErrors: [], checkWaterError: true});
            return;
        }
        this.currentSuitableGrate = this.suitableGrates[0];
        this.limitedStandardWidthOfChannel = _.STANDARD_WIDTH_OF_CHANNEL.filter(
            width => width < this.currentSuitableGrate.size.width * amountOfSuitableGrates);
        this.countingLedgeInstallationPlace();
        this.setState({amountOfSuitableGrates, validateErrors: [], checkWaterError: false});
    }

    // Выбор и переасчет текущих удовлетворяемых решеток
    private selectFromSuitableGrate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {amountOfSuitableGrates} = this.state;
        const currentGrateMark = event.target.value;
        this.currentSuitableGrate = this.suitableGrates.find(grate => grate.mark === currentGrateMark);
        this.checkWaterSpeedCounting(this.currentSuitableGrate);
        this.limitedStandardWidthOfChannel = _.STANDARD_WIDTH_OF_CHANNEL.filter(
            width => width < this.currentSuitableGrate.size.width * amountOfSuitableGrates);
        this.countingLedgeInstallationPlace();
    }

    // Проверка решеток на удовлетворяемость всем заданным требованиям
    private checkWaterSpeedCounting = (currentSuitableGrate: Grate, amountOfSuitableGratesAfterCount?: number): boolean => {
        const {amountOfSuitableGrates, grateTypeTwo, grateTypeOne, maxSecondFlow, currentTypeOfGrates} = this.state;
        const amountOfSuitableGratesReal = (amountOfSuitableGrates && amountOfSuitableGratesAfterCount) ?
            amountOfSuitableGratesAfterCount : (amountOfSuitableGrates && !amountOfSuitableGratesAfterCount) ?
            amountOfSuitableGrates : !amountOfSuitableGrates && amountOfSuitableGratesAfterCount ?
            amountOfSuitableGratesAfterCount : undefined;
        if (grateTypeOne) {
            this.checkSpeedOfWater = (this.flowRestrictionRake * maxSecondFlow) /
                (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
                currentSuitableGrate.numberOfSection * this.currentWidthSection *
                amountOfSuitableGratesReal);
        }
        if (grateTypeTwo) {
            this.checkSpeedOfWater = (_.FLOW_RESTRICTION_RAKE * maxSecondFlow) /
                (Math.sqrt(maxSecondFlow / this.speedOfWaterInChannel) *
                this.currentSuitableGrate.numberOfSection * this.currentWidthSection *
                amountOfSuitableGratesReal);
        }
        if (_.MIN_CHECK_SPEED_WATER >= this.checkSpeedOfWater || _.MAX_CHECK_SPEED_WATER <= this.checkSpeedOfWater) {
            return false;
        }
        return true;
    };

    // Расчет величины уступа в месте установки решетки
    private countingLedgeInstallationPlace = () => {
        const {currentTypeOfGrates} = this.state;
        const dzeta = this.formOfRod * Math.sin(transferRadiansToDegrees(this.inclineAngle)) *
            Math.pow(this.currentRodThickness / this.currentWidthSection, (4 / 3));
        const valueOfLedgeInstallationPlace = dzeta * Math.pow(this.checkSpeedOfWater, 2) / (2 * _.G) * _.P;
        this.countingLengths(this.limitedStandardWidthOfChannel[0], currentTypeOfGrates);
        this.setState({valueOfLedgeInstallationPlace});
    }

    // Выбор стандартной ширины канала подводящего воду к решеткам
    private selectStandardWidthOfChannel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {currentTypeOfGrates} = this.state;
        if (!checkIsNumber(event.target.value)) {
            return;
        }
        const standardWidthChannel = parseFloat(event.target.value);
        this.countingLengths(standardWidthChannel, currentTypeOfGrates);
    }

    // Выбор типа решетки
    private selectTypeOfGrate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {currentStandardWidthOfChannel,} = this.state;
        const typeOfGrate = parseFloat(event.target.value);
        this.countingLengths(currentStandardWidthOfChannel, typeOfGrate);
    }

    // Расчет все длин 
    private countingLengths = (currentStandardWidthOfChannel: number, typeOfGrate: number) => {
        const {maxSecondFlow} = this.state;
        this.sizeOfInputChannelPart = (this.currentSuitableGrate.size.width - currentStandardWidthOfChannel) /
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

    // Выбор решеток дробилок из списка
    private selectGrateCrusher = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {maxSecondFlow} = this.state;
        const markOfGrateCrusher = event.target.value;
        const currentGrateCrusher = grateCrushers.find(grateCrusher => grateCrusher.mark === markOfGrateCrusher);
        this.countingGrateCrusher(maxSecondFlow, currentGrateCrusher);
        this.setState({currentGrateCrusher});
    }

    // Расчет решеток дробилок
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

    // Ввод максимального секундного расхода
    private inputMaxSecondFlow = (value: string) => {
        const {grateTypeThree, currentGrateCrusher} = this.state;
        const maxSecondFlow = parseFloat(value);
        if (grateTypeThree) {
            this.countingGrateCrusher(maxSecondFlow, currentGrateCrusher);
            this.setState({maxSecondFlow});
        } else {
            this.setState({maxSecondFlow});
        }
    }

    // Ввод суточного расхода сточной воды
    private inputDailyFlow = (value: string) => {
        const dailyFlow = parseFloat(value);
        let amountOfHammerCrushers;
        if (dailyFlow === 0) {
            amountOfHammerCrushers = 0;
        }
        this.setState({dailyFlow, amountOfHammerCrushers});
    }

    // Отрисовка ввода максимального секундного расхода
    private renderCommonInputData = () => {
        return <InputTemplate title={'Максимальный секундный расход, м3/с'}
            placeholder={'Введите значение qmax...'} onChange={this.inputMaxSecondFlow} />;
    }

    // Отрисовка ввода максимального секундного расхода
    private renderDailyFlow = () => {
        return <InputTemplate title={'Суточный расход сточных вод, м3/сут'}
            placeholder={'Введите значение Q...'} onChange={this.inputDailyFlow} />;
    }

    // Отрисовка общих данных для первого и второго расчета
    private renderCommonFirstAndSecondInputData = () => {
        return <div>
            <InputTemplate title={'Скрость течения воды в канале, м/с, диапазон [0.6 - 0.8]'}
                placeholder={'Введите значение Vk...'} onChange={(value) => {this.speedOfWaterInChannel = parseFloat(value)}} />
            <InputTemplate title={'Скорость движения воды в прозорах решетки, м/с, диапазон [0.8 - 1]'}
                placeholder={'Введите значение Vp...'} onChange={(value) => {this.speedOfWaterInSection = parseFloat(value)}} />
            {selectTemplate('Выбор формы стержней',
                <select className={'grate-input-value'}
                    onChange={(event) => this.formOfRod = parseFloat(event.target.value)}>
                    <option value={FormOfRods.prizma}>Прямоугольная форма</option>
                    <option value={FormOfRods.prizmaWithCircleEdge}>Прямоугольная форма с закругленной лобовой частью</option>
                    <option value={FormOfRods.circle}>Круглая форма</option>
                </select>)}
            <InputTemplate title={'Угол наклона решетки к горизонту, диапазон [60 - 70]'}
                placeholder={'Введите значение α...'} onChange={(value) => {this.inclineAngle = parseFloat(value)}} />
        </div>;
    }

    // Отрисовка кнопки расчета
    private renderCountingButton = () => {
        return <Button variant={'outline-primary'} className={'grate-counting-btn'}
            onClick={() => this.grateCounting()}>
            Подобрать марку решеток
        </Button>
    }

    // Отрисовка кнопки очистки
    private resetData = () => {
        return <Button variant={'outline-danger'} className={'grate-counting-btn'}
            onClick={() => this.clearDataToDefault()}>
            Очистить входные данные
        </Button>
    }

    // Отрисовка выбора источника грязной воды
    private renderSourceOfWasteWater = () => {
        const {sourceOfWasteWater} = this.state;
        return <div>
            {selectTemplate('Источник сточных вод',
                <select className={'grate-input-value'}
                    onChange={(event) => {
                        this.setState({sourceOfWasteWater: parseFloat(event.target.value),
                            amountOfWaste: 0, dailyFlow: 0, amountOfHammerCrushers: 0});
                    }}>
                    <option value={SourceOfWasteWater.manufacture}>Производсвенный сток</option>
                    <option value={SourceOfWasteWater.city}>Городской сток</option>
                </select>)}
            {sourceOfWasteWater === SourceOfWasteWater.city ? 
                this.renderDailyFlow() :
                <InputTemplate title={'Количество образующихся отбросов, м3/сут'} placeholder={'Введите значение Wотб...'}
                    onChange={this.inputAmountOfWasteWater} />}
        </div>;
    }

    // Отрисовка вывода общих результатов первого и второго расчетов
    private commonResultFirstAndSecondCounting = () => {
        const {
            amountOfSuitableGrates,
            valueOfLedgeInstallationPlace,
            amountOfWaste,
            commonLengthOfChamberGrate
        } = this.state;
        return (
            amountOfSuitableGrates > 0 ?
            <div>
                {labelTemplate('Количество рабочих решеток, шт', amountOfSuitableGrates)}
                {labelTemplate('Количество резервных решеток, шт',
                    amountOfSuitableGrates > _.BASE_AMOUNT_OF_GRATES ? _.ADDITIONAL_AMOUNT_OF_GRATES : 1)}
                {selectTemplate('Выбор решетки',
                    <select className={'grate-input-value'} onChange={(event) => {this.selectFromSuitableGrate(event)}}>
                        {this.suitableGrates.map((item, index) => {
                            return <option key={index} value={item.mark}>{item.mark}</option>
                        })}
                    </select>)}
                {valueOfLedgeInstallationPlace ?
                    <div>
                        {labelTemplate('Величина уступа в месте установки решетки, м', valueOfLedgeInstallationPlace.toFixed(3))}
                        {labelTemplate('Количество технической воды, подводимой к дробилками, м3/ч',
                            (_.TECHNICAL_WATER * valueOfLedgeInstallationPlace).toFixed(3))}
                        {selectTemplate('Выбор стандартной ширины канала, м',
                            <select className={'grate-input-value'} onChange={(event) => this.selectStandardWidthOfChannel(event)}>
                                {this.limitedStandardWidthOfChannel.map((width, index) => {
                                    return <option key={index} value={width}>{width}</option>
                                })}
                            </select>)}
                        {selectTemplate('Выбор типа решетки',
                            <select className={'grate-input-value'} onChange={(event) => {this.selectTypeOfGrate(event)}}>
                                <option value={'vertical'}>Вертикальные решетки</option>
                                <option value={'incline'}>Наклонные решетки</option>
                            </select>)}
                        {commonLengthOfChamberGrate ?
                                <div>
                                    {labelTemplate('Длина входной части канала, м', this.sizeOfInputChannelPart.toFixed(3))}
                                    {labelTemplate('Длина выходной части канала, м', this.sizeOfOutputChannelPart.toFixed(3))}
                                    {labelTemplate('Длина расширенной части канала, м', this.lengthOfIncreaseChannelPart.toFixed(3))}
                                    {labelTemplate('Общая длина камеры решетки, м', commonLengthOfChamberGrate.toFixed(3))}
                                </div> : null}
                        {amountOfWaste ? labelTemplate('Количество отходов, кг/ч', amountOfWaste) : null}
                    </div> :
                    null
                }
            </div> : null
        );
    }

    // Отрисовка первого расчета
    private renderFirstTypeOfGrate = () => {
        const {
            validateErrors,
            listOfRodThickness,
            amountOfHammerCrushers,
            dailyFlow,
            checkWaterError,
        } = this.state;
        return <div>
            {this.renderCommonInputData()}
            {this.renderSourceOfWasteWater()}
            {dailyFlow ? <InputTemplate title={'Норма водоотведения, л/(чел*сут)'} placeholder={'Введите значение a...'} onChange={this.inputAmountOfWasteWater} /> : null}
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
            {validateErrors.length > 0 ? this.renderValidateErrors() : null}
        </div>;
    }

    // Отрисовка второго расчета
    private renderSecondTypeOfGrate = () => {
        const {
            listOfRodThickness,
            validateErrors,
            dailyFlow,
            checkWaterError,
        } = this.state;
        this.currentWidthSection = _.FIXED_WIDTH_SECTION;
        return <div>
            {this.renderCommonInputData()}
            {this.renderSourceOfWasteWater()}
            {dailyFlow ? <InputTemplate title={'Норма водоотведения, л/(чел*сут)'} placeholder={'Введите значение a...'} onChange={this.inputAmountOfWasteWater} /> : null}
            {this.renderCommonFirstAndSecondInputData()}
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
            {validateErrors.length > 0 ? this.renderValidateErrors() : null}
        </div>;
    }

    // Отрисовка третьего расчета
    private renderThirdTypeOfGrate = () => {
        const {checkGrateCrusherError} = this.state;
        return <div>
            {this.renderCommonInputData()}
            {selectTemplate('Толщина стержней решетки, м',
                <select className={'grate-input-value'} onChange={event => this.selectGrateCrusher(event)}>
                    {grateCrushers.map((grateCrusher, index) => {
                        return <option key={index} value={grateCrusher.mark}>{grateCrusher.mark}</option>
                    })}
                </select>)}
            {checkGrateCrusherError ? 
                <OutputError errorMessage={'Проверка прошла неудачно - данный тип решетки-дробилки ' +
                    'не подходит, либо скорость близка к нужному значению, ' +
                    'но таковой не является.'} /> : null}
            {this.checkGrateCrusherSpeed ? 
                <div>
                    {labelTemplate('Количество решеток дробилок необходимых для очистки, шт', this.amountGrateOfCrushers)}
                    {labelTemplate('Проверка дробилки, скорость должна входить в диапазон [1 - 1.2], м/с', this.checkGrateCrusherSpeed)}
                </div> : null}
            {this.resetData()}
        </div>;
    }

    // Отрисовка ошибок валидации
    private renderValidateErrors = () => {
        const {validateErrors} = this.state;
        return <div className={'grate-input-group'}>
            {validateErrors.map(error => <div className={'grate-input-title'}>{error}</div>)}
        </div>;
    }

    // Автоматическая очистка полей при переключении
    private clearDataToDefault = () => {
        this.defaultLocalSettings();
        this.defaultStateSettings();
    }

    // Гланая функция компонента которая запускает все
    render() {
        const {grateTypeOne, grateTypeTwo, grateTypeThree} = this.state;
        return (
            <div>
                <Nav fill variant={'tabs'} defaultActiveKey={'/'}>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate1'} 
                            onClick={() => {
                                this.clearDataToDefault();
                                this.setState({grateTypeOne: true,
                                    grateTypeTwo: false, grateTypeThree: false});
                            }}>
                            Решетки с механизированной очисткой
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate2'}
                            onClick={() => {
                                this.clearDataToDefault();
                                this.setState({grateTypeOne: false,
                                    grateTypeTwo: true, grateTypeThree: false});
                            }}>
                            Решетки с ручной очисткой
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'grate3'}
                            onClick={() => {
                                this.clearDataToDefault();
                                this.setState({grateTypeOne: false,
                                    grateTypeTwo: false, grateTypeThree: true});
                            }}>
                            Решетки-дробилки
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {grateTypeOne ? this.renderFirstTypeOfGrate() : null}
                {grateTypeTwo ? this.renderSecondTypeOfGrate() : null}
                {grateTypeThree ? this.renderThirdTypeOfGrate() : null}
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

function selectTemplate (title: string, template: JSX.Element) {
    return <InputGroup className={'grate-input-group'}>
        <InputGroup.Prepend>
            <InputGroup.Text className={'grate-input-title'}>
                {title}
            </InputGroup.Text>
        </InputGroup.Prepend>
        {template}
    </InputGroup>;
}

function labelTemplate (title: string, value: string | number) {
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