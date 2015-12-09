/* @flow */

import React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import components from "../components";
import storage from "../storage";

class PersonalisationSummaryPage extends BasePersonalisationPage {

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
                                This is what you said you need.
                                Change your answers here.
                            </div>
                        }
                    />
                    <div className="List">{
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
                    }</div>

                    <div className="ClearResults">
                        <div className="done-button">
                            <components.FlatButton
                                label="Delete all answers"
                                className="text-link"
                                onClick={this.clearAll.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="Done">
                        <div className="done-button">
                            <components.FlatButton
                                label="Done"
                                onClick={this.goBack.bind(this)}
                            />
                        </div>
                    </div>

                </div>}
            </div>
        );
    }

}

export default PersonalisationSummaryPage;
