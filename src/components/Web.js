/* @flow */
import type {Element as ReactElement} from "React";
import React from "react";
import URL from "url";

import Link from "./base/Link";
import icons from "../icons";
import * as gtm from "../google-tag-manager";
import type {AnalyticsEvent} from "../google-tag-manager";

type Props = {
    url: string,
    analyticsEventDetails?: AnalyticsEvent
}
export default class Web extends React.Component<Props, void> {
    static sampleProps: any = {default: {url: "https://ExampleDomain.com/landingPage"}};

    recordClick(): void {
        gtm.emit({
            event: "Website Address Clicked",
            eventCat: "Website Address Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${this.props.url}`,
            sendDirectlyToGA: true,
            ...this.props.analyticsEventDetails,
        });
    }

    render(): ReactElement<"div"> {
        let url = URL.parse(this.props.url);

        return (
            <div className="Contact Web">
                <Link
                    to={url.href}
                    onClick={this.recordClick.bind(this)}
                >
                    <icons.Website />
                    <div className="Contact-text">
                        <span className="kind">
                            {" "}
                        </span>
                        <span className="web value">
                            {url.hostname}
                            {url.path === "/" ? "" : url.path}
                        </span>
                    </div>
                </Link>
            </div>
        );
    }
}
