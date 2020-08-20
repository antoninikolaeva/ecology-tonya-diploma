import * as React from 'react';

export interface TableRowContentProps {
	value: number | string;
	label: string;
	colClass?: string;
	rowClass?: string;
}

export class TableRow extends React.Component<TableRowContentProps, {}> {
	constructor(props: TableRowContentProps) {
		super(props);
	}

	render() {
		const {value, label, colClass, rowClass} = this.props;
		if (!value || !label) {
			return null;
		}
		return (
			<tr className={rowClass}>
				<td className={`${colClass} left-table-column`}>{label}</td>
				<td className={`${colClass} right-table-column`}>{value}</td>
			</tr>
		);
	}
}