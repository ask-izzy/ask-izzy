/* @flow */
import React from "react";

class ScreenReader extends React.Component<{
    children?: any,
}, void> {
    static sampleProps = {default: {
        children: (
            <div>Screen reader content</div>
        ),
    }};

    render() {
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
