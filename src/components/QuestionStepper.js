/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";
import cnx from "classnames"

import QuestionStepperBreadcrumb from "./QuestionStepperBreadcrumb";
import Link from "../components/base/Link";
import {ensureURLHasTrailingSlash} from "../utils/url"
import {useRouterContext} from "../contexts/router-context"
import Button from "../components/base/Button"
import storage from "../storage"
import LocationPage from "../pages/personalisation/Location"
import {
    getPersonalisationPages,
    getPersonalisationPagesToShow,
    getCategoryFromRouter,
} from "../utils/personalisation"
import usePostInitialRender from "../hooks/usePostInitialRender"
import type {PersonalisationPage} from "../utils/personalisation"
import SearchIcon from "../icons/Search"
import ProgressBar from "./general/ProgressBar"
import type { RouterContextObject } from "../contexts/router-context";

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

export default function QuestionStepper({
    showQuestionIcons = false,
    showClearLocation = false,
    showEditAnswers = false,
    hideStepInfo = false,
    onClearLocation,
}: Props): ReactNode {
    let personalisationPages: Array<PersonalisationPage> = []

    const router = useRouterContext()

    const postInitialRender = usePostInitialRender()

    function updatePersonalisationPages() {
        personalisationPages = getPersonlisationPagesForQuestionStepper(router)
    }

    postInitialRender && updatePersonalisationPages()

    function renderClearLocationButton() {
        const locationIsSet = personalisationPages.some(
            page => page.defaultProps.name === "location"
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
    const SearchTypeIcon = category?.icon ||
        (() => <SearchIcon viewBox="14 14 35 35" />)
    const title = category ?
        category.name
        : `Search for “${router.match.params.search}”`
    const stepTotal = getTotalSteps(router)
    const stepNumber = getCurrentStep(router)

    return (
        <div className={cnx("QuestionStepper")}>
            {hideStepInfo || <SearchTypeIcon />}
            <div className="content">
                {!hideStepInfo && postInitialRender && <>
                    <h3>{title}</h3>
                    <div className="currentProgress">
                        Step {stepNumber} of {stepTotal}
                        <ProgressBar current={stepNumber}
                            total={stepTotal}
                        />
                    </div>
                </>}
                <ol
                    className="breadcrumbs"
                    aria-label="Your answers to previous questions"
                >
                    {personalisationPages.map((page, index) =>
                        <li key={page.defaultProps.name}>
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
                                    router.location.pathname
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
    router: $PropertyType<RouterContextObject, 'router'>,
): Array<PersonalisationPage> => {
    let pages: Array<PersonalisationPage> = getPersonalisationPages(router)

    // We want to show the location page breadcrumb on the homepage if it's set
    if (!pages.length) {
        pages.push(LocationPage)
    }

    return pages
        .filter(page => !page.defaultProps.noQuestionStepperBreadcrumb)
        .filter(page => {
            const answer = page.savedAnswer
            if (answer instanceof Array) {
                return answer.length > 0
            } else {
                return answer && answer !== "(skipped)"
            }
        })
}

export function getTotalSteps(
    router: $PropertyType<RouterContextObject, 'router'>,
): number {
    const pages = getPersonalisationPages(router)
        .filter(page => !page.defaultProps.noQuestionStepperStep)

    return pages.length
}

export function getCurrentStep(
    router: $PropertyType<RouterContextObject, 'router'>,
): number {
    const pagesToShow = getPersonalisationPagesToShow(router)
        .filter(page => !page.defaultProps.noQuestionStepperStep)

    return getTotalSteps(router) + 1 - Math.max(pagesToShow.length, 1)
}
