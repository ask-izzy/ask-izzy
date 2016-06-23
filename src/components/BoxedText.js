/* @flow */

import React from "react";

export default class BoxedText extends React.Component {
    props: {children?: any};
    state: {};

    render() {
        return (
            <div className="BoxedText">
                <div className="BoxedText-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
