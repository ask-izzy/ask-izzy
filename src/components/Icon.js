/* @flow */
import React from "react";

var codes = {
    chevronRight: "&#xE5CC;",
};

export default class Icon extends React.Component {

    render(): React.Element {
        return (
            <i
                className="material-icons"
                style={{
                    marginLeft: "auto",
                }}
                dangerouslySetInnerHTML={{
                    __html: codes[this.props.iconName],
                }}
            >
            </i>
        );
    }

}
