/* @flow */

import React from "react";
import classnames from "classnames";

class SvgIcon extends React.Component {
    props: Object;
    state: void;

    static defaultProps = {
        viewBox: "0 0 24 24",
    };

    static sampleProps = {
    };

    render() {
        const {
            children,
            viewBox,
            className,
            ...other,
        } = this.props;

        return (
            <svg
                className={classnames("SvgIcon", className)}
                viewBox={viewBox}
                {...other}
            >
                {children}
            </svg>
        );
    }
}

export default SvgIcon;
