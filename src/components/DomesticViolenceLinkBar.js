/* @flow */

import React from "react";
import icons from "../icons";
import * as gtm from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class DomesticViolenceLinkBar extends React.Component<{}, void> {
    static contextType = routerContext;

    render() {

        return (
            <div
                className="DomesticViolenceLinkBar"
                onClick={this.onClickDVLink.bind(this)}
            >
                <div className="leftIcon">
                    <icons.Book />
                </div>
                <div className="primaryText">
                    Read more about family and domestic violence
                </div>
                <div className="rightIcon">
                    <icons.Chevron />
                </div>
            </div>
        );
    }

    onClickDVLink(): void {
        const path = "/information";

        gtm.emit({
            event: "DV Banner Clicked",
            eventCat: "Banner Clicked",
            eventAction: "Domestic Violence Information",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        });

        this.context.router.history.push(
            path,
        );
    }

}
