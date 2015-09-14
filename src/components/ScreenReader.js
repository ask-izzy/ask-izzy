/* @flow */
import React from "react";

class ScreenReader extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: {
        children: (
            <div>Screen reader content</div>
        ),
    },};

    render(): React.Element {
        return (
            <div
                className="ScreenReader"
            >
                {this.props.children}
            </div>
        );
    }

}

export default ScreenReader;
