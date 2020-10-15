/* @flow */

import * as React from "react";
import _ from "underscore";

import Personalisation from "../../mixins/Personalisation";
import HeaderBar from "../../components/HeaderBar";
import InputListItem from "../../components/InputListItem";
import FlatButton from "../../components/FlatButton";

import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";
import { append, Search } from "../../iss/Search";

export type Props = {
    name: string,
    question: string,
    byline?: string,
    classNames?: string,
    answers: Object | Array<string>,
    onDoneTouchTap: Function,
    showBaseTextBox?: boolean,
    showDVLinkBar?: boolean,
    baseTextBoxComponent?: React.Element<any>,
    textDVLinkBar?: React.Element<any>,
    icons?: Object,
    onNextStepCallback?: Function,
    mobileView?: boolean,
    answersDesc: Object,
    mandatory?: Boolean,
}

export type State = {
    selected: ?string,
    rootHeight?: number,
    windowHeight?: number,
    answers?: Set<string>,
    shouldRenderSafetyDetails?: boolean,
}

class BaseQuestion extends Personalisation<Props, State> {
    static defaultProps: Object = {};

    constructor(props: Object) {
        super(props);
        this.state = {
            selected: null, // set when the user makes a choice
        };
    }

    get selected(): string {
        let storageValue;

        const valueFromStorage = storage.getItem(this.props.name)

        if (typeof valueFromStorage === "boolean") {
            storageValue = valueFromStorage ? "true" : "false";
        } else {
            storageValue = valueFromStorage;
        }

        return `${(
            this.state.selected ||
            storageValue ||
            ""
        )}`;
    }

    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    static get summaryValue(): string {
        return this.answer;
    }

    /*
     * How should this answer be represented
     * @returns {string} A description of the question/answer
    */
    static headingValue(): string {
        return "";
    }

    static get answer(): string {
        let answer = storage.getItem(this.defaultProps.name);

        if (typeof answer != "string") {
            return "";
        }

        return answer;
    }

    /**
     * Modify the search query with the answers to the question. Or return
     * `null` if we don't have an answer (this will cause the question to
     * be shown).
     *
     * @param {iss.searchRequest} request - current ISS search request.
     * @returns {iss.searchRequest} modified ISS search request.
     */
    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        let value = this.answer;

        if (value === "(skipped)") {
            // This question has been skipped.
            return request;
        }

        if (value) {
            return this.getSearchForAnswer(request, value);
        } else {
            // this question hasn't been answered
            return null;
        }
    }

    static getSearchForAnswer(
        request: iss.searchRequest,
        answer: string,
    ): ?iss.searchRequest {

        let answerComposer;

        /* the answers are a map of answers to search terms */
        if (_.isObject(this.defaultProps.answers) &&
            this.defaultProps.answers[answer] instanceof Search) {

            answerComposer = this.defaultProps.answers[answer];
        } else {
            // Default behaviour for strings is to append
            answerComposer = append(answer);
        }

        return answerComposer.compose(request);
    }

    /**
     * Return the answers from the answers property element.
     *
     * @returns {Array<string>} an array of the valid answers
     * to this question.
     */
    get answers(): Array<string> {
        if (Array.isArray(this.props.answers)) {
            return this.props.answers;
        } else {
            return Object.keys(this.props.answers);
        }
    }

    get question(): string {
        return this.props.question;
    }

    /**
     * Determines whether or not to show the question.
     *
     * @returns {boolean} true if we should show this question.
     */
    static showPage(): boolean {
        return true;
    }

    /**
     * Determines whether or not to show the question on the summary page.
     *
     * @returns {boolean} true if we should show this on the summary page.
     */
    static showInSummary(): boolean {
        return true;
    }

    /**
     * Trigger next page after a 500ms debounce.
     *
     * @returns {void}
     */
    triggerNext(): void {
        if (typeof this.nextStep === "function") {
            this.nextStep();
        }
    }

    onNextStep(): void {
        storage.setItem(this.props.name, this.state.selected || "(skipped)");
    }

    iconFor(answer: string): ?React.Element<any> {
        if (this.props.icons && this.props.icons[answer]) {
            const Icon = this.props.icons[answer];

            return (
                <Icon
                    className="ColoredIcon small icon-fg-color"
                />
            );
        }
    }

    onAnswerTouchTap(answer: string, ...rest: any): void {
        this.setState({
            selected: answer,
        }, () => {
            this.triggerNext()
        });
    }

    answerDescFor(answer: string): ?React.Element<any> {
        if (this.props.answersDesc && this.props.answersDesc[answer]) {
            const answerDesc = this.props.answersDesc[answer];

            return answerDesc;
        }
    }

    render(): React.Node {
        const selected = this.selected;
        let listClassName = "List";

        if (this.props.name) {
            listClassName = `${listClassName} ${this.props.name}`;
        }

        return (
            <div>
                {this.renderHeaderBar()}
                <div className={listClassName}>
                    {this.answers.map((answer, index) =>
                        <InputListItem
                            key={index}
                            leftIcon={this.iconFor(answer)}
                            primaryText={answer}
                            secondaryText={this.answerDescFor(answer)}

                            type="radio"
                            checked={answer === selected}
                            value={answer}
                            onClick={this.onAnswerTouchTap.bind(this, answer)}
                            readOnly={true}

                            checkedIcon={
                                <icons.RadioSelected className="big" />
                            }
                            uncheckedIcon={
                                <icons.RadioUnselected className="big" />
                            }
                        />)}
                </div>
                {this.props.showDVLinkBar && this.props.textDVLinkBar}
                {!this.props.mandatory && this.renderDoneButton()}
                {
                    this.props.showBaseTextBox &&
                    Boolean(this.props.baseTextBoxComponent) &&
                    this.props.baseTextBoxComponent
                }
            </div>
        );
    }

    renderHeaderBar(): React.Element<any> {
        return (
            <HeaderBar
                primaryText={
                    <div>
                        {this.question}
                    </div>
                }
                secondaryText={
                    this.props.byline
                }
                bannerName={this.bannerName}
            />
        );
    }

    renderDoneButton(): ?React.Element<any> {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        className="text-link"
                        label="Skip"
                        onClick={this.props.onDoneTouchTap}
                    />
                </div>
            </div>
        )
    }
}

export default BaseQuestion;
