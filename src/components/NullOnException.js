/* @flow */

import * as React from "react";

type Props = {
    children: Function,
    data: any,
}

type State = {
    caughtError: boolean,
}

export default class NullOnException extends React.Component<Props, State> {
    constructor(props: Props): void {
        super(props);

        this.state = {
            caughtError: false,
        };
    }

    componentDidCatch(error: any, info: any): void {
        console.log(`An error was caught: ${error}`);
        this.setState({ caughtError: true });
    }

    render(): ?React.Element<any> {
        if (this.state.caughtError) {
            return null;
        }

        try {
            return (
                <React.Fragment>
                    {this.props.children(this.props.data)}
                </React.Fragment>
            );
        } catch (exc) {
            console.log(
                `Returning nothing because an error occurred: ${exc}`
            );
        }
    }
}
