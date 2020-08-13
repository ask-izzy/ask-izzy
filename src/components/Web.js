/* @flow */
import React from "react";
import URL from "url";
import icons from "../icons";
import * as gtm from "../google-tag-manager";
import type {AnalyticsEvent} from "../google-tag-manager";

type Props = {
    url: string,
    analyticsEventDetails?: AnalyticsEvent
}
export default class Web extends React.Component<Props, void> {
    static sampleProps = {default: {url: "https://ExampleDomain.com/landingPage"}};

    recordClick(): void {
        gtm.emit({
            event: "clickServiceWebsite",
            url: this.props.url,
        });

        const event = Object.assign({}, {
            event: "Website Address Clicked",
            eventCat: "Website Address Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${this.props.url}`,
            sendDirectlyToGA: true,
        }, this.props.analyticsEventDetails)

        gtm.emit(event, "GTM-54BTPQM");
    }

    render() {
        let url = URL.parse(this.props.url);

        return (
            <div className="Contact Web">
                <a
                    href={url.href}
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
                </a>
            </div>
        );
    }
}
