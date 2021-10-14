/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";

import components from "../components";
import WithStickyFooter from "../components/WithStickyFooter";
import Spacer from "../components/Spacer";
import storage from "../storage";
import routerContext from "../contexts/router-context";
import ScreenReader from "../components/ScreenReader";
import {isDisabilityAdvocacySearch} from "../iss/serviceSearch"
import {
    getFullPathForPersonalisationSubpath,
    navigateToPersonalisationSubpath,
    getCurrentPersonalisationPage,
    getPersonalisationPages,
    getBannerName,
    getCategoryFromRouter,
    setLocationFromUrl,
} from "../utils/personalisation"
import type {
    PersonalisationPage,
} from "../utils/personalisation"

class PersonalisationSummaryPage extends React.Component<{}, {}> {

    static contextType: any = routerContext;

    componentDidMount(): void {
        setLocationFromUrl(this.context.router)
    }

    goBack(): void {
        if (this.currentPersonalisationPage) {
            navigateToPersonalisationSubpath(
                this.context.router,
                "personalise/summary"
            );
        } else {
            navigateToPersonalisationSubpath(
                this.context.router,
                ""
            );
        }
    }

    nextStep: (() => void) = () => {
        this.refs.subpage?.onNextStep?.()
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

    get personalisationComponents(): any {
        const personalisationPages = getPersonalisationPages(
            this.context.router
        )

        return personalisationPages.filter(component =>
            (typeof component.showInSummary === "function") &&
            // $FlowIgnore
            component.showInSummary()
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

    render(): React.Element<"div"> {
        const Subpage = getCurrentPersonalisationPage(
            this.context.router
        );

        return (
            <div className="PersonalisationPage">
                <main aria-labelledby="answers">
                    <ScreenReader>
                        <span id="answers">
                            Selected answers.
                        </span>
                    </ScreenReader>
                    {Subpage ?
                        this.renderSubpage(Subpage)
                        : this.renderSummary()
                    }
                </main>
            </div>
        );
    }

    renderSubpage: ((Subpage: PersonalisationPage) => ReactNode) =
        (Subpage) => (
            <div>
                <Subpage
                    ref="subpage"
                    onDoneTouchTap={this.nextStep}
                    category={getCategoryFromRouter(this.context.router)}
                    nextStep={this.nextStep}
                    backToAnswers={true}
                    goBack={() => this.goBack()}
                />
            </div>
        )

    renderSummary: (() => React.Element<"div">) = () => (
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
                        {
                            this.personalisationComponents.map(
                                (component, index) => {
                                    const toUrl =
                                        getFullPathForPersonalisationSubpath(
                                            this.context.router,
                                            `personalise/summary/${
                                                component.defaultProps.name
                                            }`
                                        );
                                    return (
                                        <li key={index}>
                                            <components.LinkListItem
                                                className="SummaryItem"
                                                to={toUrl}
                                                primaryText={
                                                    component.summaryLabel ?
                                                        component.summaryLabel
                                                        : ""
                                                }
                                                secondaryText={
                                                    component.summaryValue
                                                }
                                            />
                                        </li>
                                    )
                                }
                            )
                        }
                    </ul>
                </div>
                <div className="ClearResults">
                    <div>
                        Want me to forget what I know about you?
                    </div>
                    <div
                        className="clear-button"
                    >
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

export default PersonalisationSummaryPage;
