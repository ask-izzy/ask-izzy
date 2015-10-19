/* @flow */

import React from "react";

export default class InputListItem extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool,
        value: React.PropTypes.string,

        primaryText: React.PropTypes.node.isRequired,
        secondaryText: React.PropTypes.node,

        checkedIcon: React.PropTypes.node,
        uncheckedIcon: React.PropTypes.node,
    };

    // flow:disable not supported yet
    static defaultProps = {
        className: "",
    };

    // flow:disable not supported yet
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
                className={`ListItem has-left-icon ${className}`}
            >
                <div>
                    <div className="leftIcon">
                        {this.props.checked ? checkedIcon
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
