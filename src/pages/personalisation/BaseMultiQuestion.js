/* @flow */

import React from "react";

import BaseQuestion from "./BaseQuestion";
import InputListItem from "../../components/InputListItem";
import HeaderBar from "../../components/HeaderBar";
import LogoWithShadow from "../../components/LogoWithShadow";
import FlatButton from "../../components/FlatButton";

import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";

class BaseMultiQuestion extends BaseQuestion {
    static propTypes = BaseQuestion.propTypes;

    renderDoneButton(): ?ReactElement {
        const label = (this.selected.size) ?
            "Done"
            : "None of these";

        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        label={label}
                        onClick={this.props.onDoneTouchTap}
                    />
                </div>
            </div>
        )
    }

    // flow:disable
    get selected(): Set<string> {
        return this.state.answers || new Set(
            storage.getJSON(this.props.name) || []
        );
    }

    // flow:disable
    static get summaryValue(): string {
        if (!this.answer) {
            return "None selected";
        } else {
            const nSelected = this.answer.length;

            if (nSelected == 0) {
                return "None selected";
            } else if (nSelected > 3) {
                return `${nSelected} selected`;
            } else {
                return this.answer.join(", ")
            }
        }
    }

    // flow:disable
    static get answer(): ?Array<string> {
        return storage.getJSON(this.defaultProps.name);
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        let value = this.answer;

        if (value != null) {
            return this.getSearchForAnswer(request, new Set(value));
        } else {
            // this question can't been answered
            return null;
        }
    }

    static getSearchForAnswer(
        request: iss.searchRequest,
        answers: Set<string>|string,
    ): ?iss.searchRequest {

        let search: ?iss.searchRequest = request;

        if (answers instanceof Set) {
            for (let answer of answers) {
                search = super.getSearchForAnswer(search || {}, answer);
            }
        } else {
            search = super.getSearchForAnswer(search || {}, answers);
        }

        return search;
    }

    iconFor(answer: string): ?ReactElement {
        if (this.props.icons && this.props.icons[answer]) {
            const Icon = this.props.icons[answer];

            return (
                <Icon
                    className="ColoredIcon small icon-fg-color"
                />
            );
        }
    }

    onAnswerTouchTap(answer: string, enabled: boolean): void {
        let answers = this.selected;

        if (enabled) {
            answers.add(answer);
        } else {
            answers.delete(answer);
        }

        this.setState({answers: answers});
    }

    onNextStep(): void {
        storage.setJSON(this.props.name, Array.from(this.selected));
    }

    render(): ReactElement {
        let selected = this.selected;

        return (
            <div className="BaseMultiQuestion">
                <HeaderBar
                    primaryText={
                        <div>
                            <LogoWithShadow />
                            {this.props.question}
                        </div>
                    }
                />
                <div className="List">
                    {this.answers.map((answer, index) =>
                        <InputListItem
                            key={index}
                            leftIcon={this.iconFor(answer)}
                            primaryText={answer}

                            type="checkbox"
                            checked={selected.has(answer)}
                            checkedIcon={
                                <icons.CheckboxSelected className="big" />
                            }
                            uncheckedIcon={
                                <icons.CheckboxUnselected className="big" />
                            }
                            onChange={this.onAnswerTouchTap.bind(
                                this, answer, !selected.has(answer)
                            )}
                        />
                    )}
                </div>
                {this.renderDoneButton()}
            </div>
        );
    }
}

export default BaseMultiQuestion;
