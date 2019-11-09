import * as React from 'react';
import { Button } from 'react-bootstrap';

import { GRATE_CONST as _, getUniqueWidthSection, getUniqueRodThickness, transferRadiansToDegrees } from './grate.service';
import { SourceOfWasteWater, HammerCrusher, hammerCrushers, FormOfRods, grates, Grate, TypeOfGrates } from './grate-resources';
import { labelTemplate, InputTemplate, ItemList, SelectTemplate, NULLSTR } from '../utils';

interface GrateMechanicProps {
    secondMaxFlow: number;
    dailyWaterFlow: number;
    onCountMode(countMode: boolean): void;
}

interface GrateMechanicState {
    sourceOfWasteWater: SourceOfWasteWater;
    dailyWasteGenerated: number;
    amountOfWaste: number;
    amountOfHammerCrushers: number;
    normOfWaterOut: number;
    speedOfWaterInChannel: number;
    speedOfWaterInSection: number;
    formOfRod: number;
    inclineAngle: number;
    flowRestrictionRake: number;
    listOfRodThickness: number[];
    currentRodThickness: number;
    amountOfSuitableGrates: number;
    currentTypeOfGrates: TypeOfGrates;
    currentStandardWidthOfChannel: number;
    valueOfLedgeInstallationPlace: number;
    sizeOfInputChannelPart: number;
    sizeOfOutputChannelPart: number;
    lengthOfIncreaseChannelPart: number;
    commonLengthOfChamberGrate: number;
}

export class GrateMechanic extends React.Component<GrateMechanicProps, GrateMechanicState> {
    private dailyWasteGeneratedRef: HTMLInputElement = undefined;
    private normOfWaterOutRef: HTMLInputElement = undefined;
    private speedOfWaterInChannelRef: HTMLInputElement = undefined;
    private speedOfWaterInSectionRef: HTMLInputElement = undefined;
    private inclineAngleRef: HTMLInputElement = undefined;
    private flowRestrictionRakeRef: HTMLInputElement = undefined;
    private currentHammerCrusher: HammerCrusher = hammerCrushers[0];
    private listOfWidthSection: number[] = getUniqueWidthSection();
    private currentWidthSection: number = this.listOfWidthSection[0];
    private suitableGrates: Grate[] = [];
    private currentSuitableGrate: Grate = undefined;
    private limitedStandardWidthOfChannel: number[] = [];
    private checkSpeedOfWater: number = undefined;

    constructor(props: GrateMechanicProps) {
        super(props);
        this.state = {
            sourceOfWasteWater: SourceOfWasteWater.manufacture,
            dailyWasteGenerated: undefined,
            amountOfWaste: undefined,
            amountOfHammerCrushers: undefined,
            normOfWaterOut: undefined,
            speedOfWaterInChannel: undefined,
            speedOfWaterInSection: undefined,
            formOfRod: FormOfRods.prizma,
            inclineAngle: undefined,
            flowRestrictionRake: undefined,
            listOfRodThickness: getUniqueRodThickness(this.currentWidthSection),
            currentRodThickness: getUniqueRodThickness(this.currentWidthSection)[0],
            amountOfSuitableGrates: undefined,
            currentTypeOfGrates: TypeOfGrates.vertical,
            valueOfLedgeInstallationPlace: undefined,
            sizeOfInputChannelPart: undefined,
            sizeOfOutputChannelPart: undefined,
            lengthOfIncreaseChannelPart: undefined,
            commonLengthOfChamberGrate: undefined,
            currentStandardWidthOfChannel: undefined,
        };
    }

