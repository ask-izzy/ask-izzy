/* @flow */

import React from "react";
import classnames from "classnames";

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
