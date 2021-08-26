/* @flow */

import * as React from "react";
import classnames from "classnames";

import Chevron from "../icons/Chevron";
import Warning from "../icons/Warning";
import Info from "../icons/Info";
import Summary from "./base/Summary";
import type {AnalyticsEvent} from "../google-tag-manager";

type Props = {
    title: React.Node,
    body?: React.Node,
    alertLevel: string,
    defaultToOpen?: boolean,
    analyticsEvent?: AnalyticsEvent
}

export default function AlertBanner(
    props: Props
): React.Element<"details"> | React.Element<"div"> {
    let AlertLevelIcon
    let title = props.title
    if (props.alertLevel === "warn") {
        AlertLevelIcon = Warning
    } else if (props.alertLevel === "info") {
        AlertLevelIcon = Info
    } else {
        AlertLevelIcon = Warning
        title = <>{title} [invalid alert level]</>
    }
    const titleContents = <>
        <span className="title">
            <AlertLevelIcon className="inline-icon" />
            <span className="text">{title}</span>
        </span>
    </>
    const containerClasses = classnames(
        "AlertBanner",
        props.alertLevel,
        {hasBody: props.body},
        {noBody: !props.body}
    )

    if (props.body) {
        return (
            <details className={containerClasses}
                open={props.defaultToOpen}
            >
                <Summary
                    analyticsEvent={{
                        event: `Action Triggered - Alert`,
                        eventAction: "Show alert body",
                        eventLabel: null,
                        ...props.analyticsEvent,
                    }}
                >
                    <div className="title-container"> {/* wrapper for flex bug https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers */}
                        { titleContents }
                        <Chevron />
                    </div>
                </Summary>
                <div className="body">
                    { props.body }
                </div>
            </details>
        )
    } else {
        return <div className={containerClasses}>
            <div className={"title-container"}>
                { titleContents }
            </div>
        </div>
    }
}
