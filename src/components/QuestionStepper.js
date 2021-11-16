/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";
import cnx from "classnames"

import Category from "../constants/Category";
import QuestionStepperBreadcrumb from "./QuestionStepperBreadcrumb";
import ScreenReader from "../components/ScreenReader";
import Link from "../components/base/Link";
import {ensureURLHasTrailingSlash} from "../utils/url"
import {useRouterContext} from "../contexts/router-context"
import Button from "../components/base/Button"
import storage from "../storage"
import LocationPage from "../pages/personalisation/Location"
import type {PersonalisationPage} from "../utils/personalisation"

const PERSONALISATION_EXCLUSION_LIST = [
    "online-safety-screen",
    "under-18-dfv",
    "using-violence",
    "are-you-safe",
    "lgbtiqa-domestic-violence",
]

type Props = {|
    showQuestionIcons?: boolean,
    showClearLocation?: boolean,
    limitBreadcrumbsTo?: Array<string>,
    category?: ?Category,
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
    limitBreadcrumbsTo,
    category,
    showEditAnswers = false,
    onClearLocation,
}: Props): ReactNode {
    const [personalisationPages, setPersonalisationPages] = React.useState([])

    const router = useRouterContext()

    function updatePersonalisationPages() {
        let newPersonalisationPages = getPersonlisationPagesForQuestionStepper(
            category || undefined
        );

        if (limitBreadcrumbsTo) {
            newPersonalisationPages = newPersonalisationPages.filter(
                page => limitBreadcrumbsTo.includes(page.defaultProps.name)
            )
        }
        setPersonalisationPages(newPersonalisationPages)
    }

    /**
     * The UseEffect is to fetch the current answers and set them to the state
     */
    React.useEffect(() => {
        updatePersonalisationPages()
    }, [])

    function renderClearLocationButton() {
        const locationIsSet = personalisationPages.some(
            page => page.defaultProps.name === "location"
        )
        if (!locationIsSet || !showClearLocation) {
            return null
        }
        return (
            <>
                <ScreenReader
                    ariaLabel="Button to clear your current location"
                >
                    Button to clear your current location
                </ScreenReader>
                <Button
                    className="clearButton"
                    aria-label="Button to clear your current location"
                    onClick={() => {
                        storage.clearSearchArea()
                        storage.clearUserGeolocation()
                        updatePersonalisationPages()
                        onClearLocation?.()
                    }}
                >
                    Clear saved location
                </Button>
            </>
        )
    }

    return (
        <div className={cnx("QuestionStepper")}>
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
                        aria-label="change your currently selected answers."
                    >
                        See all and edit
                    </Link>
                </div>
            }
        </div>
    )
}

export const getPersonlisationPagesForQuestionStepper = (
    category?: Category
): Array<PersonalisationPage> => {
    let pages: Array<PersonalisationPage> = []
    if (category) {
        pages = category.personalisation
    } else {
        if (storage.getSearchArea()) {
            pages.push(LocationPage)
        }
    }
    return pages
        .filter(page =>
            !PERSONALISATION_EXCLUSION_LIST.includes(
                page.defaultProps.name
            )
        )
        .filter(page => {
            const answer = page.savedAnswer
            if (answer instanceof Array) {
                return answer.length > 0
            } else {
                return answer && answer !== "(skipped)"
            }
        })
}

export function shouldShowQuestionStepper(category?: Category): boolean {
    return getPersonlisationPagesForQuestionStepper(category).length > 0
}
