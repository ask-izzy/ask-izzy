import React, {ReactNode} from "react"

import Link from "@/src/components/base/Link.js"
import type {AnalyticsEvent} from "@/src/google-tag-manager.js"

type Props = {
    icon: ReactNode,
    header: string,
    body: string,
    highlightColor: string,
    path: string,
    learnMoreLink?: string,
    analyticsEvent?: AnalyticsEvent,
}

export default function LogoWithTextBox(props: Props) {
    return (
        <Link
            to={props.path}
            analyticsEvent={props.analyticsEvent}
            aria-label={props.learnMoreLink || "Learn More"}
            className={"LogoWithTextBoxContainer"}
        >
            <div
                className={"LogoWithTextBox"}
            >
                <div className={"Icon"}>
                    <div
                        className={"IconBorder"}
                        style={{
                            backgroundColor: props.highlightColor,
                        }}
                    >
                        { props.icon }
                    </div>
                </div>
                <div className={"Content"}>
                    <div className={"Header"}>
                        { props.header }
                    </div>
                    <div className={"Instruction"}>
                        { props.body }
                    </div>
                    <span className="showAsLink">
                        {props.learnMoreLink || "Learn More"}
                        <div
                            aria-hidden="true"
                            className={"Chevron"}
                        >
                            &nbsp;&gt;
                        </div>
                    </span>
                </div>
            </div>
        </Link>
    );
}
