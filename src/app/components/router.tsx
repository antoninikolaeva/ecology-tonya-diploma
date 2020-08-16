import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import { GeneralComponent } from './general';
import { StartPage } from './startPage';

import { rootReducer } from './store/reducers';
import { generalContainer } from './generalContainer';

const store = createStore(rootReducer);

export class RouterComponent extends React.Component<{}, {}> {
	render() {
		return (
			<Router>
				<Route exact path={'/'} component={StartPage} />
				<Provider store={store}>
					<Route path={'/counting'} component={generalContainer} />
				</Provider>
			</Router>
		);
	}
}
