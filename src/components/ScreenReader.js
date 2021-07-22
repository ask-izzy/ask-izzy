/* @flow */
import type {Element} from "React";
import React from "react";

class ScreenReader extends React.Component<{
    children?: any,
    ariaLabel?: ?string,
}, void> {
    static sampleProps: any = {default: {
        children: (
            <div>Screen reader content</div>
        ),
    }};

    render(): Element<"div"> {
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
