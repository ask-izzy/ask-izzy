/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
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
    getPathOfSSRPage,
} from "@/src/utils/routing"
import type {
    PersonalisationPage,
} from "@/flow/personalisation-page"

type Props = {
    router: NextRouter
}

class PersonalisationSummaryPage extends React.Component<Props> {

    componentDidMount(): void {
        if (this.props.router.isReady) {
            // router ready here when navigated to after first load
            this.clientSideInit()
        }
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (
            this.props.router.isReady &&
                (this.props.router !== prevProps.router)
        ) {
            // router ready here when loading the page for the first time
            this.clientSideInit()
        }
    }

    clientSideInit(): void {
        setLocationFromUrl(this.props.router)
    }

    get resultsPageUrl(): string {
        return getPersonalisationNextPath({
            router: this.props.router,
            summary: false,
        });
    }

    clearAll(event: SyntheticInputEvent<>): void {
        event.preventDefault();
        const myList = storage.getJSON("my-list-services");
        storage.clear();
        storage.setJSON("my-list-services", myList)

        let redirectUrl = "/"
        if (isDisabilityAdvocacySearch(this.props.router)) {
            redirectUrl = "/disability-advocacy-finder"
        }
        this.props.router.push(redirectUrl);
    }

    get personalisationPages(): Array<PersonalisationPage> {
        const personalisationPages = getPersonalisationPages(
            this.props.router
        )

        return personalisationPages.filter(page =>
            page.shouldShowInSummary ?? true
        );
    }

    renderFooterComponent: (() => React.Node) = () => <>
        <div className="Done">
            <div className="done-button">
                <FlatButton
                    label="Done"
                    onClick={() => this.props.router.push(this.resultsPageUrl)}
                />
            </div>
        </div>
    </>

    render(): ReactNode {
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
            <div className="PersonalisationPage">
                <HeaderBar
                    primaryText={
                        <div>
                        Change your answers here
                        </div>
                    }
                    bannerName={getBannerName(
                        getCategoryFromRouter(this.props.router)
                    )}
                    fixedAppBar={true}
                    backMessage={"Back to results"}
                    backUrl={this.resultsPageUrl}
                    taperColour="Grey"
                />

                <WithStickyFooter
                    ref="floatingDone"
                    footerContents={this.renderFooterComponent()}
                >
                    <div className="List">
                        <ul>
                            {this.personalisationPages.map((page, index) => {
                                const toUrl = this.props.router.isReady ?
                                    getServicesPath({
                                        router: this.props.router,
                                        personalisationPage: page,
                                    })
                                    : getPathOfSSRPage(this.props.router);
                                return (
                                    <li key={index}>
                                        <LinkListItem
                                            className="SummaryItem"
                                            to={toUrl}
                                            primaryText={
                                                getFormattedQuestion(page)
                                            }
                                            secondaryText={
                                                this.props.router.isReady ?
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
                                onClick={this.clearAll.bind(this)}
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
}

export default (
    withRouter(PersonalisationSummaryPage):
        Class<
            React$Component<
                $Diff<
                    React.ElementConfig<typeof PersonalisationSummaryPage>,
                    {router: *}
                >
            >
        >
)