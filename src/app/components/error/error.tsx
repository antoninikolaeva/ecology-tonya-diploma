import * as React from 'react';
import { Alert } from 'react-bootstrap';

interface Props {
    errorValue: Error;
}

export class ErrorAlert extends React.Component<Props, {}> {
    render() {
        const {errorValue} = this.props;
        if (!errorValue) {
            return null;
        }
        return <Alert variant={'danger'}>{errorValue.message}</Alert>
    }
}
