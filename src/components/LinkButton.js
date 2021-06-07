/* @flow */

import * as React from "react";

import FlatButton from "./FlatButton";
import Link from "./Link";

export default class LinkButton extends Link {
    onClickHandlerFactory = () => {
        if (this.state.isInternal) {
            return () => {
                this.context.router.navigate(this.state.path)
            }
        } else {
            return () => {
                window.location = this.state.uri
            }
        }
    }

    render() {
        let {
            to,
            children,
            ...remainingProps
        } = this.props;

        return (
            <FlatButton
                onClick={this.onClickHandlerFactory()}
                {...(remainingProps: any)}
            >
                {children}
            </FlatButton>
        )
    }
}
