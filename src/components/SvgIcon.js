/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import classnames from "classnames";

class SvgIcon extends React.Component<{
    className?: string,
    viewBox?: string,
    children?: any,
}, void> {
    static defaultProps: any = {
        viewBox: "0 0 24 24",
    };

    static sampleProps: any = {
    };

    render(): ReactElement<"svg"> {
        const {
            children,
            viewBox,
            className,
            ...other
        } = this.props;

        return (
            <svg
                className={classnames("SvgIcon", className)}
                viewBox={viewBox}
                {...(other: any)}
            >
                {children}
            </svg>
        );
    }
}

export default SvgIcon;
