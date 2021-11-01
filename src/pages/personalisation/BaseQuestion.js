/* @flow */
import * as React from "react";
import type {Node as ReactNode} from "react";
import classnames from "classnames";
import _ from "underscore";

import HeaderBar from "../../components/HeaderBar";
import InputListItem from "../../components/InputListItem";
import FlatButton from "../../components/FlatButton";
import WithStickyFooter from "../../components/WithStickyFooter";
import icons from "../../icons";
import storage from "../../storage";
import type {serviceSearchRequest} from "../../iss/serviceSearch";
import { append, ServiceSearchRequest } from "../../iss/ServiceSearchRequest";
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";
import {shouldShowQuestionStepper} from "../QuestionStepper";
import ScreenReader from "../../components/ScreenReader";
import {getBannerName} from "../../utils/personalisation"
import routerContext from "../../contexts/router-context";
import type {
    PersonalisationPageProps,
    PersonalisationPageState,
} from "../../utils/personalisation";

export type State = {
    ...PersonalisationPageState,
    selectedAnswer: ?string | Set<string>, // The answer(s) that a user has
        // currently selected but not confirmed
}

class BaseQuestion extends React.Component<
    PersonalisationPageProps,
    State
> {
    static contextType: any = routerContext;
    static defaultProps: Object = {};

    constructor(props: Object) {
        super(props);
        this.state = {
            selectedAnswer: props.multipleChoice ? new Set() : null,
            showQuestionStepper: false,
            category: undefined,
            showSkipToChoice: false,
        };
    }

    componentDidMount(): void {
        const category = getCategory(
            this.context.router.match.params.page
        )
        this.setState({
            selectedAnswer: this.props.multipleChoice ?
                new Set(this.constructor.savedAnswer)
                : null,
            showQuestionStepper: shouldShowQuestionStepper(
                category || undefined
            ),
            category,
        })
    }

    static get summaryLabel(): string {
        return this.defaultProps.question;
    }

    static get summaryValue(): string {
        if (!this.savedAnswer) {
            return "None selected";
        } else if (this.savedAnswer instanceof Array) {
            const nSelected = this.savedAnswer.length;

            if (nSelected === 0) {
                return "None selected";
            } else if (nSelected > 3) {
                return `${nSelected} selected`;
            } else {
                return this.savedAnswer.join(", ")
            }
        } else {
            return this.savedAnswer
        }
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
    static get savedAnswer(): string | Array<string> {
        if (this.defaultProps.multipleChoice) {
            let savedAnswer = storage.getJSON(this.defaultProps.name);

            if (Array.isArray(savedAnswer)) {
                // Update answers if we had stored an old answer
                savedAnswer = savedAnswer.map((answer) =>
                    this.defaultProps.oldAnswers[answer] || answer
                )
                return _.union(
                    this.defaultProps.possibleAnswers.keys,
                    savedAnswer
                );
            }

            return savedAnswer;

        } else {
            let answer = storage.getItem(this.defaultProps.name);

            if (typeof answer != "string") {
                return "";
            }

            return answer;
        }
    }

    static prettyPrintAnswer(answer: string): ReactNode {
        return answer;
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
        if (this.savedAnswer instanceof Array) {
            return this.getSearchForAnswer(request, new Set(this.savedAnswer));
        } else if (this.savedAnswer === "(skipped)") {
            // This question has been skipped.
            return request;
        } else if (this.savedAnswer) {
            return this.getSearchForAnswer(request, this.savedAnswer);
        } else {
            // this question hasn't been answered
            return null;
        }
    }

    static getSearchForAnswer(
        request: serviceSearchRequest,
        answer: string | Set<string>,
    ): ?serviceSearchRequest {

        let newRequest = request;

        if (answer instanceof Set) {
            // Take the first two answers offered
            const allowedAnswers = Object.keys(
                this.defaultProps.possibleAnswers
            );
            const sortedAnswers = _(Array.from(answer))
                .sortBy(partOfAnswer =>
                    allowedAnswers.indexOf(partOfAnswer)
                );

            for (let answer of sortedAnswers.slice(0, 2)) {
                newRequest = this.getSearchForSingleAnswer(
                    request,
                    answer
                );
            }
        } else {
            newRequest = this.getSearchForSingleAnswer(request, answer);
        }

        return newRequest;
    }

    static getSearchForSingleAnswer(
        request: serviceSearchRequest,
        answer: string,
    ): serviceSearchRequest {

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
        return Object.keys(this.props.possibleAnswers);
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
        if (this.state.selectedAnswer instanceof Set) {
            storage.setJSON(
                this.props.name,
                Array.from(this.state.selectedAnswer)
            );
        } else {
            storage.setItem(
                this.props.name,
                this.state.selectedAnswer || "(skipped)"
            );
        }
    }

    iconFor(answer: string): ?ReactNode {
        if (this.props.icons && this.props.icons[answer]) {
            const Icon = this.props.icons[answer];

            return (
                <Icon
                    className="ColoredIcon big icon-fg-color"
                />
            );
        }
    }

    onAnswerTouchTap(answer: string, selectingAnswer: boolean): void {
        if (this.state.selectedAnswer instanceof Set) {
            let answers = this.state.selectedAnswer;
            if (selectingAnswer) {
                answers.add(answer);
            } else {
                answers.delete(answer);
            }
            this.setState({selectedAnswer: answers});
        } else {
            this.setState({
                selectedAnswer: answer,
            }, () => {
                this.props.onDoneTouchTap()
            });
        }
    }

    possibleAnswerDescFor(answer: string): ?string {
        return this.props.possibleAnswersDesc?.[answer] || null
    }

    render(): React.Node {
        let listClassName = "List";

        if (this.props.name) {
            listClassName = `${listClassName} ${this.props.name}`;
        }

        return (
            <div
                className={
                    classnames(
                        this.props.multipleChoice ?
                            "BaseMultiQuestion"
                            : "BaseQuestion",
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
                            fixedAppBar={true}
                            taperColour={this.state.showQuestionStepper ?
                                "LighterGrey"
                                : "HeaderBar"
                            }
                            bannerName={getBannerName(
                                this.state.category,
                                this.props.name
                            )}
                            {...this.props.backToAnswers && {
                                goBack: {
                                    backMessage: "Back to answers",
                                    onBackTouchTap: this.props.goBack,
                                },
                            }}
                        />
                        {this.state.showQuestionStepper && (
                            <div className="questionsBar">
                                <ScreenReader>
                                    <a
                                        href="#mainPageContent"
                                        aria-label={
                                            "Skip your previously selected " +
                                            "answers and go straight to the " +
                                            "options."
                                        }
                                    >
                                        Skip to make your selection
                                    </a>
                                </ScreenReader>
                                <QuestionStepper
                                    category={this.state.category}
                                />
                            </div>
                        )}
                    </section>
                </div>
                <main
                    id="mainPageContent"
                    aria-labelledby="questions"
                >
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
                                {this.props.question}
                            </legend>
                            <div className={listClassName}>
                                {this.arrayOfPossibleAnswers.map(
                                    this.renderAnswer.bind(this)
                                )}
                            </div>
                            {this.props.showDVLinkBar &&
                                this.props.textDVLinkBar}
                        </fieldset>
                    </WithStickyFooter>
                    {
                        this.props.showBaseTextBox &&
                        Boolean(this.props.baseTextBoxComponent) &&
                        this.props.baseTextBoxComponent
                    }
                </main>
            </div>
        );
    }

    renderAnswer(...params: [string, number]): ReactNode {
        if (this.props.multipleChoice) {
            return this.renderMultiChoiceAnswer(...params)
        } else {
            return this.renderSingleChoiceAnswer(...params)
        }
    }

    renderSingleChoiceAnswer(answer: string, index: number): ReactNode {
        return (
            <InputListItem
                key={index}
                leftIcon={this.iconFor(answer)}
                primaryText={answer}
                secondaryText={this.possibleAnswerDescFor(answer)}
                aria-label={answer}
                value={answer}
                onClick={this.onAnswerTouchTap.bind(
                    this,
                    answer
                )}
                readOnly={true}
            />
        )
    }

    renderMultiChoiceAnswer(answer: string, index: number): ReactNode {
        const currentlySelected = this.state.selectedAnswer instanceof Set ?
            this.state.selectedAnswer.has(answer)
            : false
        return (
            <InputListItem
                key={index}
                leftIcon={this.iconFor(answer)}
                primaryText={answer}
                secondaryText={this.possibleAnswerDescFor(answer)}
                aria-label={answer}
                value={answer}
                type="checkbox"
                checked={currentlySelected}
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
                    !currentlySelected
                )}
            />
        )
    }

    renderDoneButton(): ReactNode {
        let label = "Skip"
        if (this.state.selectedAnswer instanceof Set) {
            if (this.state.selectedAnswer.size) {
                label = "Done"
            } else {
                label = "Skip"
            }
        }
        return (
            <div className="done-button">
                <FlatButton
                    label={label}
                    className={this.props.multipleChoice ? "" : "text-link"}
                    onClick={() => {
                        !this.props.multipleChoice &&
                            storage.setItem(this.props.name, "(skipped)");
                        this.props.onDoneTouchTap()
                    }}
                />
            </div>
        )
    }
}

export default BaseQuestion;
