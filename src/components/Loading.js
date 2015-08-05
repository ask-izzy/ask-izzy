/* @flow */
import React from "react";
import Icon from "./icon";

var states = {
    loading: "&#xE629;",
    failed: "&#xE629;",
    complete: "&#xE876;",
}

export default class LoadingError extends React.Component {

    render(): React.Element {
        return (
            <Icon
                iconCode={ states[this.props.state] }
            />
        );
    }

}
