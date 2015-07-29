/* @flow */
import React from "react";

export default class Chevron extends React.Component {

    render(): React.Element {
        return (
            <i
                className="material-icons"
                style={{
                    marginLeft: "auto",
                }}
            >
                {/* icon: chevron_right */}
                &#xE5CC;
            </i>
        );
    }

}
