/* @flow */

import * as React from "react";
import { Link as InternalLink } from "react-router-dom";
import classnames from "classnames";

import icons from "../icons";

import routerContext from "../contexts/router-context";

type Props = {
    to: string,
    hideExternalLinkIcon?: boolean,
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
    static sampleProps = {
        default: {
            to: "/",
            children: "Homepage",
        },
    };

    static contextType = routerContext;

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

    getUriParts = (uri: string) => {
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

    showExternalLinkIcon() {
        return Boolean(
            !this.state.isInternal && !this.props.hideExternalLinkIcon
        )
    }

    render() {
        let {
            to,
            children,
            hideExternalLinkIcon,
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
        } else {
            return (
                <a
                    href={this.state.uri}
                    rel="noopener noreferer"
                    {...(remainingProps: any)}
                    className={classnames(
                        "Link external",
                        className,
                    )}
                >
                    {children}
                    {this.showExternalLinkIcon() &&
                        <icons.ExternalLink
                            containerClassName="ExternalLinkIcon"
                        />
                    }
                </a>
            )
        }
    }
}
