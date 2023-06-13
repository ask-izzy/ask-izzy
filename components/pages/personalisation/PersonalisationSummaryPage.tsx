import React, {useEffect, ReactNode} from "react"
import {withRouter} from "next/router"
import type {NextRouter} from "next/router"

import WithStickyFooter from "@/src/components/WithStickyFooter.js";
import Spacer from "@/src/components/Spacer.js";
import FlatButton from "@/src/components/FlatButton.js"
import HeaderBar from "@/src/components/HeaderBar.js"
import LinkListItem from "@/src/components/LinkListItem.js"
import Link from "@/src/components/base/Link.js"
import storage from "@/src/storage.js";
import {isDisabilityAdvocacySearch} from "@/src/iss/serviceSearch.js"
import {
    getBannerName,
    setLocationFromUrl,
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"
import {
    getPersonalisationPages,
    getPersonalisationNextPath,
    getServicesPath,
    getCategoryFromRouter,
    getPathOfSSRPage,
} from "@/src/utils/routing.js"
import type {
    PersonalisationPage,
} from "@/types/personalisation-page.js"

type Props = {
    router: NextRouter
}

function PersonalisationSummaryPage({router}: Props) {

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

        return personalisationPages.filter(page =>
            page.shouldShowInSummary ?? true,
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
        personalisationPage: PersonalisationPage,
    ): string | null {
        return personalisationPage.summaryLabel ||
            (personalisationPage as any).question || null
    }

    function getFormattedAnswers(personalisationPage: PersonalisationPage) {
        if (personalisationPage.summaryValue) {
            return personalisationPage.summaryValue
        }
        const savedAnswer = getSavedPersonalisationAnswer(
            personalisationPage,
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
        <div className="PersonalisationPage">
            <HeaderBar
                primaryText={
                    <div>
                    Change your answers here
                    </div>
                }
                bannerName={getBannerName(
                    getCategoryFromRouter(router),
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
                        {personalisationPages().map((page, index) => {
                            const toUrl = router.isReady ?
                                getServicesPath({
                                    router,
                                    personalisationPage: page,
                                })
                                : getPathOfSSRPage(router);
                            return (
                                <li key={index}>
                                    <LinkListItem
                                        className="SummaryItem"
                                        to={toUrl}
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
                            )
                        })}
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

export default (withRouter(PersonalisationSummaryPage))