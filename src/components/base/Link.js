/* @flow */

import * as React from "react";
import { Link as InternalLink } from "react-router-dom";
import classnames from "classnames";

import routerContext from "../../contexts/router-context";

type Props = {
    to: string,
    children?: React.Node,
    className?: string
}

type State = {
    isInternal: ?boolean,
    uri: string,
    protocol: ?string,
    domain: ?string,
    path: ?string,
}

export default class Link extends React.Component<Props, State> {
    static sampleProps: any = {
        default: {
            to: "/",
            children: "Homepage",
        },
    };

    static contextType: any = routerContext;

    constructor(props: Object) {
        super(props);
        const {
            protocol,
            domain,
            path,
        } = this.getUriParts(this.props.to)

        this.state = {
            protocol,
            domain,
            path,
            uri: props.to,
            isInternal: Boolean(!domain && path),
        };
    }

    componentDidMount(): void {
        // When statically rendered we don't know the current domain so we make
        // our best guess (if path with no domain then internal, otherwise is
        // external) and then confirm after mounted.
        const isInternal = Boolean(
            (
                this.state.domain === window.location.hostname &&
                (
                    !this.state.protocol ||
                    this.state.protocol === window.location.protocol
                )
            ) ||
            (!this.state.domain && this.state.path)
        )
        this.setState({
            isInternal,
        });
    }

    getUriParts: (
        (uri: string) => {|
            domain: null | string,
            path: string,
            protocol: null | string
        |}
    ) = (uri: string) => {
        const [, protocol, domain, path] =
                // urls
                this.props.to.match(/^([^/]*)\/\/([^/]+)(.*)/) ||
                // non-url uri's like mailto
                (this.props.to.match(/^[^/]+:/) && [this.props.to]) ||
                // just a path
                [null, null, null, this.props.to]

        return {
            protocol,
            domain,
            path,
        }
    }

    render(): React.Node | React.Element<"a"> {
        let {
            to,
            children,
            className,
            ...remainingProps
        } = this.props;

        if (this.state.isInternal) {
            return (
                <InternalLink
                    to={this.props.to}
                    {...(remainingProps: any)}
                    className={classnames(
                        "Link internal",
                        className,
                    )}
                >
                    {children}
                </InternalLink>
            )
        }

        return (
            <a
                href={this.state.uri}
                rel="noopener noreferrer"
                {...(remainingProps: any)}
                className={classnames(
                    "Link external",
                    className,
                )}
            >
                {children}
            </a>
        )
    }
}
