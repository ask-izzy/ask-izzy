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
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";
import {fetchAnswers, getSearchAnswers} from "../QuestionStepper.service";
import Category from "../../constants/Category";
import ScreenReader from "../../components/ScreenReader";

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
    backToAnswers?: boolean,
}

export type State = {
    selected: ?string,
    rootHeight?: number,
    windowHeight?: number,
    answers?: Set<string>,
    shouldRenderSafetyDetails?: boolean,
    showStepper: boolean,
    category: ?Category,
    showSkipToChoice: boolean,
}

class BaseQuestion extends Personalisation<Props, State> {
    static defaultProps: Object = {};

    constructor(props: Object) {
        super(props);
        this.state = {
            selected: null, // set when the user makes a choice
            showStepper: false,
            category: undefined,
            showSkipToChoice: false,
        };
    }

    componentDidMount(): void {
        const category = getCategory(
            this.context.router.match.params.page
        )
        const searchAnswers = getSearchAnswers();
        this.setState({
            showStepper: category ? fetchAnswers(category).length > 0
                : searchAnswers.length > 0,
            category,
        })
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
     * A separate Answer return for the the breadcrumbs that can be overwritten
     * Per question
     * @returns {string} - returns the selected answer
     */
    static breadcrumbAnswer(): ?string | ?React.Node {
        return this.answer;
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

    static breadcrumbToStandardAnswer(breadcrumbAnswer?: ?any): string {
        return "";
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
            <>
                <div
                    role="complementary"
                    aria-labelledby="header"
                >
                    <ScreenReader>
                        <span id="header">
                            Header.
                        </span>
                    </ScreenReader>
                    <HeaderBar
                        primaryText={
                            <div>
                                {this.question}
                            </div>
                        }
                        secondaryText={
                            this.props.byline
                        }
                        fixedAppBar={true}
                        goBack={this.props.backToAnswers && {
                            backMessage: "Back to answers",
                            onBackTouchTap: this.nextStep,
                        }}
                        taperColour={this.state.showStepper ? "LighterGrey"
                            : "HeaderBar"}
                        bannerName={this.bannerName}
                    />
                    {this.state.showStepper && (
                        <div
                            tabIndex="0"
                            onFocus={() => {
                                this.setState({
                                    showSkipToChoice: true,
                                })
                            }}
                        >
                            <QuestionStepper
                                category={this.state.category}
                                showSkipToChoice={this.state.showSkipToChoice}
                                clearShowSkipToChoice={() => {
                                    this.setState({showSkipToChoice: false})
                                }}
                            />
                        </div>
                    )}
                </div>
                <main aria-labelledby="questions">
                    <ScreenReader>
                        <span id="questions">
                            Questions.
                        </span>
                    </ScreenReader>
                    <fieldset>
                        <legend>
                            {this.question}
                        </legend>
                        <div className={listClassName}>
                            {this.answers.map((answer, index) =>
                                <InputListItem
                                    key={index}
                                    leftIcon={this.iconFor(answer)}
                                    primaryText={answer}
                                    secondaryText={this.answerDescFor(answer)}
                                    aria-label={answer}
                                    type="radio"
                                    checked={answer === selected}
                                    value={answer}
                                    onClick={this.onAnswerTouchTap.bind(
                                        this,
                                        answer
                                    )}
                                    readOnly={true}
                                    checkedIcon={
                                        <icons.RadioSelected
                                            className="big"
                                        />
                                    }
                                    uncheckedIcon={
                                        <icons.RadioUnselected
                                            className="big"
                                        />
                                    }
                                />)}
                        </div>
                        {this.props.showDVLinkBar && this.props.textDVLinkBar}
                        {this.renderDoneButton()}
                    </fieldset>
                    {
                        this.props.showBaseTextBox &&
                        Boolean(this.props.baseTextBoxComponent) &&
                        this.props.baseTextBoxComponent
                    }
                </main>
            </>
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
