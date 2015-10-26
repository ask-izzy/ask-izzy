/* @flow */

import React from "react";

export default class TextInputListItem extends React.Component {
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        value: React.PropTypes.string,
    };

    static defaultProps = {
        type: "text",
    };

    static sampleProps = {
        default: {
            placeholder: "Placeholder Text",
            value: "",
        },
    };

    // flow:disable not supported yet
    get value(): string {
        return this.refs.input.value || "";
    }

    render(): ReactElement {
        let {
            className,
            ...rest,
        } = this.props;

        return (
            <label
                className={`ListItem TextInputListItem ${className}`}
            >
                <div>
                    <input
                        ref="input"
                        {...rest}
                    />
                </div>
            </label>
        )
    }
}
