import * as React from 'react';
import { Alert } from 'react-bootstrap';

interface Props {
    errorValue?: Error;
    errorMessage?: string;
}

export class ErrorAlert extends React.Component<Props, {}> {
    render() {
        const {errorValue, errorMessage} = this.props;
        if (!errorValue && !errorMessage) {
            return null;
        } else if (errorMessage && !errorValue) {
            const newError = new Error(errorMessage);
            return <Alert variant={'danger'}>{newError.message}</Alert>
        } else {
            return <Alert variant={'danger'}>{errorValue.message}</Alert>
        }
        
    }
}
