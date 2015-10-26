/* @flow */

import React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import components from "../components";
import icons from "../icons";

class PersonalisationSummaryPage extends BasePersonalisationPage {

    previousStep(): void {
        this.props.history.goBack();
    }

    nextStep(): void {
        this.props.history.goBack();
    }

    render(): ReactElement {
        const subpage = this.currentComponent;

        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title="Personalise"
                    onBackTouchTap={this.previousStep.bind(this)}
                />
                {subpage ?
                    React.createElement(subpage)
                : <div>
                    <components.HeaderBar
                        primaryText={
                            <div>
                                <icons.LogoLight />
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

                    <div className="padded">
                        All of your answers are private and anonymous.
                    </div>
                    <div className="done-button">
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
