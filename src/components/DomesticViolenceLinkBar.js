/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import icons from "../icons";
import * as gtm from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class DomesticViolenceLinkBar extends React.Component<{}, void> {
    static contextType: any = routerContext;

    render(): ReactElement<"div"> {

        return (
            <div
                className="DomesticViolenceLinkBar"
                onClick={this.onClickDVLink.bind(this)}
                tabIndex="0"
            >
                <div className="leftIcon">
                    <icons.Book />
                </div>
                <div className="primaryText">
                    Read more about family and domestic violence.
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

        this.context.router.navigate(
            path,
        );
    }

}
