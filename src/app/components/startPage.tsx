import * as React from 'react';
import { Link } from 'react-router-dom';

export class StartPage extends React.Component<{}, {}> {

	constructor(props: {}) {
		super(props);
		this.state = {
		};
	}

	render() {
		const { } = this.state;
		return (
			<div>
				<h1>Главная страница</h1>
				<div className={''}>
					<Link className={''} to={'/counting'} >Расчет схемы очистных сооружений</Link>
				</div>
			</div>
		);
	}
}