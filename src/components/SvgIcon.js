/* @flow */

import React from "react";

class SvgIcon extends React.Component {

    static defaultProps = {
        viewBox: "0 0 24 24",
    };

    static sampleProps = {
    };

    render(): ReactElement {
        const {
            children,
            viewBox,
            className,
            ...other,
        } = this.props;

        return (
            <svg
                className={`SvgIcon ${className || ""}`}
                viewBox={viewBox}
                {...other}
            >
                {children}
            </svg>
        );
    }
}

export default SvgIcon;