    private clearPage = () => {
        if(this.dailyWasteGeneratedRef) this.dailyWasteGeneratedRef.value = NULLSTR;
        if(this.normOfWaterOutRef) this.normOfWaterOutRef.value = NULLSTR;
        if(this.speedOfWaterInChannelRef) this.speedOfWaterInChannelRef.value = NULLSTR;
        if(this.speedOfWaterInSectionRef) this.speedOfWaterInSectionRef.value = NULLSTR;
        if(this.inclineAngleRef) this.inclineAngleRef.value = NULLSTR;
        if(this.flowRestrictionRakeRef) this.flowRestrictionRakeRef.value = NULLSTR;
        this.currentHammerCrusher = hammerCrushers[0];
        this.listOfWidthSection = getUniqueWidthSection();
        this.currentWidthSection = this.listOfWidthSection[0];
        this.suitableGrates = [];
        this.currentSuitableGrate = undefined;
        this.limitedStandardWidthOfChannel = [];
        this.checkSpeedOfWater = undefined;
        this.setState({
            sourceOfWasteWater: SourceOfWasteWater.manufacture,
            dailyWasteGenerated: undefined,
            amountOfWaste: undefined,
            amountOfHammerCrushers: undefined,
            normOfWaterOut: undefined,
            speedOfWaterInChannel: undefined,
            speedOfWaterInSection: undefined,
            formOfRod: FormOfRods.prizma,
            inclineAngle: undefined,
            flowRestrictionRake: undefined,
            listOfRodThickness: getUniqueRodThickness(this.currentWidthSection),
            currentRodThickness: getUniqueRodThickness(this.currentWidthSection)[0],
            amountOfSuitableGrates: undefined,
            currentTypeOfGrates: TypeOfGrates.vertical,
            valueOfLedgeInstallationPlace: undefined,
            sizeOfInputChannelPart: undefined,
            sizeOfOutputChannelPart: undefined,
            lengthOfIncreaseChannelPart: undefined,
            commonLengthOfChamberGrate: undefined,
            currentStandardWidthOfChannel: undefined,
        });
    }

    // Динамический расчет количества загрязнений и количества молотковых дробилок
    private amountOfWasteGenerated = (value: number) => {
        const {dailyWaterFlow} = this.props;
        const {sourceOfWasteWater} = this.state;
        // value - переменная используемая как для производства так и для городских стоков
        // определяет либо количество отбросов, либо норму водоотведения
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
        sourceOfWasteWater === SourceOfWasteWater.manufacture ?
            this.setState({amountOfWaste, amountOfHammerCrushers, dailyWasteGenerated: value}) :
            this.setState({amountOfWaste, amountOfHammerCrushers, normOfWaterOut: value})
    }

