/* @flow */

import * as React from "react";
import classnames from "classnames";

type Props = {
    iconClass: string,
    className?: string,
}

class BaseIcon extends React.Component<Props, void> {
    +svgContent: string;

    get classNames() {
        return classnames(
            this.props.iconClass,
            "disallow-override-color",
            "Icon",
            "SvgIcon",
            this.props.className
        )
    }

    render() {
        let parentProps = Object.assign(
            {},
            this.props,
            {
                className: undefined,
                iconClass: undefined,
            }
        );

        return (
            <span
                {...parentProps}
                dangerouslySetInnerHTML={{__html: this.svgContent}}
            />
        );
    }
}

export default BaseIcon;
