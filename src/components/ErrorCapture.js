/* @flow */

import * as React from "react";

type Props = {
    children: Function,
    data: any,
}

type State = {
    caughtError: boolean,
}

export default class ErrorCapture extends React.Component<Props, State> {
    state = {
        caughtError: false,
    };

    componentDidCatch(error: any, info: any): void {
        console.log(`An error was caught: ${error}`);
        this.setState({ caughtError: true });
    }

    render(): ?React.Element<any> {
        const { caughtError } = this.state;
        const { data } = this.props;

        return (
            <React.Fragment>
                {this.props.children({ data, caughtError })}
            </React.Fragment>
        );
    }
}
