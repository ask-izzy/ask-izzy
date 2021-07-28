/* @flow */

import * as React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import components from "../components";
import WithStickyFooter from "../components/WithStickyFooter";
import Spacer from "../components/Spacer";
import storage from "../storage";
import routerContext from "../contexts/router-context";
import ScreenReader from "../components/ScreenReader";

class PersonalisationSummaryPage extends BasePersonalisationPage {

    static contextType: any = routerContext;

    goBack(): void {
        super.nextStep();
        if (this.currentComponent) {
            this.navigate("personalise/summary");
        } else {
            this.navigate("");
        }
    }

    nextStep: (() => void) = () => {
        this.goBack();
    }

    clearAll(event: SyntheticInputEvent<>): void {
        event.preventDefault();
        storage.clear();
        let redirectUrl = "/"
        if (this.search.q === "Disability Advocacy Providers") {
            redirectUrl = "/disability-advocacy-finder"
        }
        this.context.router.navigate(redirectUrl);
    }

    get personalisationComponents(): any {
        const components = super.personalisationComponents;

        return components.filter(component =>
            (typeof component.showInSummary === "function") &&
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
        const Subpage = this.currentComponent;

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

    renderSubpage: ((
  Subpage: React$ComponentType<

      | any
      | {|
        category: any,
        nextStep: () => void,
        onDoneTouchTap: () => void,
        previousStep: any,
      |},
  >
) => React.Element<"div">) = (Subpage: React$ComponentType<*>) => (
    <div>
        <Subpage
            ref="subpage"
            onDoneTouchTap={this.nextStep}
            category={this.category}
            nextStep={this.nextStep}
            backToAnswers={true}
            previousStep={this.previousStep}
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
                bannerName={
                    this.category?.bannerImage || "homepage"
                }
                fixedAppBar={true}
                goBack={{
                    backMessage: this.currentComponent ?
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
                    {
                        this.personalisationComponents.map(
                            (component, index) => {
                                const toUrl = this.urlFor(
                                    `personalise/summary/${
                                        component.defaultProps.name
                                    }`
                                );

                                return (
                                    <components.LinkListItem
                                        key={index}
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
                                )
                            }
                        )
                    }
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
