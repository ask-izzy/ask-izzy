/* @flow */
import * as React from "react";
import classnames from "classnames";
import _ from "underscore";

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
import ScreenReader from "../../components/ScreenReader";

class BaseMultiQuestion extends BaseQuestion {
    static propTypes = BaseQuestion.propTypes;

    renderDoneButton(): React.Element<any> {
        const label = (this.selected.size) ?
            "Done"
            : "None of these";

        return (
            <div className="done-button">
                <FlatButton
                    label={label}
                    onClick={this.props.onDoneTouchTap}
                />
            </div>
        )
    }

    // $FlowIgnore we have the liskov substitution principle :(
    get selected(): Set<string> {
        if (this.state.selectedAnswers) {
            return this.state.selectedAnswers;
        }

        return new Set(
            this.constructor.savedAnswer || []
        );
    }

    static showPage(): boolean {
        return true;
    }

    static breadcrumbToStandardAnswer(breadcrumbAnswer?: ?Array<any>): string {
        return "";
    }

    static get summaryValue(): string {
        if (!this.savedAnswer) {
            return "None selected";
        } else {
            const nSelected = this.savedAnswer.length;

            if (nSelected === 0) {
                return "None selected";
            } else if (nSelected > 3) {
                return `${nSelected} selected`;
            } else {
                return this.savedAnswer.join(", ")
            }
        }
    }

    // $FlowIgnore we have the liskov substitution principle :(
    static get savedAnswer(): ?Array<string> {
        let answers = storage.getJSON(this.defaultProps.name);

        if (Array.isArray(answers)) {
            // Update answers if we had stored an old answer
            answers = answers.map((answer) =>
                this.defaultProps.oldAnswers[answer] || answer
            )
            return _.union(
                this.defaultProps.possibleAnswers.keys,
                answers
            );
        }

        return answers;
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        let value = this.savedAnswer;

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
            const allowedAnswers = Object.keys(
                this.defaultProps.possibleAnswers
            );
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

        this.setState({selectedAnswers: answers});
    }

    onNextStep(): void {
        storage.setJSON(this.props.name, Array.from(this.selected));
    }

    render(): React.Element<"div"> {
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
                <div
                    role="complementary"
                    aria-labelledby="header"
                >
                    <ScreenReader>
                        <span id="header">
                            Header.
                        </span>
                    </ScreenReader>
                    <section className="page-header-section">
                        <HeaderBar
                            primaryText={
                                <div>
                                    {this.props.question}
                                </div>
                            }
                            infoText={
                                this.props.info
                            }
                            secondaryText={
                                this.props.byline
                            }
                            taperColour="LighterGrey"
                            fixedAppBar={true}
                            bannerName={this.bannerName}
                            {...this.props.backToAnswers && {
                                goBack: {
                                    backMessage: "Back to answers",
                                    onBackTouchTap: this.props.goBack,
                                },
                            }}
                        />
                    </section>
                    <div
                        tabIndex="0"
                        onFocus={() => {
                            this.setState({showSkipToChoice: true})
                        }}
                    >
                        <QuestionStepper
                            category={getCategory(
                                this.context.router.match.params.page
                            )}
                            showSkipToChoice={this.state.showSkipToChoice}
                            clearShowSkipToChoice={() =>
                                this.setState({showSkipToChoice: false})
                            }
                        />
                    </div>
                </div>
                <main aria-labelledby="questions">
                    <ScreenReader>
                        <span id="questions">
                            Questions.
                        </span>
                    </ScreenReader>
                    <WithStickyFooter
                        footerContents={this.renderDoneButton()}
                    >
                        <fieldset>
                            <legend>
                                {this.question}
                            </legend>
                            <div className="List">
                                {this.arrayOfPossibleAnswers
                                    .map((answer, index) =>
                                        <InputListItem
                                            key={index}
                                            leftIcon={this.iconFor(answer)}
                                            primaryText={answer}
                                            value={answer}
                                            aria-label={answer}
                                            type="checkbox"
                                            checked={selected.has(answer)}
                                            checkedIcon={
                                                <icons.CheckboxSelected
                                                    className="big"
                                                />
                                            }
                                            uncheckedIcon={
                                                <icons.CheckboxUnselected
                                                    className="big"
                                                />
                                            }
                                            onClick={this.onAnswerTouchTap.bind(
                                                this,
                                                answer,
                                                !selected.has(answer)
                                            )}
                                        />
                                    )}
                            </div>
                        </fieldset>
                    </WithStickyFooter>
                </main>
            </div>
        );
    }
}

export default BaseMultiQuestion;
