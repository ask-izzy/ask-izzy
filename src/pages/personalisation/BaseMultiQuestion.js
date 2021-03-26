/* @flow */

import * as React from "react";
import classnames from "classnames";
import _ from "underscore";

import ReactDOM from "react-dom";

import BaseQuestion from "./BaseQuestion";
import InputListItem from "../../components/InputListItem";
import HeaderBar from "../../components/HeaderBar";
import FlatButton from "../../components/FlatButton";
import WithStickyFooter from "../../components/WithStickyFooter";

import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";

class BaseMultiQuestion extends BaseQuestion {
    static propTypes = BaseQuestion.propTypes;

    renderDoneButton(): ?React.Element<any> {
        const label = (this.selected.size) ?
            "Done"
            : "None of these";

        return (
            <WithStickyFooter
                includeOffsetElement={true}
            >
                <div className="done-button">
                    <FlatButton
                        tabIndex={
                            (this.state.tabIndex + this.answers.length) + 1
                        }
                        label={label}
                        onClick={this.props.onDoneTouchTap}
                    />
                </div>
            </WithStickyFooter>
        )
    }

    // $FlowIgnore we have the liskov substitution principle :(
    get selected(): Set<string> {
        if (this.state.answers) {
            return this.state.answers;
        }

        return new Set(
            this.constructor.answer || []
        );
    }

    static showPage(): boolean {
        return true;
    }

    static breadcrumbAnswer(): ?$ReadOnlyArray<string | React.Node> {
        return this.answer
    }

    static breadcrumbToStandardAnswer(breadcrumbAnswer?: ?Array<any>): string {
        return "";
    }

    static get summaryValue(): string {
        if (!this.answer) {
            return "None selected";
        } else {
            const nSelected = this.answer.length;

            if (nSelected === 0) {
                return "None selected";
            } else if (nSelected > 3) {
                return `${nSelected} selected`;
            } else {
                return this.answer.join(", ")
            }
        }
    }

    // $FlowIgnore we have the liskov substitution principle :(
    static get answer(): ?Array<string> {
        let answers = storage.getJSON(this.defaultProps.name);

        if (Array.isArray(answers)) {
            // Update answers if we had stored an old answer
            answers = answers.map((answer) =>
                this.defaultProps.oldAnswers[answer] || answer
            )
            return _.union(this.defaultProps.answers.keys, answers);
        }

        return answers;
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
            // Take the first two answers offered
            const allowedAnswers = Object.keys(this.defaultProps.answers);
            const sortedAnswers = _(Array.from(answers)).sortBy((elem) =>
                allowedAnswers.indexOf(elem)
            );

            for (let answer of sortedAnswers.slice(0, 2)) {
                search = super.getSearchForAnswer(
                    search || {},
                    answer
                );
            }
        } else {
            search = super.getSearchForAnswer(search || {}, answers);
        }

        return search;
    }

    iconFor(answer: string): ?React.Element<any> {
        if (this.props.icons && this.props.icons[answer]) {
            const Icon = this.props.icons[answer];

            return (
                <Icon
                    className="ColoredIcon big icon-fg-color"
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

    componentDidMount(): void {
        this.setState({windowHeight: window.innerHeight});
        const thisElement = ReactDOM.findDOMNode(this);

        // $FlowIgnore
        this.setState({rootHeight: thisElement.offsetHeight});
    }

    render() {
        let selected = this.selected;
        return (
            <div
                className={
                    classnames(
                        "BaseMultiQuestion",
                        this.props.classNames
                    )
                }
            >
                <HeaderBar
                    primaryText={
                        <div>
                            {this.props.question}
                        </div>
                    }
                    secondaryText={
                        this.props.byline
                    }
                    taperColour="LighterGrey"
                    bannerName={this.bannerName}
                />
                <div className="List">
                    <QuestionStepper
                        category={getCategory(
                            this.context.router.match.params.page
                        )}
                        listFocused={this.state.listFocused}
                        onTabIndex={(tabIndex) =>
                            this.setState({tabIndex})
                        }
                    />
                    {this.answers.map((answer, index) =>
                        <InputListItem
                            key={index}
                            leftIcon={this.iconFor(answer)}
                            primaryText={answer}
                            value={answer}
                            tabIndex={this.state.tabIndex + (index + 1)}
                            aria-label={answer}
                            type="checkbox"
                            checked={selected.has(answer)}
                            checkedIcon={
                                <icons.CheckboxSelected className="big" />
                            }
                            onFocus={() => this.setState(
                                {listFocused: true}
                            )}
                            uncheckedIcon={
                                <icons.CheckboxUnselected className="big" />
                            }
                            onClick={this.onAnswerTouchTap.bind(
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
