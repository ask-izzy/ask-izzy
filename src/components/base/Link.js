/* @flow */

import * as React from "react";
import { useState, useEffect } from "react";
import type {Node as ReactNode} from "React";
import InternalLink from "next/link";
import classnames from "classnames";

import * as gtm from "../../google-tag-manager"
import type {AnalyticsEvent} from "../../google-tag-manager"

type Props = {
    to: string,
    children?: React.Node,
    className?: string,
    analyticsEvent?: AnalyticsEvent,
    onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void,
    remainingProps?: any,
}

function Link({
    to,
    children,
    className,
    analyticsEvent,
    onClick,
    ...remainingProps
}: Props): ReactNode {
    const {
        protocolInitialValue,
        domainInitialValue,
        pathInitialValue,
    } = getUriParts(to)

    const [protocol] = useState(protocolInitialValue)
    const [domain] = useState(domainInitialValue)
    const [path] = useState(pathInitialValue)
    const [uri] = useState(to)
    const [isInternal, setIsInternal] = useState(
        Boolean(!domain && path)
    )
    const [useRouterLinkElement] = useState(
        to.startsWith("#") ? false : Boolean(!domain && path)
    )

    useEffect(() => {
        // When statically rendered we don't know the current domain so we make
        // our best guess (if path with no domain then internal, otherwise is
        // external) and then confirm after mounted.
        const isInternalValue = Boolean(
            (
                domain === window.location.hostname &&
                (
                    !protocol ||
                    protocol === window.location.protocol
                )
            ) ||
            (!domain && path)
        )
        setIsInternal(isInternalValue)
    }, [])

    function getUriParts(uri: string): {
        domainInitialValue: null | string,
        pathInitialValue: string,
        protocolInitialValue: null | string
    } {
        const [, protocolInitialValue, domainInitialValue, pathInitialValue] =
                // urls
                to.match(/^([^/]*)\/\/([^/]+)(.*)/) ||
                // non-url uri's like mailto
                (to.match(/^[^/]+:/) && [to]) ||
                // just a path
                [null, null, null, to]

        return {
            protocolInitialValue,
            domainInitialValue,
            pathInitialValue,
        }
    }

    function onClickHandler(
        event: SyntheticEvent<HTMLAnchorElement>
    ): void {
        const linkType = isInternal ? "Internal" : "External"
        const linkText = event.currentTarget.innerText || "<no text>"
        const linkLocation = isInternal ? path : uri
        gtm.emit({
            event: `Link Followed - ${linkType}`,
            eventCat: "Link followed",
            eventAction: `Other ${linkType.toLowerCase()}`,
            eventLabel: `${linkText} - ${linkLocation}`,
            sendDirectlyToGA: true,
            ...analyticsEvent,
        });
        onClick?.(event)
    }

    if (useRouterLinkElement) {
        return (
            <InternalLink
                href={to}
            >
                <a
                    {...(remainingProps: any)}
                    onClick={onClickHandler.bind(this)}
                    className={classnames(
                        "Link",
                        isInternal ? "internal" : "external",
                        className,
                    )}
                    {...(remainingProps: any)}
                >
                    {children}
                </a>
            </InternalLink>
        )
    }

    return (
        <a
            href={uri}
            rel="noopener noreferrer"
            onClick={onClickHandler.bind(this)}
            className={classnames(
                "Link",
                isInternal ? "internal" : "external",
                className,
            )}
            {...(remainingProps: any)}
        >
            {children}
        </a>
    )
}

export default Link