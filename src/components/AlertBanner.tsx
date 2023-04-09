import React, {ReactNode} from "react";
import classnames from "classnames";

import Chevron from "@/src/icons/Chevron.js";
import Warning from "@/src/icons/Warning.js";
import Info from "@/src/icons/Info.js";
import Summary from "@/src/components/base/Summary.js";
import type {AnalyticsEvent} from "@/src/google-tag-manager.js";


type Props = {
    title: ReactNode,
    body?: ReactNode,
    alertLevel: string,
    defaultToOpen?: boolean,
    analyticsEvent?: AnalyticsEvent,
}

export default function AlertBanner(
    props: Props,
) {
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
        <span
            className="title"
            aria-label={`${props.alertLevel} alert`}
        >
            <AlertLevelIcon className="inline-icon"
                aria-hidden="true"
            />
            <span className="text">{title}</span>
        </span>
    </>
    const containerClasses = classnames(
        "AlertBanner",
        props.alertLevel,
        {hasBody: props.body},
        {noBody: !props.body},
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
                    <div className="title-container">
                        {
                            /* wrapper for flex bug
                            https://github.com/philipwalton/
                            flexbugs#9-some-html-elements-cant-be-flex-containers */
                        }
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
