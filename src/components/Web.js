/* @flow */
import React from "react";
import URL from "url";

import Link from "./Link";
import icons from "../icons";
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
                <Link
                    to={url.href}
                    onClick={this.recordClick.bind(this)}
                    hideExternalLinkIcon={true}
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
                        <icons.ExternalLink
                            containerClassName="ExternalLinkIcon"
                        />
                    </div>
                </Link>
            </div>
        );
    }
}
