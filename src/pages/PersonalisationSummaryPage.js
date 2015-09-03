/* @flow */

"use strict";

import React from 'react';
import mui from "material-ui";

import BasePersonalisationPage from './BasePersonalisationPage';
import components from '../components';
import icons from '../icons';

class PersonalisationSummaryPage extends BasePersonalisationPage {

    previousStep(): void {
        if (this.state.subpage == 0) {
            console.log("FIXME: return to category page");
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
                <mui.List>{
                    this.personalisationComponents.map(
                        (component, index) => <mui.ListItem
                            key={index}
                            primaryText={component.summaryLabel}
                            secondaryText={component.summaryValue}
                        />
                    )
                }</mui.List>
            </div>
        );
    }

}

export default PersonalisationSummaryPage;
