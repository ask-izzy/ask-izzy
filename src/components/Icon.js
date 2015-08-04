/* @flow */
import React from "react";

export default class Icon extends React.Component {

    render(): React.Element {
        return (
            <i
                className="material-icons"
                style={{
                    marginLeft: "auto",
                }}
            >
                { this.props.iconCode }
            </i>
        );
    }

}
