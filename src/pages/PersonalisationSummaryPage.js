/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";

import components from "../components";
import WithStickyFooter from "../components/WithStickyFooter";
import Spacer from "../components/Spacer";
import storage from "../storage";
import routerContext from "../contexts/router-context";
import {isDisabilityAdvocacySearch} from "../iss/serviceSearch"
import {
    getFullPathForPersonalisationSubpath,
    navigateToPersonalisationSubpath,
    getBannerName,
    setLocationFromUrl,
    getSavedPersonalisationAnswer,
} from "../utils/personalisation"
import {
    getPersonalisationPages,
    getCurrentPersonalisationPage,
    getCategoryFromRouter,
} from "../utils/routing"
import type {
    PersonalisationPage,
} from "../../flow/personalisation-page"
import RenderPersonalisationPage
    from "./personalisation/RenderPersonalisationPage"

class PersonalisationSummaryPage extends React.Component<{}, {}> {

    static contextType: any = routerContext;

    componentDidMount(): void {
        setLocationFromUrl(this.context.router)
    }

    goBack(): void {
        navigateToPersonalisationSubpath(
            this.context.router,
            this.currentPersonalisationPage ? "personalise/summary" : ""
        );
    }

    nextStep: (() => void) = () => {
        this.goBack();
    }

    get currentPersonalisationPage(): $Call<
        typeof getCurrentPersonalisationPage,
        Object
        > {
        return getCurrentPersonalisationPage(
            this.context.router
        )
    }

    clearAll(event: SyntheticInputEvent<>): void {
        event.preventDefault();
        storage.clear();
        let redirectUrl = "/"
        if (isDisabilityAdvocacySearch(this.context.router)) {
            redirectUrl = "/disability-advocacy-finder"
        }
        this.context.router.navigate(redirectUrl);
    }

    get personalisationPages(): Array<PersonalisationPage> {
        if (typeof window === "undefined") {
            return []
        }
        const personalisationPages = getPersonalisationPages(
            this.context.router
        )

        return personalisationPages.filter(page =>
            page.shouldShowInSummary ?? true
        );
    }

    renderFooterComponent: (() => React.Node) = () => <>
        <div className="Done">
            <div className="done-button">
                <components.FlatButton
                    label="Done"
                    onClick={this.goBack.bind(this)}
                />
            </div>
        </div>
    </>

    render(): ReactNode {
        const personalisationPage = getCurrentPersonalisationPage(
            this.context.router
        );

        return (
            <div className="PersonalisationPage">
                {personalisationPage ?
                    <RenderPersonalisationPage
                        personalisationPage={personalisationPage}
                        onDoneTouchTap={this.nextStep}
                        backToAnswers={true}
                        goBack={() => this.goBack()}
                    />
                    : this.renderSummary()
                }
            </div>
        );
    }

    renderSummary(): ReactNode {
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
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                        Change your answers here
                        </div>
                    }
                    bannerName={getBannerName(
                        getCategoryFromRouter(this.context.router)
                    )}
                    fixedAppBar={true}
                    goBack={{
                        backMessage: this.currentPersonalisationPage ?
                            "Back to answers" : "Back to results",
                        onBackTouchTap: this.goBack.bind(this),
                    }}
                    taperColour="Grey"
                />

                <WithStickyFooter
                    ref="floatingDone"
                    footerContents={this.renderFooterComponent()}
                >
                    <div className="List">
                        <ul>
                            {this.personalisationPages.map(
                                (page, index) => {
                                    const toUrl =
                                        getFullPathForPersonalisationSubpath(
                                            this.context.router,
                                            `personalise/summary/${
                                                page.name
                                            }`
                                        );
                                    return (
                                        <li key={index}>
                                            <components.LinkListItem
                                                className="SummaryItem"
                                                to={toUrl}
                                                primaryText={
                                                    getFormattedQuestion(page)
                                                }
                                                secondaryText={
                                                    getFormattedAnswers(page)
                                                }
                                            />
                                        </li>
                                    )
                                }
                            )}
                        </ul>
                    </div>
                    <div className="ClearResults">
                        <div>
                            Want me to forget what I know about you?
                        </div>
                        <div className="clear-button">
                            <a
                                href="#"
                                onClick={this.clearAll.bind(this)}
                            >
                                Clear all answers and restart search
                            </a>
                        </div>
                    </div>
                    <Spacer/>
                </WithStickyFooter>
            </div>
        )
    }
}

export default PersonalisationSummaryPage;
