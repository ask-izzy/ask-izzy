/* @flow */

import * as React from "react";
import classnames from "classnames";

type Props = {
    iconClass?: string,
    className?: string,
    viewBox?: string,
    containerClassName?: string,
    fill?: string,
}

class BaseIcon extends React.Component<Props, void> {
    +svgContent: string;

    get classNames(): any {
        return classnames(
            this.props.iconClass,
            "disallow-override-color",
            "Icon",
            "SvgIcon",
            this.props.className
        )
    }


    render(): React.Element<"span"> {
        let {
            className,
            iconClass,
            viewBox,
            containerClassName,
            fill,
            ...parentProps
        } = this.props;

        containerClassName = "icon" +
            (containerClassName ? " " + containerClassName : "")

        return (
            <span
                {...parentProps}
                className={containerClassName}
                dangerouslySetInnerHTML={{__html: this.svgContent}}
            />
        );
    }
}

export default BaseIcon;
