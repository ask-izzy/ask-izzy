/* @flow */

import React from "react";

import BaseQuestion from "./BaseQuestion";

import storage from "../../storage";
import components from "../../components";

export default class TextEntryQuestion extends BaseQuestion {
    static propTypes = BaseQuestion.propTypes;

    static defaultProps = {
        type: "text",
        placeholder: "",
        answers: [],
    };

    onNextStep(): void {
        storage.setItem(this.props.name, this.refs.input.value || "");
    }

    render(): ReactElement {
        return (
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            <components.LogoWithShadow />
                            {this.props.question}
                        </div>
                    }
                />
                <div className="List">
                    <components.TextInputListItem
                        showInput={true}
                        primaryText={this.props.placeholder}
                        {...this.props}
                        defaultValue={this.constructor.answer}
                        ref="input"
                    />
                </div>
            </div>
        );
    }
}
