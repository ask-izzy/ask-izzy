/* @flow */

"use strict";

import React from 'react';
import mui from "material-ui";

import BaseQuestion from './BaseQuestion';
import components from '../../components';
import icons from '../../icons';
import storage from '../../storage';
import * as iss from '../../iss';

class BaseMultiQuestion extends BaseQuestion {
    constructor(props: Object) {
        super(props);
        this.state = {
            answers: new Set(),
        };
    }

    // flow:disable
    static get summaryValue(): string {
        var nSelected =
            (storage.getJSON(this.defaultProps.name) || []).length;
        return `${nSelected} selected`;
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        var value = storage.getJSON(this.defaultProps.name);

        if (value != null) {
            return this.getSearchForAnswers(request, value);
        } else {
            // this question can't been answered
            return null;
        }
    }

    static getSearchForAnswers(
        request: iss.searchRequest,
        answers: Array<string>
    ): ?iss.searchRequest {
        return request;
    }

    componentDidMount(): void {
        var answers = new Set(storage.getJSON(this.props.name));
        this.setState({answers: answers});
    }

    onAnswerTouchTap(answer: string, enabled: boolean): void {
        var answers = this.state.answers;

        if (enabled) {
            answers.add(answer);
        } else {
            answers.delete(answer);
        }

        this.setState({answers: answers});
    }

    onDoneTouchTap(): void {
        storage.setJSON(this.props.name, Array.from(this.state.answers));
        this.nextStep();
    }

    render(): React.Element {
        var selected = this.state.answers;

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
                {this.props.answers.map((answer, index) =>
                    <mui.ListItem
                        key={index}
                        primaryText={answer}
                        leftCheckbox={
                            <mui.Checkbox
                                checked={selected.has(answer)}
                                checkedIcon={<icons.CheckboxSelected />}
                                unCheckedIcon={<icons.CheckboxUnselected />}
                                onCheck={this.onAnswerTouchTap.bind(
                                    this, answer, !selected.has(answer)
                                )}
                            />
                        }
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    />)}

                <div className="done-button">
                    <mui.FlatButton
                        label="Done"
                        onTouchTap={this.onDoneTouchTap.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default BaseMultiQuestion;
