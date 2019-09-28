import * as React from 'react';
import { gratePropsTable, GrateProperties, HammerCrusherProperties, hammerCrushersProps } from './grate-resources';
import { Nav, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { AlertProps } from 'react-bootstrap';

interface Props {
}

interface State {
    beta: number; 
    hp: number; 
    sourceOfWater: SourceOfWasteWater;
    amountOfCrusher: number;
    suitableGrateItems: GrateProperties[];
    suitableRodThickness: number[]; 
    amountOfGrate: number; // N
    grateTypeOne: boolean;
    grateTypeTwo: boolean;
    grateTypeThree: boolean;
    validateErrors: any[];
    amountOfSection: number; // n1
    widthOfGrate: number; // B1
    commonLengthOfChamberGrate: number; // L
}

enum SourceOfWasteWater {
    manufacture,
    city
};

export class GrateComponent extends React.Component<Props, State> {
    private qmaxRef: HTMLInputElement;
    private vkRef: HTMLInputElement;
    private kstRef: HTMLInputElement;
    private vpRef: HTMLInputElement;
    private alphaRef: HTMLInputElement;
    private amountOfWasteRef: HTMLInputElement;
    private amountOfDwellersRef: HTMLInputElement;
    private currentWidthSection: number;
    private currentRodThickness: number;
    private currentGrate: GrateProperties;
    private sizeOfInputChannelPart: number; // l1
    private sizeOfOutputChannelPart: number; //l2
    private lengthOfIncreaseChannelPart: number; //l
    private standardWidthsOfChannel: number[] = [0.4, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2];

    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            beta: 2.42,
            hp: undefined,
            sourceOfWater: SourceOfWasteWater.manufacture,
            amountOfCrusher: undefined,
            suitableGrateItems: [],
            suitableRodThickness: [],
            amountOfGrate: 1,
            grateTypeOne: true,
            grateTypeTwo: false,
            grateTypeThree: false,
            validateErrors: [],
            amountOfSection: undefined,
            widthOfGrate: undefined,
            commonLengthOfChamberGrate: undefined,
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

    private getUniqueValuesArray = (array: number[]) => {
        return array.filter(
            (value, index, self) => self.indexOf(value) === index);
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
            const qotb = 8;
            const wotb = qotb * parseFloat(this.amountOfDwellersRef.value) / 365000;
            potb = 750 * wotb * k / 24;
        }
        const amountOfCrusher = (potb / performanceOfCrusher) > 1 ? Math.floor(potb / performanceOfCrusher) : 1;
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
        let A;
        for (let index = 0; index < this.standardWidthsOfChannel.length; index++) {
            if (this.standardWidthsOfChannel[index] > widthOfGrate) {
                A = this.standardWidthsOfChannel[index-1];
                break;
            }
        }
        this.sizeOfInputChannelPart = (widthOfGrate - A) / (2 * Math.tan(fi * Math.PI / 180));
        this.sizeOfOutputChannelPart = 0.5 * this.sizeOfInputChannelPart;
        if (typeOfGrate === 'vertical') {
            this.lengthOfIncreaseChannelPart = 1.8 * A;
        } else {
            this.lengthOfIncreaseChannelPart = (1.8 * A) +
                Math.sqrt(parseFloat(this.qmaxRef.value) / parseFloat(this.vkRef.value) /
                Math.tan(parseFloat(this.alphaRef.value) * Math.PI / 180));
        }
        this.setState({commonLengthOfChamberGrate:
            this.sizeOfInputChannelPart + this.sizeOfOutputChannelPart + this.lengthOfIncreaseChannelPart
        });
    }

    private renderListOfMarks = () => {
        const { suitableGrateItems, amountOfGrate } = this.state;
        return <div>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        {'Количество рабочих решеток, шт'}
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Label className={'grate-input-value'}>
                    {amountOfGrate}
                </Form.Label>
            </InputGroup>
            <InputGroup className={'grate-input-group'}>
                <InputGroup.Prepend>
                    <InputGroup.Text className={'grate-input-title'}>
                        {'Количество резервных решеток, шт'}
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Label className={'grate-input-value'}>
                    {amountOfGrate > 3 ? 2 : 1}
                </Form.Label>
            </InputGroup>

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
                    <InputGroup className={'grate-input-group'}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className={'grate-input-title'}>
                                {'Величина уступа в месте установки решетки, м'}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Label className={'grate-input-value'}>
                            {hp.toFixed(2)}
                        </Form.Label>
                    </InputGroup>
                    {
                        grateTypeOne ?  
                            <InputGroup className={'grate-input-group'}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text className={'grate-input-title'}>
                                        {'Количество технической воды, подводимой к дробилками, м3/ч'}
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Label className={'grate-input-value'}>
                                    {(40 * hp).toFixed(2)}
                                </Form.Label>
                            </InputGroup> :
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
        const {commonLengthOfChamberGrate} = this.state;
        return (
            <div>
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
                        <InputGroup className={'grate-input-group'}>
                            <InputGroup.Prepend>
                                <InputGroup.Text className={'grate-input-title'}>{'Длины и размеры:'}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Label className={'grate-input-value'}>
                                l1: {this.sizeOfInputChannelPart}
                                l2: {this.sizeOfOutputChannelPart}
                                l: {this.lengthOfIncreaseChannelPart}
                                L: {commonLengthOfChamberGrate}
                            </Form.Label>
                        </InputGroup> :
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
        return this.inputTemplate(
            'Максимальный секундный расход, м3/с',
            'Введите значение qmax...',
            (ref: HTMLInputElement) => this.qmaxRef = ref);
    }

    private renderCommonFirstAndSecondInputData = () => {
        const {sourceOfWater, amountOfCrusher} = this.state;
        return <div>
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
                    <InputGroup className={'grate-input-group'}>
                        <InputGroup.Prepend>
                            <InputGroup.Text className={'grate-input-title'}>
                                {'Количество молотковых дробилок необходимых для очистки, шт'}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Label className={'grate-input-value'}>
                            {amountOfCrusher}
                        </Form.Label>
                    </InputGroup>
                     :
                    null
            }

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
        const { suitableGrateItems, validateErrors } = this.state;
        return <div>
            {this.renderCommonInputData()}
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
        return <div>
            {this.renderCommonInputData()}
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