/* @flow */

import * as React from "react";

import Chevron from "../icons/Chevron";
import Warning from "../icons/Warning";
import Info from "../icons/Info";

type Props = {
    title: React.Node,
    body?: React.Node,
    alertLevel: string,
    defaultToOpen: boolean
}

export default function AlertBanner(props: Props) {
    let AlertLevelIcon
    if (props.alertLevel === "warn") {
        AlertLevelIcon = Warning
    } else if (props.alertLevel === "info") {
        AlertLevelIcon = Info
    } else {
        AlertLevelIcon = Warning
        props.title = <>{props.title} [invalid alert level]</>
    }
    const titleContents = <>
        <span className="title">
            <AlertLevelIcon className="inline-icon" />
            <span className="text">{props.title}</span>
        </span>
    </>
    const containerClasses = `AlertBanner ${props.alertLevel}`

    if (props.body) {
        return (
            <details className={containerClasses}
                open={props.defaultToOpen}
            >
                <summary className="title-container">
                    { titleContents }
                    <Chevron />
                </summary>
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
