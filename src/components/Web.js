/* @flow */
import React from "react";
import URL from "url";
import Website from "../icons/website.svg";
import sendEvent from "../google-tag-manager";

export default class Web extends React.Component<{url: string}, void> {
    static sampleProps = {default: {url: "https://ExampleDomain.com/landingPage"}};

    recordClick(): void {
        sendEvent({
            event: "clickServiceWebsite",
            url: this.props.url,
        });
    }

    render() {
        let url = URL.parse(this.props.url);

        return (
            <div className="Contact Web">
                <a
                    href={url.href}
                    onClick={this.recordClick.bind(this)}
                >
                    <Website />
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
