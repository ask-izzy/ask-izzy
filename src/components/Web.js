/* @flow */
import React from "react";
import URL from "url";
import { titleize } from "underscore.string";

import Icons from "../icons";
import fixtures from "../../fixtures/services";

export default class Web extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.emails[0]};

    render(): React.Element {
        var url = URL.parse(this.props.url);

        return (
            <div className="Contact Web">
                <a href={url.href}>
                    <span className="web">
                        {url.hostname}
                        {url.path == '/' ? '' : url.path}
                    </span>
                </a>
            </div>
        );
    }
}
