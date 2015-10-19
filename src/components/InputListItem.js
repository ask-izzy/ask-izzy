/* @flow */

import React from "react";

export default class InputListItem extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool,
        value: React.PropTypes.string,

        primaryText: React.PropTypes.string,
        secondaryText: React.PropTypes.string,

        checkedIcon: React.PropTypes.node,
        uncheckedIcon: React.PropTypes.node,
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
