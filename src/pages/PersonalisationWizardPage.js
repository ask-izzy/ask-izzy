/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";
import _ from "underscore";

import BasePersonalisationPage from './BasePersonalisationPage';
import categories from '../constants/categories';
import components from '../components';
import icons from '../icons';

class PersonalisationWizardPage extends BasePersonalisationPage {
    previousStep(): void {
        var subpage = this.state.subpage - 1;

        if (subpage < 0) {
            this.goBack();
        } else {
            this.setState({subpage: subpage});
        }
    }

    nextStep(): void {
        var subpage = this.state.subpage + 1;

        if (subpage == this.category.personalisation.length) {
            this.replaceWith('category', this.getParams());
        } else {
            this.setState({subpage: subpage});
        }
    }

    render(): React.Element {
        var subpage = this.category.personalisation[this.state.subpage];
        console.log(subpage);

        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title="Personalise"
                    onBackTouchTap={this.previousStep.bind(this)}
                />
                {React.createElement(subpage)}
            </div>
        );
    }

}

export default PersonalisationWizardPage;
