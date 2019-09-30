import * as React from 'react';
import { Nav, InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';

import {
    getUniqueWidthSection,
    getUniqueRodThickness,
    onlySecondConsts,
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
    amountOfWasteWater: number;
    amountOfDwellers: number;
    sourceOfWasteWater: SourceOfWasteWater;
    hammerCrusher: HammerCrusher;
    currentWidthSection: number;
    currentRodThickness: number;
    currentSuitableGrate: Grate;
    currentTypeOfGrates: TypeOfGrates;
    currentStandardWidthOfChannel: number;
    maxSecondFlow: number;
    currentTypeOfGrateCrusher: GrateCrusher;
}

export class GrateComponent extends React.Component<Props, State> {
    private amountOfHammerCrusher: number = undefined;
    private speedOfWaterInChannel: number = undefined;
    private speedOfWaterInSection: number = undefined;
    private formOfRod: FormOfRods = FormOfRods.prizma;
    private inclineAngle: number = undefined;
    private flowRestrictionRake: number = undefined;
    private amountOfWorkingGrate: number = undefined;
    private amountOfAdditionalGrate: number = undefined;
    private valueOfLedge: number = undefined;
    private amountOfTechnicalWater: number = undefined;
    private sizeOfInputChannelPart: number = undefined;
    private sizeOfOutputChannelPart: number = undefined;
    private lengthOfIncreaseChannelPart: number = undefined;
    private commonLengthOfChamberGrate: number = undefined;
    
    constructor(props: Props, context: any) {
        super(props, context);
        const defaultWidthSection = getUniqueWidthSection()[0];
        this.state = {
            grateTypeOne: true,
            grateTypeTwo: false,
            grateTypeThree: false,
            amountOfWasteWater: undefined,
            amountOfDwellers: undefined,
            sourceOfWasteWater: SourceOfWasteWater.manufacture,
            hammerCrusher: hammerCrushers[0],
            currentWidthSection: defaultWidthSection,
            currentRodThickness: getUniqueRodThickness(defaultWidthSection)[0],
            currentSuitableGrate: undefined,
            currentTypeOfGrates: TypeOfGrates.vertical,
            currentStandardWidthOfChannel: onlySecondConsts.standardWidthsOfChannel[0],
            maxSecondFlow: undefined,
            currentTypeOfGrateCrusher: grateCrushers[0],
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const {suitableGrateItems} = this.state;
        if (prevState.suitableGrateItems !== suitableGrateItems) {
            this.checkWaterSpeed(suitableGrateItems[0].mark);
        }
    }

    private checkAllInputForCounting = (): any[] => {
        const {grateTypeOne, grateTypeTwo} = this.state;
        const allError = [];
        if (!parseFloat(this.qmaxRef.value)) {
            allError.push(<Alert variant={'danger'}>Максимальный секундный расход, не введен</Alert>);
        }
        if (!parseFloat(this.vkRef.value)) {
            allError.push(<Alert variant={'danger'}>Скрость течения воды в канале, не введенa</Alert>);
        }
        if (parseFloat(this.vkRef.value) < 0.6 || parseFloat(this.vkRef.value) > 0.8) {
            allError.push(<Alert variant={'danger'}>Скрость течения воды в канале, введенa не верно, выход за рамки диапазона</Alert>);
        }
        if (!parseFloat(this.vpRef.value)) {
            allError.push(<Alert variant={'danger'}>Скорость движения воды в прозорах решетки, не введенa</Alert>);
        }
        if (parseFloat(this.vpRef.value) < 0.8 || parseFloat(this.vpRef.value) > 1) {
            allError.push(<Alert variant={'danger'}>Скорость движения воды в прозорах решетки, введенa не верно, выход за рамки диапазона</Alert>);
        }
        if (!parseFloat(this.alphaRef.value)) {
            allError.push(<Alert variant={'danger'}>Угол наклона решетки к горизонту, не введен</Alert>);
        }
        if (parseFloat(this.alphaRef.value) < 60 || parseFloat(this.alphaRef.value) > 70) {
            allError.push(<Alert variant={'danger'}>Угол наклона решетки к горизонту, введен не верно, выход за рамки диапазона</Alert>);
        }
        if (grateTypeOne) {
            if (!parseFloat(this.kstRef.value)) {
                allError.push(<Alert variant={'danger'}>
                    Коэффициент, учитывающий стеснение потока механическими граблями, диапазон, не введен
                </Alert>);
            }
            if (parseFloat(this.kstRef.value) < 1.05 || parseFloat(this.kstRef.value) > 1.1) {
                allError.push(<Alert variant={'danger'}>
                    Коэффициент, учитывающий стеснение потока механическими граблями, диапазон, введен не верно, выход за рамки диапазона
                </Alert>);
            }
        }
        return allError;
    }

    private grateCounting = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const {grateTypeOne, grateTypeTwo, grateTypeThree, suitableRodThickness} = this.state;
        const errors = this.checkAllInputForCounting();
        if(errors.length > 0 ) {
            this.setState({validateErrors: errors});
            return;
        }
        // to do check to number value > 0
        let n;
        let n1;
        let b1;
        if (grateTypeOne) {
            n = (parseFloat(this.kstRef.value) * parseFloat(this.qmaxRef.value)) /
            (Math.sqrt(parseFloat(this.qmaxRef.value) / parseFloat(this.vkRef.value)) *
            parseFloat(this.vpRef.value) * this.currentWidthSection);
        }
        if (grateTypeTwo) {
            n = (1 * parseFloat(this.qmaxRef.value)) /
            (Math.sqrt(parseFloat(this.qmaxRef.value) / parseFloat(this.vkRef.value)) *
            parseFloat(this.vpRef.value) * this.currentWidthSection);
        }
        const bp =  this.currentRodThickness * (n - 1) + this.currentWidthSection * n;

        let amountOfGrate = 1;
        let suitableGrates: GrateProperties[] = [];
        while (amountOfGrate > 0) {
            suitableGrates = gratePropsTable.filter(grate => {
                const isSuitableGrate = bp <= (amountOfGrate * grate.size.width) &&
                    grate.widthSection === this.currentWidthSection &&
                    grate.rodThickness ===  this.currentRodThickness;
                return isSuitableGrate;
            });
            if (suitableGrates.length > 0) {
                break;
            } else {
                amountOfGrate++;
            }
        }
        if (grateTypeTwo) {
            n1 = n / amountOfGrate;
            b1 = bp / amountOfGrate;
        }
        this.setState({
            suitableGrateItems: suitableGrates,
            amountOfGrate,
            validateErrors: [],
            amountOfSection: n1,
            widthOfGrate: b1
        });
    }

    private checkWaterSpeed = (event: React.ChangeEvent<HTMLSelectElement> | string) => {
        const {suitableGrateItems, amountOfGrate, beta, grateTypeTwo, grateTypeOne, amountOfSection} = this.state;
        if (typeof event === 'string') {
            this.currentGrate = suitableGrateItems.find(grate => grate.mark === event);
        } else {
            this.currentGrate = suitableGrateItems.find(grate => grate.mark === event.target.value);
        }
        let checkVp;
        if (grateTypeOne) {
            checkVp = (parseFloat(this.kstRef.value) * parseFloat(this.qmaxRef.value)) /
            (Math.sqrt(parseFloat(this.qmaxRef.value) / parseFloat(this.vkRef.value)) *
            this.currentGrate.numberOfSection * this.currentWidthSection * amountOfGrate);
        }
        if (grateTypeTwo) {
            checkVp = (1 * parseFloat(this.qmaxRef.value)) /
            (Math.sqrt(parseFloat(this.qmaxRef.value) / parseFloat(this.vkRef.value)) *
            amountOfSection * this.currentWidthSection * amountOfGrate);
        }
        if (!(checkVp >= 0.8) && !(checkVp <= 1)) {
            alert('К сожалению, выбранная марка решетки не подходит для заданных параметров.' +
             'Пожалуйста, выберите другую марку решетки или иные' +
             'входные данные (ширину прозоров и/или толщину стержней).');
        }
        const dzeta = beta * Math.sin(parseFloat(this.alphaRef.value) * Math.PI / 180) *
            Math.pow(this.currentRodThickness / this.currentWidthSection, (4 / 3));
        const g = 9.80666;
        const P = 3;
        const hp = dzeta * Math.pow(checkVp, 2) / (2 * g) * P;
        this.setState({hp});
    }

    private selectHammerCrusher = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!event.target.value) {
            return;
        }
        const performanceOfCrusher = parseFloat(event.target.value);

        const {sourceOfWater} = this.state;
        const k = 2;
        let potb;
        if (sourceOfWater === SourceOfWasteWater.manufacture) {
            potb = 750 * parseFloat(this.amountOfWasteRef.value) * k / 24;
        } else if (sourceOfWater === SourceOfWasteWater.city) {
            const wotb = this.amountOfWasteFixed * parseFloat(this.amountOfDwellersRef.value) / 365000;
            potb = 750 * wotb * k / 24;
        }
        const amountOfCrusher = (potb / performanceOfCrusher) > 1 ? Math.ceil(potb / performanceOfCrusher) : 1;
        this.setState({amountOfCrusher});
    }

    private selectWidthSection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.currentWidthSection = parseFloat(event.target.value);
        const suitableGrateProps = gratePropsTable.filter(
                prop => prop.widthSection === this.currentWidthSection
            );
        const rodThicknessArray = suitableGrateProps.map(prop => prop.rodThickness);
        this.setState({suitableRodThickness: this.getUniqueValuesArray(rodThicknessArray)});
    }

    private selectTypeOfGrate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {widthOfGrate} = this.state;
        const typeOfGrate = event.target.value;
        const fi = 20;
        this.sizeOfInputChannelPart = (widthOfGrate - this.currentStandardWidthOfChannel) /
            (2 * Math.tan(fi * Math.PI / 180));
        this.sizeOfOutputChannelPart = 0.5 * this.sizeOfInputChannelPart;
        if (typeOfGrate === 'vertical') {
            this.lengthOfIncreaseChannelPart = 1.8 * this.currentStandardWidthOfChannel;
        } else {
            this.lengthOfIncreaseChannelPart = (1.8 * this.currentStandardWidthOfChannel) +
                Math.sqrt(parseFloat(this.qmaxRef.value) / parseFloat(this.vkRef.value) /
                Math.tan(parseFloat(this.alphaRef.value) * Math.PI / 180));
        }

        const k = 2;
        const wotb = this.amountOfWasteFixed * parseFloat(this.amountOfDwellersRef.value) / 365000;
        const potb = 750 * wotb * k / 24;
        this.setState({commonLengthOfChamberGrate:
            this.sizeOfInputChannelPart + this.sizeOfOutputChannelPart + this.lengthOfIncreaseChannelPart,
            amountOfWasteInHour: potb
        });
    }

    private selectGrateCrusher = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!this.qmaxRef.value) {
            return;
        }
        if (!event.target.value) {
            return;
        }
        this.currentGrateCrusher = GrateCrushers.find(grateCrusher => grateCrusher.mark === event.target.value);
        let N = 1; // amount of grateCrusher
        while (1) {
            if ((N * this.currentGrateCrusher.maxPerformance) > parseFloat(this.qmaxRef.value)) {
                break;
            }
            N++;
        }
        const v = parseFloat(this.qmaxRef.value) / (N * this.currentGrateCrusher.squareHeliumHole);
        if (v > this.currentGrateCrusher.speedOfMoveInSectionMin && v < this.currentGrateCrusher.speedOfMoveInSectionMax) {
            this.setState({checkGrateCrusherSpeed: v, amountOfGrateCrusher: N});
        } else {
            this.setState({checkGrateCrusherSpeed: parseFloat(v.toFixed(3)), amountOfGrateCrusher: N});
            alert('Проверка прошла неудачно - данный тип решетки-дробилки ' +
                'не подходит, либо скорость близка к нужному значению, ' +
                'но таковой не является');
        }
    }

    private renderListOfMarks = () => {
        const { suitableGrateItems, amountOfGrate } = this.state;
        return <div>
            {this.labelTemplate('Количество рабочих решеток, шт', amountOfGrate)}
            {this.labelTemplate('Количество резервных решеток, шт', amountOfGrate > 3 ? 2 : 1)}

            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Выбор решетки'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => {this.checkWaterSpeed(event)}}>
                    {
                        suitableGrateItems.map((item, index) => {
                            return <option key={index}>
                                {item.mark}
                            </option>
                        })
                    }
                </select>
            </InputGroup>
            {this.renderLedgeOfDrillInstallation()}
        </div>
    }

    private renderLedgeOfDrillInstallation = () => {
        const {hp, grateTypeOne, grateTypeTwo} = this.state;
        return (
            hp ? 
                <div>
                    {this.labelTemplate('Величина уступа в месте установки решетки, м', hp.toFixed(4))}
                    {
                        grateTypeOne ?
                            this.labelTemplate('Количество технической воды, подводимой к дробилками, м3/ч', (40 * hp).toFixed(4)) :
                            null
                    }
                    {
                        grateTypeTwo ? 
                            this.renderSelectOfGateTypes() :
                            null
                    }
                </div>:
                null
        );
    }

    private renderSelectOfGateTypes = () => {
        const {commonLengthOfChamberGrate, amountOfWasteInHour} = this.state;
        return (
            <div>
                <InputGroup className={'grate-input-group'}>
                    <InputGroup.Prepend>
                        <InputGroup.Text className={'grate-input-title'}>{'Выбор стандартной ширины канала'}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <select className={'grate-input-value'}
                        onChange={(event) => {this.currentStandardWidthOfChannel = parseFloat(event.target.value)}}>
                        {this.standardWidthsOfChannel.map((width, index) => {
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
                    commonLengthOfChamberGrate ? <div>
                            {this.labelTemplate('Длина входной части канала, м', this.sizeOfInputChannelPart.toFixed(4))}
                            {this.labelTemplate('Длина выходной части канала, м', this.sizeOfOutputChannelPart.toFixed(4))}
                            {this.labelTemplate('Длина расширенной части канала, м', this.lengthOfIncreaseChannelPart.toFixed(4))}
                            {this.labelTemplate('Общая длина камеры решетки, м', commonLengthOfChamberGrate.toFixed(4))}
                        </div> :
                        null
                }
                {
                    amountOfWasteInHour ? 
                        this.labelTemplate('Количество отходов в час', amountOfWasteInHour) :
                        null
                }
            </div>
        );
    }

    private renderListOfWidthSection = () => {
        const allWidthSections = gratePropsTable.map(prop => prop.widthSection);
        const uniqueWidthSection = this.getUniqueValuesArray(allWidthSections);
        const defaultWidthSection = uniqueWidthSection[0];
        this.currentWidthSection = this.currentWidthSection ? this.currentWidthSection : defaultWidthSection;
        return <div>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Ширина прозоров решетки, м'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => { this.selectWidthSection(event) }}>
                    {
                        uniqueWidthSection.map((section, index) => {
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
                    {this.renderRodThickness(defaultWidthSection)}
                </select>
            </InputGroup>
        </div>;
    }

    private renderRodThickness = (defaultWidthSection?: number) => {
        const {suitableRodThickness} = this.state;
        let rodThickness: number[] = [];
        if (defaultWidthSection) {
            const suitableGrateProps = gratePropsTable.filter(
                prop => prop.widthSection === defaultWidthSection
            );
            const rodThicknessArray = suitableGrateProps.map(prop => prop.rodThickness);
            rodThickness = this.getUniqueValuesArray(rodThicknessArray);
        }
        const necessaryRodThickness = suitableRodThickness.length > 0 ? suitableRodThickness : rodThickness;
        this.currentRodThickness = necessaryRodThickness[0];
        return necessaryRodThickness.map((rod, index) => {
            return <option key={index} value={rod}>
                {rod}
            </option>;
        });
    }

    private renderCommonInputData = () => {
        return <InputGroup className={'grate-input-group'}>
            <InputGroup.Prepend>
                <InputGroup.Text className={'grate-input-title'}>
                    Максимальный секундный расход, м3/с<
                </InputGroup.Text>
            </InputGroup.Prepend>
            <input className={'grate-input-value'}
                type={'text'}
                placeholder={'Введите значение qmax...'}
                onChange={(event) => this.setState({
                    maxSecondFlow: parseFloat(event.target.value)
                })}/>
        </InputGroup>; 
    }

    private renderCommonFirstAndSecondInputData = () => {
        return <div>
            {this.inputTemplate('Скрость течения воды в канале, м/с, диапазон [0.6 - 0.8]',
                'Введите значение Vk...',
                (ref: HTMLInputElement) => this.vkRef = ref)}
            {this.inputTemplate('Скорость движения воды в прозорах решетки, м/с, диапазон [0.8 - 1]',
                'Введите значение Vp...',
                (ref: HTMLInputElement) => this.vpRef = ref)}

            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Выбор формы стержней'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => this.setState({beta: parseFloat(event.target.value)})}>
                    <option value={2.42}>Прямоугольная форма</option>
                    <option value={1.83}>Прямоугольная форма с закругленной лобовой частью</option>
                    <option value={1.79}>Круглая форма</option>
                </select>
            </InputGroup>

            {this.inputTemplate('Угол наклона решетки к горизонту, диапазон [60 - 70]',
                'Введите значение α...',
                (ref: HTMLInputElement) => this.alphaRef = ref)}
        </div>
    }

    private renderCountingButton = () => {
        return <Button variant={'outline-primary'}
            className={'grate-counting-btn'}
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {this.grateCounting(event)}}>
            Подобрать марку решеток
        </Button>
    }

    private renderFirstTypeOfGrate = () => {
        const { suitableGrateItems, validateErrors, sourceOfWater, amountOfCrusher } = this.state;
        return <div>
            {this.renderCommonInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Источник сточных вод'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => this.setState({sourceOfWater: parseFloat(event.target.value)})}>
                    <option value={SourceOfWasteWater.manufacture}>Производсвенный сток</option>
                    <option value={SourceOfWasteWater.city}>Городской сток</option>
                </select>
            </InputGroup>
            {
                sourceOfWater === SourceOfWasteWater.manufacture ?
                    this.inputTemplate('Количество образующихся отбросов, м3/сут',
                        'Введите значение Wотб...',
                        (ref: HTMLInputElement) => this.amountOfWasteRef = ref) :
                    this.inputTemplate('Приведенное население, чел',
                        'Введите значение Nпр...',
                        (ref: HTMLInputElement) => this.amountOfDwellersRef = ref)
            }
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Выбор молотковых дробилок'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event) => {this.selectHammerCrusher(event)}}>
                    {hammerCrushersProps.map(crusher => {
                        return <option value={crusher.performance}>{crusher.mark}</option>
                    })}
                </select>
            </InputGroup>
            {
                amountOfCrusher ?
                    this.labelTemplate('Количество молотковых дробилок необходимых для очистки, шт', amountOfCrusher) :
                    null
            }
            {this.renderCommonFirstAndSecondInputData()}
            {this.inputTemplate('Коэффициент, учитывающий стеснение потока механическими граблями, диапазон [1.05 - 1.1]',
                'Введите значение Kst...',
                (ref: HTMLInputElement) => this.kstRef = ref)}
            {this.renderListOfWidthSection()}
            {this.renderCountingButton()}
            {
                suitableGrateItems.length > 0 ?
                    this.renderListOfMarks() :
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
        const { suitableGrateItems, validateErrors } = this.state;
        this.currentWidthSection = 0.016;
        return <div>
            {this.renderCommonInputData()}
            {this.inputTemplate('Приведенное население, чел',
                        'Введите значение Nпр...',
                        (ref: HTMLInputElement) => this.amountOfDwellersRef = ref)}
            {this.renderCommonFirstAndSecondInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Толщина стержней решетки, м'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={(event => {this.currentRodThickness = parseFloat(event.target.value)})}>
                    {this.renderRodThickness(this.currentWidthSection)}
                </select>
            </InputGroup>
            {this.renderCountingButton()}
            {
                suitableGrateItems.length > 0 ?
                    this.renderListOfMarks() :
                    undefined
            }
            {
                validateErrors.length > 0 ?
                    this.renderValidateErrors() :
                    null
            }
        </div>;
    }

    private renderThirdTypeOfGrate = () => {
        const {amountOfGrateCrusher, checkGrateCrusherSpeed} = this.state;
        return <div>
            {this.renderCommonInputData()}
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>{'Толщина стержней решетки, м'}</InputGroup.Text>
                </InputGroup.Prepend>
                <select className={'grate-input-value'}
                    onChange={event => this.selectGrateCrusher(event)}>
                    {GrateCrushers.map((grateCrusher, index) => {
                        return <option key={index} value={grateCrusher.mark}>{grateCrusher.mark}</option>
                    })}
                </select>
            </InputGroup>
            {
                checkGrateCrusherSpeed ? 
                    <div>
                        {this.labelTemplate('Количество решеток дробилок необходимых для очистки, шт',
                            amountOfGrateCrusher)}
                        {this.labelTemplate('Проверка дробилки, скорость должна входить в диапазон [1 - 1.2], м/с',
                            checkGrateCrusherSpeed)}
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

    private inputTemplate = (
        title: string,
        palceholder: string,
        inputRef: (ref: HTMLInputElement) => void
    ) => {
        return <InputGroup className={'grate-input-group'}>
        <InputGroup.Prepend>
            <InputGroup.Text className={'grate-input-title'}>{title}</InputGroup.Text>
            </InputGroup.Prepend>
            <input className={'grate-input-value'} type={'text'} placeholder={palceholder} ref={inputRef}/>
        </InputGroup>;
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