    // Основной расчет по нажатию на кнопку Подобрать марку решетки,
    // производит расчет и делает выбор всех удовлетворяемых решеток. 
    // Возможны ситуации когда для заданных параметров нет удовлетворительных
    // решеток, тогда нужно менять какие-либо параметры.
    private grateCounting = () => {
        const {secondMaxFlow} = this.props;
        const {flowRestrictionRake, speedOfWaterInChannel, speedOfWaterInSection, currentRodThickness} = this.state;
        const amountOfSection = (flowRestrictionRake * secondMaxFlow) /
            (Math.sqrt(secondMaxFlow / speedOfWaterInChannel) *
            speedOfWaterInSection * this.currentWidthSection);
        const commonWidthOfGrate =  currentRodThickness * (amountOfSection - 1) +
            this.currentWidthSection * amountOfSection;
        let amountOfSuitableGrates = 1;
        this.suitableGrates = [];
        while (amountOfSuitableGrates > 0) {
            this.suitableGrates = grates.filter(grate => {
                const isSuitableGrate = commonWidthOfGrate <= (amountOfSuitableGrates * grate.size.width) &&
                    grate.widthSection === this.currentWidthSection &&
                    grate.rodThickness ===  currentRodThickness;
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
            this.setState({amountOfSuitableGrates});
            return;
        }
        this.currentSuitableGrate = this.suitableGrates[0];
        this.limitedStandardWidthOfChannel = _.STANDARD_WIDTH_OF_CHANNEL.filter(
            width => width < this.currentSuitableGrate.size.width * amountOfSuitableGrates);
        this.countingLedgeInstallationPlace();
        this.setState({amountOfSuitableGrates});
    }

    // Проверка решеток на удовлетворяемость всем заданным требованиям
    private checkWaterSpeedCounting = (currentSuitableGrate: Grate, amountOfSuitableGratesAfterCount?: number): boolean => {
        const {secondMaxFlow} = this.props;
        const {amountOfSuitableGrates, flowRestrictionRake, speedOfWaterInChannel} = this.state;
        const amountOfSuitableGratesReal = (amountOfSuitableGrates && amountOfSuitableGratesAfterCount) ?
            amountOfSuitableGratesAfterCount : (amountOfSuitableGrates && !amountOfSuitableGratesAfterCount) ?
            amountOfSuitableGrates : !amountOfSuitableGrates && amountOfSuitableGratesAfterCount ?
            amountOfSuitableGratesAfterCount : undefined;
        this.checkSpeedOfWater = (flowRestrictionRake * secondMaxFlow) /
            (Math.sqrt(secondMaxFlow / speedOfWaterInChannel) *
            currentSuitableGrate.numberOfSection * this.currentWidthSection *
            amountOfSuitableGratesReal);
        if (_.MIN_CHECK_SPEED_WATER >= this.checkSpeedOfWater || _.MAX_CHECK_SPEED_WATER <= this.checkSpeedOfWater) {
            return false;
        }
        return true;
    };

    // Расчет величины уступа в месте установки решетки
    private countingLedgeInstallationPlace = () => {
        const {currentRodThickness, formOfRod, inclineAngle, currentTypeOfGrates} = this.state;
        const dzeta = formOfRod * Math.sin(transferRadiansToDegrees(inclineAngle)) *
            Math.pow(currentRodThickness / this.currentWidthSection, (4 / 3));
        const valueOfLedgeInstallationPlace = dzeta * Math.pow(this.checkSpeedOfWater, 2) / (2 * _.G) * _.P;
        this.countingLengths(this.limitedStandardWidthOfChannel[0], currentTypeOfGrates);
        this.setState({valueOfLedgeInstallationPlace});
    }

    // Расчет все длин 
    private countingLengths = (currentStandardWidthOfChannel: number, typeOfGrate: number) => {
        const {secondMaxFlow} = this.props;
        const {speedOfWaterInChannel, inclineAngle} = this.state;
        const sizeOfInputChannelPart = (this.currentSuitableGrate.size.width - currentStandardWidthOfChannel) /
            (2 * transferRadiansToDegrees(_.PFI));
        const sizeOfOutputChannelPart = 0.5 * sizeOfInputChannelPart;
        let lengthOfIncreaseChannelPart;
        if (typeOfGrate === TypeOfGrates.vertical) {
            lengthOfIncreaseChannelPart = _.CHANNEL_PORT * currentStandardWidthOfChannel;
        } else {
            lengthOfIncreaseChannelPart = (_.CHANNEL_PORT * currentStandardWidthOfChannel) +
                Math.sqrt(secondMaxFlow / speedOfWaterInChannel) /
                Math.tan(transferRadiansToDegrees(inclineAngle));
        }
        this.setState({commonLengthOfChamberGrate:
            sizeOfInputChannelPart + sizeOfOutputChannelPart + lengthOfIncreaseChannelPart,
            sizeOfInputChannelPart,
            sizeOfOutputChannelPart,
            lengthOfIncreaseChannelPart
        });
    }

    // Выбор источника сточных вод
    private selectSourceOfWasteWater = (value: string | number) => {
        if (this.dailyWasteGeneratedRef) this.dailyWasteGeneratedRef.value = '';
        if (this.normOfWaterOutRef) this.normOfWaterOutRef.value = '';
        if (typeof value === 'number') {
            this.setState({sourceOfWasteWater: value,
                amountOfWaste: 0, amountOfHammerCrushers: 0, dailyWasteGenerated: 0, normOfWaterOut: 0});
        }
    }

    // Выбор решеток дробилок из списка
    private selectHammerCrusher = (value: string | number) => {
        const {amountOfWaste} = this.state;
        if (typeof value === 'number') {
            const performanceOfCrusher = value;
            const amountOfHammerCrushers = (amountOfWaste / performanceOfCrusher) > 1 ?
                Math.ceil(amountOfWaste / performanceOfCrusher) :
                1;
            this.setState({amountOfHammerCrushers});
        }
    }

    // Выбор формы стержней решетки
    private selectFormOfRods = (value: string | number) => {
        if (typeof value === 'number') {
            this.setState({formOfRod: value});
        }
    }

    // Выбор ширины прозоров
    private selectWidthSection = (value: string | number) => {
        if (typeof value === 'number') {
            this.currentWidthSection = value;
            const listOfRodThickness = getUniqueRodThickness(this.currentWidthSection);
            this.setState({listOfRodThickness, currentRodThickness: listOfRodThickness[0]});
        }   
    }

    // Выбор толщины стержней решетки
    private selectCurrentRodThickness = (value: string | number) => {
        if (typeof value === 'number') {
            this.setState({currentRodThickness: value});
        }
    }

    // Выбор и перерасчет текущих удовлетворяемых решеток
    private selectFromSuitableGrate = (value: string | number) => {
        const {amountOfSuitableGrates} = this.state;
        this.currentSuitableGrate = this.suitableGrates.find((grate: Grate) => grate.mark === value);
        this.checkWaterSpeedCounting(this.currentSuitableGrate);
        this.limitedStandardWidthOfChannel = _.STANDARD_WIDTH_OF_CHANNEL.filter(
            width => width < this.currentSuitableGrate.size.width * amountOfSuitableGrates);
        this.countingLedgeInstallationPlace();
    }

    // Выбор стандартной ширины канала подводящего воду к решеткам
    private selectStandardWidthOfChannel = (value: string | number) => {
        const {currentTypeOfGrates} = this.state;
        if (typeof value === 'number') {
            this.countingLengths(value, currentTypeOfGrates);
            this.setState({currentStandardWidthOfChannel: value});
        }
    }

    // Выбор типа решетки
    private selectTypeOfGrate = (value: string | number) => {
        const {currentStandardWidthOfChannel} = this.state;
        if (typeof value === 'number') {
            this.countingLengths(currentStandardWidthOfChannel, value);
            this.setState({currentTypeOfGrates: value});
        }
    }

    // Отрисовка выбора источника грязной воды
    private renderSourceOfWasteWater = () => {
        const {dailyWaterFlow} = this.props;
        const {sourceOfWasteWater, amountOfHammerCrushers} = this.state;
        const selectSourceWaterList: ItemList[] = [
            {value: SourceOfWasteWater.manufacture, label: 'Производсвенный сток'},
            {value: SourceOfWasteWater.city, label: 'Городской сток'},
        ];
        const selectHammerCrusherList: ItemList[] = hammerCrushers.map(crusher => {
            return {value: crusher.performance, label: crusher.mark}
        });
        return <div>
            <SelectTemplate title={'Источник сточных вод'} itemList={selectSourceWaterList}
                onSelect={(value) => this.selectSourceOfWasteWater(value)}/>
            {labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
            {sourceOfWasteWater === SourceOfWasteWater.city ? 
                <InputTemplate title={'Норма водоотведения, л/(чел*сут)'}
                    placeholder={''}
                    onInputRef={(input) => {this.normOfWaterOutRef = input}}
                    onInput={(value) => {this.amountOfWasteGenerated(value)}}/> :
                <InputTemplate title={'Количество образующихся отбросов, м3/сут'}
                    placeholder={''}
                    onInputRef={(input) => {this.dailyWasteGeneratedRef = input}}
                    onInput={(value) => {this.amountOfWasteGenerated(value)}}/>}
            <SelectTemplate title={'Выбор молотковых дробилок'} itemList={selectHammerCrusherList}
                onSelect={(value) => this.selectHammerCrusher(value)}/>
            {amountOfHammerCrushers ?
                labelTemplate('Количество молотковых дробилок необходимых для очистки, шт', amountOfHammerCrushers) : null}
        </div>
    }

    private renderMechanicGrate = () => {
        const {listOfRodThickness} = this.state;
        const formOfRods: ItemList[] = [
            {value: FormOfRods.prizma, label: 'Прямоугольная форма'},
            {value: FormOfRods.prizmaWithCircleEdge, label: 'Прямоугольная форма с закругленной лобовой частью'},
            {value: FormOfRods.circle, label: 'Круглая форма'},
        ];
        const widthSection: ItemList[] = this.listOfWidthSection.map(section => {
            return {value: section, label: `${section}`};
        });
        const rodThickness: ItemList[] = listOfRodThickness.map(thickness => {
            return {value: thickness, label: `${thickness}`};
        });
        return <div>
            {this.renderSourceOfWasteWater()}
            <InputTemplate title={'Скрость течения воды в канале, м/с, диапазон [1.5 - 2]'}
                placeholder={'Введите значение Vk...'}
                onInputRef={(input) => {this.speedOfWaterInChannelRef = input}}
                onInput={(value) => {this.setState({speedOfWaterInChannel: value})}}/>
            <InputTemplate title={'Скорость движения воды в прозорах решетки, м/с, диапазон [0.8 - 1]'}
                placeholder={'Введите значение Vp...'}
                onInputRef={(input) => {this.speedOfWaterInSectionRef = input}}
                onInput={(value) => {this.setState({speedOfWaterInSection: value})}}/>
            <SelectTemplate title={'Выбор формы стержней'} itemList={formOfRods}
                onSelect={(value) => this.selectFormOfRods(value)}/>
            <InputTemplate title={'Угол наклона решетки к горизонту, диапазон [60 - 70]'}
                placeholder={'Введите значение α...'}
                onInputRef={(input) => {this.inclineAngleRef = input}}
                onInput={(value) => {this.setState({inclineAngle: value})}}/>
            <InputTemplate title={'Коэффициент, учитывающий стеснение потока механическими граблями, диапазон [1.05 - 1.1]'}
                placeholder={'Введите значение Kst...'}
                onInputRef={(input) => {this.flowRestrictionRakeRef = input}}
                onInput={(value) => {this.setState({flowRestrictionRake: value})}}/>
            <SelectTemplate title={'Ширина прозоров решетки, м'} itemList={widthSection}
                onSelect={(value) => this.selectWidthSection(value)}/>
            <SelectTemplate title={'Толщина стержней решетки, м'} itemList={rodThickness}
                onSelect={(value) => {this.selectCurrentRodThickness(value)}}/>
            {this.renderCountingButton()}
            {this.resetData()}
        </div>;
    }

    // Отрисовка вывода общих результатов первого и второго расчетов
    private resultCounting = () => {
        const {
            amountOfSuitableGrates,
            valueOfLedgeInstallationPlace,
            amountOfWaste,
            commonLengthOfChamberGrate,
            sizeOfInputChannelPart,
            sizeOfOutputChannelPart,
            lengthOfIncreaseChannelPart,
        } = this.state;
        const suitableGrates: ItemList[] = this.suitableGrates.map(grate => {
            return {value: grate.mark, label: grate.mark};
        });
        const limitedStandardChannelWidth: ItemList[] = this.limitedStandardWidthOfChannel.map(width => {
            return {value: width, label: `${width}`};
        });
        const typeOfGrate: ItemList[] = [
            {value: TypeOfGrates.vertical, label: 'Вертикальные решетки'},
            {value: TypeOfGrates.incline, label: 'Наклонные решетки'},
        ];
        return (
            amountOfSuitableGrates > 0 ?
            <div>
                {labelTemplate('Количество рабочих решеток, шт', amountOfSuitableGrates)}
                {labelTemplate('Количество резервных решеток, шт',
                    amountOfSuitableGrates > _.BASE_AMOUNT_OF_GRATES ? _.ADDITIONAL_AMOUNT_OF_GRATES : 1)}
                <SelectTemplate title={'Выбор решетки'} itemList={suitableGrates}
                    onSelect={(value) => {this.selectFromSuitableGrate(value)}}/>
                {valueOfLedgeInstallationPlace ?
                <div>
                    {labelTemplate('Величина уступа в месте установки решетки, м', valueOfLedgeInstallationPlace.toFixed(3))}
                    {labelTemplate('Количество технической воды, подводимой к дробилками, м3/ч',
                        (_.TECHNICAL_WATER * valueOfLedgeInstallationPlace).toFixed(3))}
                    <SelectTemplate title={'Выбор стандартной ширины канала, м'} itemList={limitedStandardChannelWidth}
                        onSelect={(value) => {this.selectStandardWidthOfChannel(value)}}/>
                    <SelectTemplate title={'Выбор типа решетки'} itemList={typeOfGrate}
                        onSelect={(value) => {this.selectTypeOfGrate(value)}}/>
                    {commonLengthOfChamberGrate ?
                    <div>
                        {labelTemplate('Длина входной части канала, м', sizeOfInputChannelPart.toFixed(3))}
                        {labelTemplate('Длина выходной части канала, м', sizeOfOutputChannelPart.toFixed(3))}
                        {labelTemplate('Длина расширенной части канала, м', lengthOfIncreaseChannelPart.toFixed(3))}
                        {labelTemplate('Общая длина камеры решетки, м', commonLengthOfChamberGrate.toFixed(3))}
                    </div> : null}
                    {amountOfWaste ? labelTemplate('Количество отходов, кг/ч', amountOfWaste) : null}
                </div> :
                null
                }
            </div> : null
        );
    }

    private returnToScheme = () => {
        this.props.onCountMode(false);
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
            onClick={() => this.clearPage()}>
            Очистить входные данные
        </Button>
    }

    render() {
        return (
            <div>
                <div>
                    <span>Механические решетки</span>
                    <button className={'btn btn-primary'} onClick={this.returnToScheme}>Изменить схему</button>
                </div>
                {this.renderMechanicGrate()}
                {this.resultCounting()}
            </div>
        );
    }
}