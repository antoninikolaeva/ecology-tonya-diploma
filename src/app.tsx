import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GeneralComponent } from './app/components/general';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import '../assets/styles/grate.css';

ReactDOM.render(
    <GeneralComponent />,
    document.getElementById('root')
);