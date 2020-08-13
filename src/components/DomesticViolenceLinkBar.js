/* @flow */

import React from "react";
import icons from "../icons";
import PropTypes from "proptypes";
import * as gtm from "../google-tag-manager";

export default class DomesticViolenceLinkBar extends React.Component<{}, void> {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

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
            event: "clickedInformationBanner",
            banner: "Domestic violence - are you safe?",
        });

        gtm.emit({
            event: "DV Banner Clicked",
            eventCat: "Banner Clicked",
            eventAction: "Domestic Violence Information",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        }, "GTM-54BTPQM");

        this.context.router.push(
            path,
        );
    }

}
