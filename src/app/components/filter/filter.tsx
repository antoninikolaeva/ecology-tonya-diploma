import * as React from 'react';
import { FilterTypes } from '../general-resources';
import { labelTemplate, NULLSTR, InputTemplate, ItemList, SelectTemplate, resetSelectToDefault } from '../utils';
import { Table } from 'react-bootstrap';
import { dataModel, FilterResultData } from '../data-model';
import { FilterSource } from './filter-resource';

export interface FilterProps {
	secondMaxFlow: number;
	dailyWaterFlow: number;
	type: FilterTypes;
	onCountMode(countMode: boolean): void;
	onResultMode(resultMode: boolean): void;
}

interface FilterState {
	baseSubstanceConcentrate: number;
	finalSubstanceConcentrate: number;
	baseBPKConcentrate: number;
	finalBPKConcentrate: number;
	filterType: FilterSource.FilterType;
	isValidateError: boolean;
	isResult: boolean;
}

export class FilterComponent extends React.Component<FilterProps, FilterState> {
	private baseSubstanceConcentrateRef: HTMLInputElement;
	private finalSubstanceConcentrateRef: HTMLInputElement;
	private baseBPKConcentrateRef: HTMLInputElement;
	private finalBPKConcentrateRef: HTMLInputElement;
	private filterTypesListRef: HTMLOptionElement[] = [];

	private levelOfCleanSubstance: number;
	private levelOfCleanBPK: number;
	private filterTypesList: ItemList[] = [];

	constructor(props: FilterProps) {
		super(props);

		this.state = {
			baseSubstanceConcentrate: undefined,
			finalSubstanceConcentrate: undefined,
			baseBPKConcentrate: undefined,
			finalBPKConcentrate: undefined,
			filterType: undefined,
			isValidateError: false,
			isResult: false,
		};
	}

	private clearPage = () => {
		if (this.baseSubstanceConcentrateRef) { this.baseSubstanceConcentrateRef.value = NULLSTR; }
		if (this.finalSubstanceConcentrateRef) { this.finalSubstanceConcentrateRef.value = NULLSTR; }
		if (this.baseBPKConcentrateRef) { this.baseBPKConcentrateRef.value = NULLSTR; }
		if (this.finalBPKConcentrateRef) { this.finalBPKConcentrateRef.value = NULLSTR; }
		resetSelectToDefault(this.filterTypesListRef, this.filterTypesList);
		this.setState({
			baseSubstanceConcentrate: undefined,
			finalSubstanceConcentrate: undefined,
			baseBPKConcentrate: undefined,
			finalBPKConcentrate: undefined,
			filterType: undefined,
			isValidateError: false,
			isResult: false,
		});
	}

	private setFilterResult = () => {
		const filterResult: FilterResultData = {
		};
		dataModel.setFilterResult(filterResult);
	}

	private renderBaseData = () => {
		const { secondMaxFlow, dailyWaterFlow } = this.props;
		return <div>
			<div className={'input-data-title'}>Входные данные</div>
			{labelTemplate('Секундный максимальный расход', secondMaxFlow)}
			{labelTemplate('Суточный расход сточных вод, м3/сут', dailyWaterFlow)}
		</div>;
	}

