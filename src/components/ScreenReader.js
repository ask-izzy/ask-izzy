/* @flow */
import React from "react";

class ScreenReader extends React.Component<{
    children?: any,
    ariaLabel?: ?string,
}, void> {
    static sampleProps = {default: {
        children: (
            <div>Screen reader content</div>
        ),
    }};

    render() {
        return (
            <div
                aria-label={this.props.ariaLabel}
                className="ScreenReader"
            >
                {this.props.children}
            </div>
        );
    }
}

export default ScreenReader;
