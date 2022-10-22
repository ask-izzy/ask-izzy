/* @flow */
import React, {useState, useEffect } from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"
import classnames from "classnames";

import HeaderBar from "@/src/components/HeaderBar";
import InputListItem from "@/src/components/InputListItem";
import FlatButton from "@/src/components/FlatButton";
import WithStickyFooter from "@/src/components/WithStickyFooter";
import icons from "@/src/icons";
import storage from "@/src/storage";
import QuestionStepper from "@/src/components/QuestionStepper";
import {getCategory} from "@/src/constants/categories";
import ScreenReader from "@/src/components/ScreenReader";
import {
    getBannerName,
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"
import {
    goToPersonalisationNextPath,
    getPersonalisationBackPath,
} from "@/src/utils/routing"
import SupportSearchBar from "@/src/components/SupportSearchBar";
import type {
    PersonalisationQuestionPage,
} from "@/flow/personalisation-page"
import Category from "@/src/constants/Category";

type Props = {|
    router: NextRouter,
    backToAnswers?: boolean,
    details: PersonalisationQuestionPage,
    classNames?: Array<string>,
|}
export type State = {
    category: ?Category,
    selectedAnswer: ?string | Set<string>, // The answer(s) that a user has
        // currently selected but not confirmed
}

function BaseQuestion({
    router,
    backToAnswers,
    details,
    classNames,
}: Props): ReactNode {
    const [selectedAnswer, setSelectedAnswer] =
        useState<?string | Set<string>>(details.multipleChoice ? new Set() : null)
    const [category] =
        useState<?Category>(getCategory(
            router.query.categoryOrContentPageSlug
        ))

    let listClassName = "List"
    if (details.name) {
        listClassName = `${listClassName} ${details.name}`
    }
    const goBackPath = getPersonalisationBackPath(router)
    const isSummaryRoute = goBackPath.includes("/summary")

    useEffect(() => {
        if (router.isReady) {
            clientSideInit()
        }
    }, [router.isReady])

    function clientSideInit(): void {
        const savedAnswer =
            getSavedPersonalisationAnswer(details)

        setSelectedAnswer(
            details.multipleChoice ?
                new Set(savedAnswer)
                : null
        )
    }

    /**
     * Return the answers from the answers property element.
     *
     * @returns {Array<string>} an array of the valid answers
     * to this question.
     */
    function arrayOfPossibleAnswers(): Array<string> {
        return Object.keys(details.possibleAnswers)
    }

    function onNextStep(answer?: string): void {
        const selected = answer != undefined ? answer : selectedAnswer
        if (selected instanceof Set) {
            storage.setJSON(
                details.name,
                Array.from(selected)
            );
        } else {
            storage.setItem(
                details.name,
                selected || "(skipped)"
            )
        }
        goToPersonalisationNextPath({router})
    }

    function iconFor(answer: string): ReactNode {
        const Icon = details.icons?.[answer]
        if (Icon) {
            return (
                <Icon
                    className="ColoredIcon big icon-fg-color"
                />
            )
        }
        return null
    }

    function onAnswerTouchTap(answer: string, selectingAnswer: boolean): void {
        if (selectedAnswer instanceof Set) {
            let answers = new Set(selectedAnswer)
            if (selectingAnswer) {
                answers.add(answer)
            } else {
                answers.delete(answer)
            }
            setSelectedAnswer(answers)
        } else {
            setSelectedAnswer(answer)
            onNextStep(answer)
        }
    }

    function getDescriptionForAnswer(answer: string): ?string {
        return details.descriptionsForAnswers?.[answer] || null
    }



    function renderAnswer(answer: string, index: number, array: Array<string>): ReactNode {
        if (details.multipleChoice) {
            return renderMultiChoiceAnswer(answer, index)
        } else {
            return renderSingleChoiceAnswer(answer, index)
        }
    }

    function renderSingleChoiceAnswer(answer: string, index: number): ReactNode {
        return (
            <InputListItem
                key={index}
                leftIcon={iconFor(answer)}
                primaryText={answer}
                secondaryText={getDescriptionForAnswer(answer)}
                aria-label={answer}
                value={answer}
                onClick={() => onAnswerTouchTap(answer, false)}
                readOnly={true}
            />
        )
    }

    function renderMultiChoiceAnswer(answer: string, index: number): ReactNode {
        const currentlySelected = selectedAnswer instanceof Set ?
            selectedAnswer.has(answer)
            : false
        return (
            <InputListItem
                key={index}
                leftIcon={iconFor(answer)}
                primaryText={answer}
                secondaryText={getDescriptionForAnswer(answer)}
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
                onClick={() => onAnswerTouchTap(
                    answer,
                    !currentlySelected
                )}
            />
        )
    }

    function renderDoneButton(): ReactNode {
        let label = "Skip"
        if (selectedAnswer instanceof Set) {
            if (selectedAnswer.size) {
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
                        details.multipleChoice ? "" : "text-link"
                    }
                    onClick={() => onNextStep()}
                />
            </div>
        )
    }

    function renderSearchBar(): ReactNode {
        if (details.showSupportSearchBar) {
            return <SupportSearchBar />
        }
        return null
    }

    return (
        <div
            className={
                classnames("BaseQuestion", classNames)
            }
        >
            <div>
                <section className="page-header-section">
                    <HeaderBar
                        primaryText={
                            <div>
                                {details.question}
                            </div>
                        }
                        infoText={
                            details.info
                        }
                        secondaryText={
                            details.byline
                        }
                        fixedAppBar={true}
                        taperColour={"LighterGrey"}
                        bannerName={getBannerName(
                            category,
                            details.name
                        )}
                        backUrl={isSummaryRoute ? goBackPath : undefined}
                        backMessage={
                            isSummaryRoute ? "Back to answers" : undefined
                        }
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
                    footerContents={renderDoneButton()}
                >
                    <fieldset>
                        <legend>
                            {details.question}
                        </legend>
                        <div className={listClassName}>
                            {arrayOfPossibleAnswers().map(
                                renderAnswer
                            )}
                        </div>
                        {details.baseTextBoxComponent ?? null}
                    </fieldset>
                </WithStickyFooter>
                {renderSearchBar()}
            </main>
        </div>
    )
}

export default (
    withRouter(BaseQuestion):
        Class<
            React$Component<
                $Diff<
                    ReactElementConfig<typeof BaseQuestion>,
                    {router: *}
                >
            >
        >
)