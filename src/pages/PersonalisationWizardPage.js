/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import _ from 'underscore';

import BasePersonalisationPage from './BasePersonalisationPage';
import Intro from './personalisation/Intro';
import categories from '../constants/categories';
import components from '../components';
import icons from '../icons';

class PersonalisationWizardPage extends BasePersonalisationPage {

    // flow:disable
    get personalisationComponents(): Array<React.Component> {
        var components = super.personalisationComponents;

        /* Append the intro page as one of our components */
        return [Intro].concat(components);
    }

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

        if (subpage == this.personalisationComponents.length) {
            var params = this.getParams();

            if (_.has(params, 'page')) {
                this.replaceWith('category', params);
            } else if (_.has(params, 'search')) {
                this.replaceWith('search', params);
            } else {
                throw new Error("Unexpected");
            }

        } else {
            this.setState({subpage: subpage});
        }
    }

    render(): React.Element {
        var subpage = this.personalisationComponents[this.state.subpage];
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
