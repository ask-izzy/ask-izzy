/* @flow */

import React from "react";
import icons from "../icons";
import sendEvent from "../google-tag-manager";
import history from "../utils/history";

export default class DomesticViolenceLinkBar extends React.Component<{}, void> {

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

    onClickDVLink():void {
        const path = "/information";

        sendEvent({
            event: "clickedInformationBanner",
            banner: "Domestic violence - are you safe?",
        });

        history.push(
            path,
        );
    }

}
