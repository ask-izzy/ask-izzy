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
                                This is what I think I know about you.
                                Change your answers here.
                            </div>
                        }
                    />
                    <div className="List">{
                        this.personalisationComponents
                            .map((component, index) =>
                                <div
                                    key={index}
                                    className="ListItem SummaryItem"
                                    onTouchTap={event => {
                                        this.navigate(
                                            `personalise/summary/${
                                                component.defaultProps.name
                                            }`
                                        );
                                    }}
                                ><div>
                                    <div className="primaryText">
                                        {component.summaryLabel}
                                    </div>
                                    <div className="secondaryText">
                                        {component.summaryValue}
                                    </div>
                                </div></div>
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
