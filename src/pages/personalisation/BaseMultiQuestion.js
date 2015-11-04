/* @flow */

import React from "react";

import BaseQuestion from "./BaseQuestion";
import components from "../../components";
import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";

class BaseMultiQuestion extends BaseQuestion {
    constructor(props: Object) {
        super(props);
        this.state = {
            answers: new Set(),
        };
    }

    componentDidMount(): void {
        let answers = new Set(storage.getJSON(this.props.name));

        this.setState({answers: answers});
    }

    // flow:disable
    static get summaryValue(): string {
        let nSelected =
            (storage.getJSON(this.defaultProps.name) || []).length;

        return `${nSelected} selected`;
    }

    // flow:disable
    static get answer(): Array<string> {
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

    onAnswerTouchTap(answer: string, enabled: boolean): void {
        let answers = this.state.answers;

        if (enabled) {
            answers.add(answer);
        } else {
            answers.delete(answer);
        }

        this.setState({answers: answers});
    }

    onNextStep(): void {
        storage.setJSON(this.props.name, Array.from(this.state.answers));
    }

    render(): ReactElement {
        let selected = this.state.answers;

        return (
            <div className="BaseMultiQuestion">
                <components.HeaderBar
                    primaryText={
                        <div>
                            <icons.LogoLight />
                            {this.props.question}
                        </div>
                    }
                >
                </components.HeaderBar>
                <div className="List">
                    {this.answers.map((answer, index) =>
                        <components.InputListItem
                            key={index}
                            primaryText={answer}

                            type="checkbox"
                            checked={selected.has(answer)}
                            checkedIcon={<icons.CheckboxSelected />}
                            uncheckedIcon={<icons.CheckboxUnselected />}
                            onChange={this.onAnswerTouchTap.bind(
                                this, answer, !selected.has(answer)
                            )}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default BaseMultiQuestion;
