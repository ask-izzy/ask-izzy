/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import parse from "html-react-parser";
import classnames from "classnames";


class BaseIcon extends React.Component {
    svgContent = ""
    constructor(props) {
        super()
        this.props = props
    }

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
            viewBox,
            containerClassName,
            fill,
            noSpanWrapper,
            ...parentProps
        } = this.props;

        containerClassName = "icon" +
            (containerClassName ? " " + containerClassName : "")

        // Wrapping the svg in a span makes styling a headache in a lot of places.
        // I'd like to just stop doing that altogether and allow the consumer to add
        // a span wrapper in the few places where desired (not sure why you would
        // over just setting "display: inline" on the svg but maybe there's uses I'm
        // not thinking of). If we change that behaviour tho we have to update every
        // -where in izzy that uses an icon. To make transitioning easier we can use
        // a prop to specify that we don't want a wrapper so we can tackle updating
        // one instance at a time. When all icons are transitioned we can remove this
        // prop and just default to no using a wrapper.
        if (noSpanWrapper) {
            return parse(this.svgContent)
        }

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
