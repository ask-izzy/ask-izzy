/* @flow */
import * as React from "react";
import type {Node as ReactNode} from "react";
import classnames from "classnames";

import HeaderBar from "../../components/HeaderBar";
import InputListItem from "../../components/InputListItem";
import FlatButton from "../../components/FlatButton";
import WithStickyFooter from "../../components/WithStickyFooter";
import icons from "../../icons";
import storage from "../../storage";
import QuestionStepper from "../../components/QuestionStepper";
import {getCategory} from "../../constants/categories";
import ScreenReader from "../../components/ScreenReader";
import {
    getBannerName,
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"
import routerContext from "../../contexts/router-context";
import SupportSearchBar from "../../components/SupportSearchBar";
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import Category from "../../constants/Category";

type Props = {|
    onDoneTouchTap: () => void,
    mobileView?: boolean,
    backToAnswers?: boolean,
    details: PersonalisationQuestionPage,
    goBack?: () => void,
    classNames?: Array<string>,
|}
export type State = {
    category: ?Category,
    selectedAnswer: ?string | Set<string>, // The answer(s) that a user has
        // currently selected but not confirmed
}

class BaseQuestion extends React.Component<Props, State> {
    static contextType: any = routerContext;

    constructor(props: Object) {
        super(props);
        this.state = {
            selectedAnswer: props.multipleChoice ? new Set() : null,
            category: undefined,
            showSkipToChoice: false,
        };
    }

    componentDidMount(): void {
        const category = getCategory(
            this.context.router.match.params.page
        )
        const savedAnswer = getSavedPersonalisationAnswer(
            this.props.details
        )
        this.setState({
            selectedAnswer: this.props.details.multipleChoice ?
                new Set(savedAnswer)
                : null,
            category,
        })
    }



    /**
     * Return the answers from the answers property element.
     *
     * @returns {Array<string>} an array of the valid answers
     * to this question.
     */
    get arrayOfPossibleAnswers(): Array<string> {
        return Object.keys(this.props.details.possibleAnswers);
    }

    get question(): string {
        return this.props.details.question;
    }

    onNextStep(): void {
        if (this.state.selectedAnswer instanceof Set) {
            storage.setJSON(
                this.props.details.name,
                Array.from(this.state.selectedAnswer)
            );
        } else {
            storage.setItem(
                this.props.details.name,
                this.state.selectedAnswer || "(skipped)"
            );
        }
        this.props.onDoneTouchTap()
    }

    iconFor(answer: string): ReactNode {
        const Icon = this.props.details.icons?.[answer];
        if (Icon) {
            return (
                <Icon
                    className="ColoredIcon big icon-fg-color"
                />
            );
        }
        return null
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
                this.onNextStep()
            });
        }
    }

    getDescriptionForAnswer(answer: string): ?string {
        return this.props.details.descriptionsForAnswers?.[answer] || null
    }

    render(): React.Node {
        let listClassName = "List";

        if (this.props.details.name) {
            listClassName = `${listClassName} ${this.props.details.name}`;
        }

        return (
            <div
                className={
                    classnames("BaseQuestion", this.props.classNames)
                }
            >
                <div>
                    <section className="page-header-section">
                        <HeaderBar
                            primaryText={
                                <div>
                                    {this.props.details.question}
                                </div>
                            }
                            infoText={
                                this.props.details.info
                            }
                            secondaryText={
                                this.props.details.byline
                            }
                            fixedAppBar={true}
                            taperColour={"LighterGrey"}
                            bannerName={getBannerName(
                                this.state.category,
                                this.props.details.name
                            )}
                            {...this.props.backToAnswers && {
                                goBack: {
                                    backMessage: "Back to answers",
                                    onBackTouchTap: this.props.goBack,
                                },
                            }}
                        />
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
                            <QuestionStepper />
                        </div>
                    </section>
                </div>
                <main
                    id="mainPageContent"
                    aria-label="Questions"
                >
                    <WithStickyFooter
                        footerContents={this.renderDoneButton()}
                    >
                        <fieldset>
                            <legend>
                                {this.props.details.question}
                            </legend>
                            <div className={listClassName}>
                                {this.arrayOfPossibleAnswers.map(
                                    this.renderAnswer.bind(this)
                                )}
                            </div>
                            {this.props.details.baseTextBoxComponent ?? null}
                        </fieldset>
                    </WithStickyFooter>
                    {this.renderSearchBar()}
                </main>
            </div>
        );
    }

    renderAnswer(...params: [string, number]): ReactNode {
        if (this.props.details.multipleChoice) {
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
                secondaryText={this.getDescriptionForAnswer(answer)}
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
                secondaryText={this.getDescriptionForAnswer(answer)}
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
                    className={
                        this.props.details.multipleChoice ? "" : "text-link"
                    }
                    onClick={this.onNextStep.bind(this)}
                />
            </div>
        )
    }

    renderSearchBar(): ReactNode {
        if (this.props.details.showSupportSearchBar) {
            return <SupportSearchBar />
        }
        return null
    }
}

export default BaseQuestion;
