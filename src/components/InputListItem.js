/* @flow */

import React from "react";
import classnames from "classnames";

export default class InputListItem extends React.Component {
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool,
        value: React.PropTypes.string,

        primaryText: React.PropTypes.node.isRequired,
        secondaryText: React.PropTypes.node,

        checkedIcon: React.PropTypes.node,
        uncheckedIcon: React.PropTypes.node,
    };

    static defaultProps = {
        className: "",
    };

    static sampleProps = {
        default: {
            primaryText: "Primary Text",
            secondaryText: "Secondary Text",
            type: "radio",
        },
    };

    render(): ReactElement {
        let {
            className,
            primaryText,
            secondaryText,
            checkedIcon,
            uncheckedIcon,
            ...rest,
        } = this.props;

        return (
            <label
                className={classnames("ListItem", "has-left-icon", className)}
            >
                <div>
                    <div className="leftIcon">
                        {rest.checked ? checkedIcon
                        : uncheckedIcon}
                        <input {...rest} />
                    </div>
                    <div className="primaryText">
                        {primaryText}
                    </div>
                    <div className="secondaryText">
                        {secondaryText}
                    </div>
                </div>
            </label>
        )
    }
}
