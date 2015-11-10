/* @flow */
import React from "react";
import icons from "../icons";

export default class BrandedHeader extends React.Component {

    render(): ReactElement {
        return (
            <div className="BrandedHeader">
                <div className="logo">
                    <icons.Logotype
                        role="img"
                        aria-label="Ask Izzy"
                    />
                </div>

                <p className="branding-copy">
                    The A to Z directory of
                    homeless help information
                </p>
            </div>
        );
    }
}
