/* @flow */
import * as React from "react";
import type {Node as ReactNode} from "react";
import _ from "underscore";

import Personalisation from "../../mixins/Personalisation";
import HeaderBar from "../../components/HeaderBar";
import InputListItem from "../../components/InputListItem";
import FlatButton from "../../components/FlatButton";

import storage from "../../storage";
import type {serviceSearchRequest} from "../../iss/serviceSearch";
import { append, ServiceSearchRequest } from "../../iss/ServiceSearchRequest";
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";
import {fetchAnswers, getSearchAnswers} from "../QuestionStepper.service";
import Category from "../../constants/Category";
import ScreenReader from "../../components/ScreenReader";

export type Props = {
    name: string,
    question: string,
    byline?: string,
    info?: string,
    classNames?: string,
    possibleAnswers: {[string]: string},
    onDoneTouchTap: Function,
    goBack?: () => boolean,
    showBaseTextBox?: boolean,
    showDVLinkBar?: boolean,
    baseTextBoxComponent?: ReactNode,
    textDVLinkBar?: ReactNode,
    icons?: Object,
    mobileView?: boolean,
    descriptionsForAnswers: {[string]: string},
    backToAnswers?: boolean,
    multipleChoice: boolean
}

export type State = {
    selectedAnswer: ?string, // The answer to single-choice question that a user
        // has currently selected but not confirmed
    selectedAnswers?: Set<string>,
        // The same as selectedAnswer but used for multi-choice questions
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
            selectedAnswer: null,
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
            this.state.selectedAnswer ||
            storageValue ||
            ""
        )}`;
    }

    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    static get summaryValue(): string {
        return this.savedAnswer;
    }

    /*
     * How should this answer be represented
     * @returns {string} A description of the question/answer
    */
    static headingValue(): string {
        return "";
    }

    /*
     * Gets the answer which has been saved into the users SessionStore after
     * they selected and then confirmed an answer.
     */
    static get savedAnswer(): string {
        let answer = storage.getItem(this.defaultProps.name);

        if (typeof answer != "string") {
            return "";
        }

        return answer;
    }

    /**
     * A separate Answer return for the the breadcrumbs that can be overwritten
     * Per question
     * @returns {ReactNode} - returns the
     *     selected answer
     */
    static prettyPrintSavedAnswer(): ReactNode {
        return this.savedAnswer;
    }

    /**
     * Modify the search query with the answers to the question. Or return
     * `null` if we don't have an answer (this will cause the question to
     * be shown).
     *
     * @param {searchRequest} request - current ISS search request.
     * @returns {searchRequest} modified ISS search request.
     */
    static getSearch(request: serviceSearchRequest): ?serviceSearchRequest {
        let value = this.savedAnswer;

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
        request: serviceSearchRequest,
        answer: string,
    ): ?serviceSearchRequest {

        let answerComposer;

        /* the answers are a map of answers to search terms */
        if (
            _.isObject(this.defaultProps.possibleAnswers) &&
            this.defaultProps.possibleAnswers[answer] instanceof
                ServiceSearchRequest
        ) {
            answerComposer = this.defaultProps.possibleAnswers[answer];
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
    get arrayOfPossibleAnswers(): Array<string> {
        if (Array.isArray(this.props.possibleAnswers)) {
            return this.props.possibleAnswers;
        } else {
            return Object.keys(this.props.possibleAnswers);
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

    onNextStep(): void {
        storage.setItem(
            this.props.name,
            this.state.selectedAnswer || "(skipped)"
        );
    }

    iconFor(answer: string): ?ReactNode {
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
            selectedAnswer: answer,
        }, () => {
            this.props.onDoneTouchTap()
        });
    }

    /*
     * If a description exists for a given answer then get that description.
     */
    getAnswerDescription(answer: string): ?string {
        return this.props.descriptionsForAnswers?.[answer] || null
    }

    render(): React.Node {
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
                        taperColour={this.state.showStepper ? "LighterGrey"
                            : "HeaderBar"}
                        bannerName={this.bannerName}
                        {...this.props.backToAnswers && {
                            goBack: {
                                backMessage: "Back to answers",
                                onBackTouchTap: this.props.goBack,
                            },
                        }}
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
                            {this.arrayOfPossibleAnswers.map((answer, index) =>
                                <InputListItem
                                    key={index}
                                    leftIcon={this.iconFor(answer)}
                                    primaryText={answer}
                                    secondaryText={
                                        this.getAnswerDescription(answer)
                                    }
                                    aria-label={answer}
                                    value={answer}
                                    onClick={this.onAnswerTouchTap.bind(
                                        this,
                                        answer
                                    )}
                                    readOnly={true}
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

    renderDoneButton(): ReactNode {
        return (
            <div>
                <div className="done-button">
                    <FlatButton
                        className="text-link"
                        label="Skip"
                        onClick={() => {
                            storage.setItem(this.props.name, "(skipped)");
                            this.props.onDoneTouchTap()
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default BaseQuestion;
