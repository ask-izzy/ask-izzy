/* @flow */

import React, {useEffect} from "react"
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import WithStickyFooter from "@/src/components/WithStickyFooter";
import Spacer from "@/src/components/Spacer";
import FlatButton from "@/src/components/FlatButton"
import HeaderBar from "@/src/components/HeaderBar"
import LinkListItem from "@/src/components/LinkListItem"
import Link from "@/src/components/base/Link"
import storage from "@/src/storage";
import {isDisabilityAdvocacySearch} from "@/src/iss/serviceSearch"
import {
    getBannerName,
    setLocationFromUrl,
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"
import {
    getPersonalisationPages,
    getPersonalisationNextPath,
    getServicesPath,
    getCategoryFromRouter,
} from "@/src/utils/routing"
import type {
    PersonalisationPage,
} from "@/flow/personalisation-page"
import Loading from "@/src/icons/Loading"

type Props = {
    router: NextRouter
}

function PersonalisationSummaryPage({router}: Props): ReactNode {

    useEffect(() => {
        if (router.isReady) {
            clientSideInit()
        }
    }, [router.isReady])

    function clientSideInit(): void {
        setLocationFromUrl(router)
    }

    function resultsPageUrl(): string {
        return getPersonalisationNextPath({
            router,
            summary: false,
        });
    }

    function clearAll(event): void {
        event.preventDefault();
        const myList = storage.getJSON("my-list-services");
        storage.clear();
        storage.setJSON("my-list-services", myList)

        let redirectUrl = "/"
        if (isDisabilityAdvocacySearch(router)) {
            redirectUrl = "/disability-advocacy-finder"
        }
        router.push(redirectUrl);
    }

    function personalisationPages(): Array<PersonalisationPage> {
        const personalisationPages = getPersonalisationPages(router)
        const category = getCategoryFromRouter(router)

        return personalisationPages.filter(page =>
            page.getShouldShowInSummary?.(category) ?? true
        )
    }

    const renderFooterComponent: (() => ReactNode) = () =>
        <div className="Done">
            <div className="done-button">
                <FlatButton
                    label="Done"
                    onClick={() => router.push(resultsPageUrl())}
                />
            </div>
        </div>

    function getFormattedQuestion(
        personalisationPage: PersonalisationPage
    ): string | null {
        return personalisationPage.summaryLabel ||
            personalisationPage.question || null
    }

    function getFormattedAnswers(personalisationPage: PersonalisationPage) {
        if (personalisationPage.summaryValue) {
            return personalisationPage.summaryValue
        }
        const savedAnswer = getSavedPersonalisationAnswer(
            personalisationPage
        )
        if (!savedAnswer) {
            return "None selected";
        } else if (savedAnswer instanceof Array) {
            const nSelected = savedAnswer.length;

            if (nSelected === 0) {
                return "None selected";
            } else if (nSelected > 3) {
                return `${nSelected} selected`;
            } else {
                return savedAnswer.join(", ")
            }
        } else {
            return savedAnswer
        }
    }

    return (
        <div className="PersonalisationPage PersonalisationSummaryPage">
            <HeaderBar
                primaryText={
                    <div>
                    Change your answers here
                    </div>
                }
                bannerName={getBannerName(
                    getCategoryFromRouter(router)
                )}
                fixedAppBar={true}
                backMessage={"Back to results"}
                backUrl={resultsPageUrl()}
                taperColour="Grey"
            />

            <WithStickyFooter
                footerContents={renderFooterComponent()}
            >
                <div className="List">
                    <ul>
                        {router.isReady ?
                            personalisationPages().map((page, index) => (
                                <li key={index}>
                                    <LinkListItem
                                        className="SummaryItem"
                                        to={getServicesPath({
                                            router,
                                            personalisationPage: page,
                                        })}
                                        primaryText={
                                            getFormattedQuestion(page)
                                        }
                                        secondaryText={
                                            router.isReady ?
                                                getFormattedAnswers(page)
                                                : ""
                                        }
                                    />
                                </li>
                            ))
                            : <div className="loadingStatus"><Loading className="big" /></div>
                        }
                    </ul>
                </div>
                <div className="ClearResults">
                    <div>
                        Want me to forget what I know about you?
                    </div>
                    <div className="clear-button">
                        <Link
                            to="#"
                            onClick={clearAll}
                        >
                            Clear all answers and restart search
                        </Link>
                    </div>
                </div>
                <Spacer/>
            </WithStickyFooter>
        </div>
    )
}

export default (
    withRouter(PersonalisationSummaryPage):
        Class<
            React$Component<
                $Diff<
                    ReactElementConfig<typeof PersonalisationSummaryPage>,
                    {router: *}
                >
            >
        >
)