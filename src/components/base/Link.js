/* @flow */

import * as React from "react";
import InternalLink from "next/link";
import classnames from "classnames";

import * as gtm from "../../google-tag-manager"
import type {AnalyticsEvent} from "../../google-tag-manager"

type Props = {
    to: string,
    children?: React.Node,
    className?: string,
    analyticsEvent?: AnalyticsEvent,
    onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void
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
    constructor(props: Object) {
        super(props);
        const {
            protocol,
            domain,
            path,
        } = getUriParts(this.props.to)

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

        function getUriParts(uri: string): {|
            domain: null | string,
            path: string,
            protocol: null | string
        |} {
            const [, protocol, domain, path] =
                    // urls
                    props.to.match(/^([^/]*)\/\/([^/]+)(.*)/) ||
                    // non-url uri's like mailto
                    (props.to.match(/^[^/]+:/) && [props.to]) ||
                    // just a path
                    [null, null, null, props.to]

            return {
                protocol,
                domain,
                path,
            }
        }
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

    render(): React.Node | React.Element<"a"> {
        let {
            to,
            children,
            className,
            analyticsEvent: additionalAnalyticsEventDetails,
            onClick: onClickProp,
            ...remainingProps
        } = this.props;

        function onClickHandler(
            event: SyntheticEvent<HTMLAnchorElement>
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
            onClickProp?.(event)
        }

        if (this.state.useRouterLinkElement) {
            return (
                <InternalLink
                    href={this.props.to}
                >
                    <a
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
