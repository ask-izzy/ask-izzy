/* @flow */

import React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import components from "../components";
import FloatFromBottom from "../components/FloatFromBottom";
import storage from "../storage";

class PersonalisationSummaryPage extends BasePersonalisationPage {

    constructor(props: Object) {
        super(props);
        this.state = {floatingContainerHeight: 0};
    }

    goBack(): void {
        super.nextStep();
        if (this.currentComponent) {
            this.navigate("personalise/summary");
        } else {
            this.navigate("");
        }
    }

    nextStep(): void {
        this.goBack();
    }

    clearAll(event: SyntheticInputEvent): void {
        event.preventDefault();
        storage.clear();
        this.props.history.pushState(
            null,
            "/",
            {}
        );
    }

    componentDidMount(): void {
        if (this.refs.floatingDone &&
            this.refs.floatingDone.containerHeight) {
            this.setState({
                floatingContainerHeight:
                    this.refs.floatingDone.containerHeight(),
            });
        }
    }

    render(): ReactElement {
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
                            suppressDoneButton={true}
                            onDoneTouchTap={this.nextStep.bind(this)}
                        />
                    </div>

                : <div>
                    <components.HeaderBar
                        primaryText={
                            <div>
                                <components.LogoWithShadow />
                                Change your answers here
                            </div>
                        }
                    />

                    <div className="List">
                        {
                            this.personalisationComponents
                                .map((component, index) =>
                                    <components.LinkListItem
                                        key={index}
                                        className="SummaryItem"
                                        to={this.urlFor(
                                            `personalise/summary/${
                                                component.defaultProps.name
                                            }`
                                        )}
                                        primaryText={component.summaryLabel}
                                        secondaryText={component.summaryValue}
                                    />
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
