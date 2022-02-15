/* @flow */

import * as React from "react";
import { Link as InternalLink } from "react-router-dom";
import classnames from "classnames";

import routerContext from "../../contexts/router-context";
import * as gtm from "../../google-tag-manager"
import type {AnalyticsEvent} from "../../google-tag-manager"

type Props = {
    to: string,
    children?: React.Node,
    className?: string,
    analyticsEvent?: AnalyticsEvent
}

type State = {
    isInternal: ?boolean,
    uri: string,
    protocol: ?string,
    domain: ?string,
    path: string,
    useRouterLinkElement: boolean,
}

export default class Link extends React.Component<Props, State> {
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
            useRouterLinkElement: props.to.startsWith("#") ?
                false
                : Boolean(!domain && path),
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
            analyticsEvent: additionalAnalyticsEventDetails,
            ...remainingProps
        } = this.props;

        function onClickHandler(
            event: SyntheticEvent<HTMLButtonElement>
        ): void {
            const linkType = this.state.isInternal ? "Internal" : "External"
            const linkText = event.currentTarget.innerText || "<no text>"
            const linkLocation = this.state.isInternal ?
                this.state.path
                : this.state.uri
            gtm.emit({
                event: `Link Followed - ${linkType}`,
                eventCat: "Link followed",
                eventAction: `Other ${linkType.toLowerCase()}`,
                eventLabel: `${linkText} - ${linkLocation}`,
                sendDirectlyToGA: true,
                ...additionalAnalyticsEventDetails,
            });
        }

        if (this.state.useRouterLinkElement) {
            return (
                <InternalLink
                    to={this.props.to}
                    {...(remainingProps: any)}
                    onClick={onClickHandler.bind(this)}
                    className={classnames(
                        "Link",
                        this.state.isInternal ? "internal" : "external",
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
                onClick={onClickHandler.bind(this)}
                className={classnames(
                    "Link",
                    this.state.isInternal ? "internal" : "external",
                    className,
                )}
            >
                {children}
            </a>
        )
    }
}