	private renderInputArea = () => {
		const { type } = this.props;
		const { baseSubstanceConcentrate, baseBPKConcentrate } = this.state;
		return (
			<>
				<InputTemplate title={`Начальная концентрация взвешенных веществ в сточной воде, мг/л,
					диапазон[${FilterSource.BaseConcentrate.min} - ${FilterSource.BaseConcentrate.max}]`}
					range={{ minValue: FilterSource.BaseConcentrate.min, maxValue: FilterSource.BaseConcentrate.max }}
					placeholder={'Введите начальную концентрацию...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseSubstanceConcentrateRef = input; }}
					onInput={(value) => {
						this.selectSuitableFilterTypes();
						this.setState({ baseSubstanceConcentrate: value });
					}} />

				{baseSubstanceConcentrate
					? <InputTemplate title={`Допустимая конечная концентрация взвешенных веществ в осветленной воде, мг/л,
						диапазон[0 - ${baseSubstanceConcentrate}]`}
						range={{ minValue: 0, maxValue: baseSubstanceConcentrate }}
						placeholder={'Введите допустимую конечную концентрацию...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalSubstanceConcentrateRef = input; }}
						onInput={(value) => {
							this.selectSuitableFilterTypes();
							this.setState({ finalSubstanceConcentrate: value });
						}} />
					: null}

				<InputTemplate title={`Начальная концентрация БПКполн в сточной воде, мг/л,
					диапазон[${FilterSource.BaseConcentrate.min} - ${FilterSource.BaseConcentrate.max}]`}
					range={{ minValue: FilterSource.BaseConcentrate.min, maxValue: FilterSource.BaseConcentrate.max }}
					placeholder={'Введите начальную концентрацию...'}
					onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
					onInputRef={(input) => { this.baseBPKConcentrateRef = input; }}
					onInput={(value) => {
						this.selectSuitableFilterTypes();
						this.setState({ baseBPKConcentrate: value });
					}} />

				{baseBPKConcentrate
					? <InputTemplate title={`Допустимая конечная концентрация БПКполн в осветленной воде, мг/л,
						диапазон[0 - ${baseBPKConcentrate}]`}
						range={{ minValue: 0, maxValue: baseBPKConcentrate }}
						placeholder={'Введите допустимую конечную концентрацию...'}
						onErrorExist={(isError) => { this.setState({ isValidateError: isError }); }}
						onInputRef={(input) => { this.finalBPKConcentrateRef = input; }}
						onInput={(value) => {
							this.selectSuitableFilterTypes(value);
							this.setState({ finalBPKConcentrate: value });
						}} />
					: null}

				{this.levelOfCleanSubstance && this.levelOfCleanBPK
					? <SelectTemplate title={'Тип фильтра'} itemList={this.filterTypesList}
						onSelect={(value) => { this.setState({ filterType: value as unknown as FilterSource.FilterType }); }}
						onSelectRef={(optionList) => { this.filterTypesListRef = optionList; }} />
					: null}

				{this.renderCheckingButton()}
			</>
		);
	}

	private selectSuitableFilterTypes = (finalBPKConcentrateNoState?: number) => {
		const {baseBPKConcentrate, baseSubstanceConcentrate, finalSubstanceConcentrate, finalBPKConcentrate} = this.state;
		if (!baseBPKConcentrate || !baseSubstanceConcentrate ||
			!finalSubstanceConcentrate || !(finalBPKConcentrateNoState || finalBPKConcentrate)) {
			return;
		}
		this.levelOfCleanSubstance = 100 * (baseSubstanceConcentrate - finalSubstanceConcentrate) / baseSubstanceConcentrate;
		if (finalBPKConcentrateNoState) {
			this.levelOfCleanBPK = 100 * (baseBPKConcentrate - finalBPKConcentrateNoState) / baseBPKConcentrate;
		} else if (finalBPKConcentrate) {
			this.levelOfCleanBPK = 100 * (baseBPKConcentrate - finalBPKConcentrate) / baseBPKConcentrate;
		}
		this.filterTypesList = [];
		this.filterTypesList.push({value: undefined, label: 'Выберите тип фильтра'})
		FilterSource.filterTypes.forEach(filterType => {
			if (this.levelOfCleanSubstance >= this.levelOfCleanBPK) {
				if (filterType.clearEffectSubstance.min < this.levelOfCleanSubstance &&
					filterType.clearEffectSubstance.max > this.levelOfCleanSubstance) {
						this.filterTypesList.push({value: filterType.type, label: filterType.name});
					}
			}
			if (this.levelOfCleanSubstance < this.levelOfCleanBPK) {
				if (filterType.clearEffectBPK.min < this.levelOfCleanBPK && filterType.clearEffectBPK.max > this.levelOfCleanBPK) {
						this.filterTypesList.push({value: filterType.type, label: filterType.name});
					}
			}
		});
	}

	private isInputReadyToCounting = (): boolean => {
		return true;
	}

	private resultCounting = () => {
		const { secondMaxFlow, type } = this.props;
		this.setFilterResult();

		this.setState({ isResult: true });
	}

	private renderResult = () => {
		if (!this.state.isResult) {
			return;
		}
		return (
			<div className={'table-result'}>
				<Table bordered hover>
					<tbody>
					</tbody>
				</Table>
			</div>
		);
	}

	// Отрисовка кнопки расчета
	private renderCheckingButton = () => {
		const isNotReadyToCount = !this.isInputReadyToCounting();
		return isNotReadyToCount ? <button className={'btn btn-primary'} disabled>
			Показать результаты данной выборки
			</button> :
			<button className={'btn btn-primary'} onClick={() => this.resultCounting()}>
				Показать результаты данной выборки
			</button>;
	}

	// Отрисовка кнопки очистки
	private resetData = () => {
		return <button className={'btn btn-danger'}
			title={'Очистить входные данные'}
			onClick={() => this.clearPage()}>
			<i className={'far fa-trash-alt'}></i>
		</button>;
	}

	private renderToolbar = () => {
		return <div className={'device-count-toolbar'}>
			<button className={'btn btn-primary'} title={'Изменить схему'}
				onClick={this.returnToScheme}>
				<i className={'fas fa-reply'}></i>
			</button>
			{this.resetData()}
			<button className={'merge-result btn btn-success'}
				onClick={this.goToResult}
				title={'Cводная схема очитных сооружений'}>
				<i className={'fas fa-trophy'}></i>
			</button>
		</div>;
	}

	private returnToScheme = () => {
		this.props.onCountMode(false);
	}

	private goToResult = () => {
		this.props.onCountMode(false);
		this.props.onResultMode(true);
	}

	render() {
		const { type } = this.props;
		return (
			<>
				<div className={'title-container'}>
					<div className={'count-title'}>Типовой фильтр</div>
					{this.renderToolbar()}
				</div>
				<div className={'device-container'}>
					<div className={'device-input'}>
						{this.renderBaseData()}
						{this.renderInputArea()}
					</div>
					<div className={'device-result'}>
						<div className={'input-data-title'}>Результаты расчета</div>
						{this.renderResult()}
					</div>
				</div>
			</>
		);
	}
}
