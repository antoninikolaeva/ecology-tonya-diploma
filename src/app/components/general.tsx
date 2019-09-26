import * as React from 'react';

import { GrateComponent } from './grate/grate';
import { Navbar, DropdownButton, Dropdown } from 'react-bootstrap';

interface State {
    isGrateOpen: boolean;
    isSandCatcher: boolean;
    isOilTrapOpen: boolean;
}

export class GeneralComponent extends React.Component<{}, State> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            isGrateOpen: false,
            isSandCatcher: false,
            isOilTrapOpen: false,
        }
    }

    private returnToStart = () => {
        this.setState({
            isGrateOpen: false,
            isSandCatcher: false,
            isOilTrapOpen: false,
        });
    }

    render() {
        const {isGrateOpen} = this.state;
        return (
            <div>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand onClick={() => { this.returnToStart() }}>
                        Главная страница
                    </Navbar.Brand>
                    <DropdownButton id={'mechanical-cleaning'} title={'Механическая очистка'}>
                        <Dropdown.Item onClick={() => {this.setState({isGrateOpen: true})}}>
                            Расчет очистных решеток
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {this.setState({isSandCatcher: true})}}>
                            Расчет очистных песколовок
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {this.setState({isOilTrapOpen: true})}}>
                            Расчет нефтеловушек
                        </Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton id={'biological-cleaning'} title={'Биологичекая очистка'}>
                        <Dropdown.Item onClick={() => {this.setState({isGrateOpen: true})}}>
                            Расчет что-там
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {this.setState({isSandCatcher: true})}}>
                            Расчет что-то еще
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {this.setState({isOilTrapOpen: true})}}>
                            Расчет еще один
                        </Dropdown.Item>
                    </DropdownButton>
                </Navbar>
                {
                    isGrateOpen ? <GrateComponent /> : null
                }
            </div>
        );
    }
}