/* @flow */

import React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import components from "../components";
import storage from "../storage";

class PersonalisationSummaryPage extends BasePersonalisationPage {

    previousStep(): void {
        this.props.history.goBack();
    }

    nextStep(): void {
        super.nextStep();
        this.props.history.goBack();
    }

    clearAll(): void {
        storage.clear();
        this.props.history.pushState(
            null,
            "/",
            {}
        );
    }

    render(): ReactElement {
        const Subpage = this.currentComponent;

        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title="Personalise"
                    onBackTouchTap={this.previousStep.bind(this)}
                />
                {Subpage ?
                    <div>
                        {<Subpage ref="subpage" />}
                        <div className="done-button">
                            <components.FlatButton
                                label="Done"
                                onTouchTap={this.nextStep.bind(this)}
                            />
                        </div>
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
                        secondaryText={
                            <a
                                href="#"
                                className="clickable"
                                onTouchTap={this.clearAll.bind(this)}
                            >
                                Clear all
                            </a>
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

                    <div className="padded">
                        All of your answers are private and anonymous.
                    </div>
                    <div className="okay-button">
                        <components.FlatButton
                            label="Okay"
                            onTouchTap={this.previousStep.bind(this)}
                        />
                    </div>
                </div>}
            </div>
        );
    }

}

export default PersonalisationSummaryPage;
