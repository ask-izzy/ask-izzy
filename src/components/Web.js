/* @flow */
import React from "react";
import URL from "url";

export default class Web extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: {url: "https://example.com/landingPage"}};

    render(): ReactElement {
        let url = URL.parse(this.props.url);

        return (
            <div className="Contact Web">
                <a href={url.href}>
                    <span className="web">
                        {url.hostname}
                        {url.path == "/" ? "" : url.path}
                    </span>
                </a>
            </div>
        );
    }
}
