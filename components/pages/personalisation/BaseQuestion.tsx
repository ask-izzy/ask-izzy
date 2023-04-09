import React, {useState, useEffect} from "react";
import {withRouter} from "next/router"
import type {NextRouter} from "next/router"
import classnames from "classnames";

import HeaderBar from "@/src/components/HeaderBar.js";
import InputListItem from "@/src/components/InputListItem.js";
import FlatButton from "@/src/components/FlatButton.js";
import WithStickyFooter from "@/src/components/WithStickyFooter.js";
import CheckboxSelected from "@/src/icons/CheckboxSelected.js";
import CheckboxUnselected from "@/src/icons/CheckboxUnselected.js";
import storage from "@/src/storage.js";
import QuestionStepper from "@/src/components/QuestionStepper.js";
import {getCategory} from "@/src/constants/categories.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import {
    getBannerName,
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"
import {
    goToPersonalisationNextPath,
    getPersonalisationBackPath,
} from "@/src/utils/routing.js"
import SupportSearchBar from "@/src/components/SupportSearchBar.js";
import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"
import Category from "@/src/constants/Category.js";


type Props = {
    router: NextRouter,
    details: PersonalisationQuestionPage,
    classNames?: Array<string>,
}
export type State = {
    category: Category | null,
    selectedAnswer: string | Set<string> | null, // The answer(s) that a user has
        // currently selected but not confirmed
}

function BaseQuestion({
    router,
    details,
    classNames,
}: Props) {
    const [selectedAnswer, setSelectedAnswer] =
        useState<string | Set<string> | null>(details.multipleChoice ? new Set() : null)
    const [category] =
        useState<Category | undefined>(getCategory(
            router.query.categoryOrContentPageSlug as string,
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
                : null,
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
                Array.from(selected),
            );
        } else {
            storage.setItem(
                details.name,
                selected || "(skipped)",
            )
        }
        goToPersonalisationNextPath({router})
    }

    function iconFor(answer: string) {
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
            const answers = new Set(selectedAnswer)
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

    function getDescriptionForAnswer(answer: string): string | null {
        return details.descriptionsForAnswers?.[answer] || null
    }



    function renderAnswer(answer: string, index: number) {
        if (details.multipleChoice) {
            return renderMultiChoiceAnswer(answer, index)
        } else {
            return renderSingleChoiceAnswer(answer, index)
        }
    }

    function renderSingleChoiceAnswer(answer: string, index: number) {
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

    function renderMultiChoiceAnswer(answer: string, index: number) {
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
                    <CheckboxSelected
                        className="big"
                    />
                }
                uncheckedIcon={
                    <CheckboxUnselected
                        className="big"
                    />
                }
                onClick={() => onAnswerTouchTap(
                    answer,
                    !currentlySelected,
                )}
            />
        )
    }

    function renderDoneButton() {
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

    function renderSearchBar() {
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
                            details.name,
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
                                renderAnswer,
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

export default (withRouter(BaseQuestion))