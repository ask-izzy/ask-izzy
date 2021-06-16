/* @flow */

import * as React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import components from "../components";
import FloatFromBottom from "../components/FloatFromBottom";
import storage from "../storage";
import routerContext from "../contexts/router-context";

class PersonalisationSummaryPage extends BasePersonalisationPage {

    constructor(props: Object) {
        super(props);
        this.state = {floatingContainerHeight: 0};
    }

    static contextType = routerContext;

    goBack(): void {
        super.nextStep();
        if (this.currentComponent) {
            this.navigate("personalise/summary");
        } else {
            this.navigate("");
        }
    }

    nextStep = () => {
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

    componentDidMount(): void {
        super.componentDidMount();

        if (this.refs.floatingDone &&
            this.refs.floatingDone.containerHeight) {
            this.setState({
                floatingContainerHeight:
                    this.refs.floatingDone.containerHeight(),
            });
        }
    }

    get personalisationComponents() {
        const components = super.personalisationComponents;

        return components.filter(component =>
            (typeof component.showInSummary === "function") &&
            component.showInSummary()
        );
    }

    render() {
        const Subpage = this.currentComponent;
        const backMessage = Subpage ? "Answers" : this.title;
        const title = Subpage ? Subpage.title : "Answers";

        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title={title}
                    onBackTouchTap={this.goBack.bind(this)}
                    backMessage={backMessage}
                />
                {Subpage ?
                    <div>
                        <Subpage
                            ref="subpage"
                            onDoneTouchTap={this.nextStep}
                            category={this.category}
                            nextStep={this.nextStep}
                            previousStep={this.previousStep}
                        />
                    </div>

                    : <div>
                        <components.HeaderBar
                            primaryText={
                                <div>
                                Change your answers here
                                </div>
                            }
                            bannerName={
                                this.category?.bannerImage || "homepage"
                            }
                            taperColour="Grey"
                        />

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

                            <FloatFromBottom
                                ref="floatingDone"
                                includeOffsetElement={false}
                            >
                                <div className="Done">
                                    <div className="done-button">
                                        <components.FlatButton
                                            label="Done"
                                            onClick={this.goBack.bind(this)}
                                        />
                                    </div>
                                </div>
                            </FloatFromBottom>

                            <div className="ClearResults">
                                <div>
                                Want me to forget what I know about you?
                                </div>
                                <div className="clear-button">
                                    <components.FlatButton
                                        label="Delete all answers"
                                        onClick={this.clearAll.bind(this)}
                                    />
                                </div>
                            </div>

                            {/*
                          * The following makes the parent element
                          * tall enough when floating the child elements
                          * so that they don't prevent
                          * scrolling to the bottom.
                          */}
                            <div
                                style={{
                                    height: this.state.floatingContainerHeight,
                                }}
                            >
                            &nbsp;
                            </div>

                        </div>

                    </div>}
            </div>
        );
    }

}

export default PersonalisationSummaryPage;
