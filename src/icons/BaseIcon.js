/* @flow */

import * as React from "react";
import classnames from "classnames";

type Props = {|
    iconClass: string,
    className?: string,
    containerClassName?: string,
|}

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
        let {
            className,
            iconClass,
            containerClassName,
            ...parentProps
        } = this.props;

        containerClassName = "icon" +
            (containerClassName ? " " + containerClassName : "")

        return (
            <span
                className={containerClassName}
                {...parentProps}
                dangerouslySetInnerHTML={{__html: this.svgContent}}
            />
        );
    }
}

export default BaseIcon;
