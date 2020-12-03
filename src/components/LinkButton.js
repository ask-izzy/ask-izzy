/* @flow */

import * as React from "react";

import FlatButton from "./FlatButton";

import routerContext from "../contexts/router-context";

type Props = {
    to: string,
    children?: React.Node,
}

export default class LinkButton extends React.Component<Props, void> {
    static sampleProps = {
        default: {
            to: "/",
            children: "Homepage",
        },
    };

    static contextType = routerContext;

    getOnClickHandler = () => {
        const [uri, protocol, domain, path] =
            // urls
            this.props.to.match(/^([^/]*)\/\/([^/]+)(.*)/) ||
            // non-url uri's like mailto
            (this.props.to.match(/^[^/]+:/) && [this.props.to]) ||
            // just a path
            [this.props.to, null, null, this.props.to]
        const isInternalUrl =
            (!domain || domain === window.location.hostname) &&
            (!protocol || protocol === window.location.protocol) &&
            path

        if (isInternalUrl) {
            return () => {
                this.context.router.history.push(path)
            }
        } else {
            return () => {
                window.location = uri
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
                onClick={this.getOnClickHandler()}
                {...(remainingProps: any)}
            >
                {children}
            </FlatButton>
        )
    }
}
