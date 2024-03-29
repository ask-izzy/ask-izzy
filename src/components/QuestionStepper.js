/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";
import cnx from "classnames"
import { useRouter } from "next/router"
import type { NextRouter } from "next/router"

import QuestionStepperBreadcrumb from "./QuestionStepperBreadcrumb";
import Link from "../components/base/Link";
import {ensureURLHasTrailingSlash} from "../utils/url"
import Button from "../components/base/Button"
import storage from "../storage"
import LocationPage from "../constants/personalisation-pages/Location"
import {
    getSavedPersonalisationAnswer,
} from "../utils/personalisation"
import {
    getPersonalisationPages,
    getPersonalisationPagesToShow,
    getCategoryFromRouter,
    currentRouteIsPersonalised,
} from "../utils/routing"
import usePostInitialRender from "../hooks/usePostInitialRender"
import type {PersonalisationPage} from "../../flow/personalisation-page"
import ProgressBar from "./general/ProgressBar"

type Props = {|
    showQuestionIcons?: boolean,
    showClearLocation?: boolean,
    hideStepInfo?: boolean,
    showEditAnswers?: boolean,
    onClearLocation?: ?function,
|}

/*
 * Question stepper displays a row of breadcrumbs where each breadcrumb shows
 * the answers given for each personalisation question the user has answered.
 */

function QuestionStepper({
    showQuestionIcons = false,
    showClearLocation = false,
    showEditAnswers = false,
    hideStepInfo = false,
    onClearLocation,
}: Props): ReactNode {
    let personalisationPages: Array<PersonalisationPage> = []

    const router = useRouter()

    const postInitialRender = usePostInitialRender()

    function updatePersonalisationPages() {
        personalisationPages = getPersonlisationPagesForQuestionStepper(router)
    }

    postInitialRender && updatePersonalisationPages()

    function renderClearLocationButton() {
        const locationIsSet = personalisationPages.some(
            page => page.name === "location"
        )
        if (!locationIsSet || !showClearLocation) {
            return null
        }
        return (
            <Button
                className="clearButton"
                onClick={() => {
                    storage.clearSearchArea()
                    storage.clearUserGeolocation()
                    updatePersonalisationPages()
                    onClearLocation?.()
                }}
            >
                Clear saved location
            </Button>
        )
    }
    const category = getCategoryFromRouter(router)
    const CategoryIcon = category?.icon || (() => null)
    const title = category?.key !== "search" ?
        category?.name
        : `Search for “${decodeURIComponent(router.query.search)}”`

    function renderProgressBar() {
        const stepTotal = getTotalSteps(router)
        const stepsRemaining = getStepsRemaining(router)
        const stepsAnswered = stepTotal - stepsRemaining
        return <>
            <h3>{title}</h3>
            {stepsRemaining > 0 &&
                <div className="currentProgress">
                    {stepsRemaining} step{stepsRemaining > 1 && "s"}
                    {" "}remaining
                    <ProgressBar current={stepsAnswered + 1}
                        total={stepTotal}
                    />
                </div>
            }
        </>
    }

    return (
        <div className={cnx("QuestionStepper")}>
            {hideStepInfo || <CategoryIcon />}
            <div className="content">
                {!hideStepInfo && postInitialRender && renderProgressBar()}
                <ol
                    className="breadcrumbs"
                    aria-label="Your answers to previous questions"
                >
                    {personalisationPages.map((page, index) =>
                        <li key={page.name}>
                            <QuestionStepperBreadcrumb
                                personalisationPage={page}
                                personalisationPages={personalisationPages}
                                showQuestionIcons={showQuestionIcons}
                                contentToAppend={renderClearLocationButton()}
                            />
                            {index < personalisationPages.length - 1 &&
                                <span className="breadcrumbSpacer">
                                    {" | "}
                                </span>
                            }
                        </li>
                    )}
                </ol>
                {showEditAnswers &&
                    <div className="EditAnswers">
                        <Link
                            to={
                                ensureURLHasTrailingSlash(
                                    router.isReady ? router.asPath : "/"
                                ) + "personalise/summary"
                            }
                        >
                            See all and edit
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}

export const getPersonlisationPagesForQuestionStepper = (
    router: NextRouter,
): Array<PersonalisationPage> => {
    const pages: Array<PersonalisationPage> = [];

    if (currentRouteIsPersonalised(router)) {
        pages.push(...getPersonalisationPages(router))
    }

    // We want to show the location page breadcrumb on the homepage if it's set
    if (!pages.length) {
        pages.push(LocationPage)
    }

    return pages
        .filter(page => !page.noQuestionStepperBreadcrumb)
        .filter(page => {
            const answer = getSavedPersonalisationAnswer(page)
            if (answer instanceof Array) {
                return answer.length > 0
            } else {
                return answer && answer !== "(skipped)"
            }
        })
}

export function getTotalSteps(
    router: NextRouter,
): number {
    const pages = getPersonalisationPages(router)
        .filter(page => !page.noQuestionStepperStep)

    return pages.length
}

export function getStepsRemaining(
    router: NextRouter,
): number {
    const pagesToShow = getPersonalisationPagesToShow(router)
        .filter(page => !page.noQuestionStepperStep)

    return pagesToShow.length
}

export default QuestionStepper