/* @flow */

import React from "react";

import BaseQuestion from "./BaseQuestion";

import storage from "../../storage";
import components from "../../components";
import icons from "../../icons";

export default class TextEntryQuestion extends BaseQuestion {

    static defaultProps = {
        type: "text",
        placeholder: "",
        answers: [],
    };

    onDoneTouchTap(): void {
        storage.setItem(this.props.name, this.refs.input.value || "");
        this.nextStep();
    }

    onNextStep(): void {
        storage.setItem(this.props.name, this.state.selected || "");
    }

    render(): ReactElement {
        return (
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            <icons.LogoLight />
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
