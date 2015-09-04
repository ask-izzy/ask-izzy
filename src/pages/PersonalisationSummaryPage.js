/* @flow */

"use strict";

import React from 'react';
import mui from "material-ui";
import _ from 'underscore';

import BasePersonalisationPage from './BasePersonalisationPage';
import components from '../components';
import icons from '../icons';

class PersonalisationSummaryPage extends BasePersonalisationPage {

    previousStep(): void {
        if (this.state.subpage == 0) {
            this.goBack();
        } else {
            console.log("FIXME: close component");
        }
    }

    nextStep(): void {
        console.log("FIXME: close component");
    }

    render(): React.Element {
        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title="Personalise"
                    onBackTouchTap={this.previousStep.bind(this)}
                />
                <components.HeaderBar
                    primaryText={
                        <div>
                            <icons.LogoLight className="Logo" />
                            This is what I think I know about you.
                            Change your answers here.
                        </div>
                    }
                />
                <mui.List className="List">{
                    this.personalisationComponents.map(
                        (component, index) => <mui.ListItem
                            key={index}
                            className="ListItem"

                            primaryText={<span className="primaryText">{
                                component.summaryLabel
                            }</span>}
                            secondaryText={<span className="secondaryText">{
                                component.summaryValue
                            }</span>}

                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    )
                }</mui.List>

                <div className="padded">
                    All of your answers are private and anonymous and are
                    never stored anywhere. When you close I will forget them.
                </div>
            </div>
        );
    }

}

export default PersonalisationSummaryPage;
