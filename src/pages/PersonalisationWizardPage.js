/* @flow */

import React from "react";
import _ from "underscore";

import BasePersonalisationPage from "./BasePersonalisationPage";
import Intro from "./personalisation/Intro";
import components from "../components";

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
            this.props.history.goBack();
        } else {
            this.setState({subpage: subpage});
        }
    }

    nextStep(): void {
        var subpage = this.state.subpage + 1;

        // Advance until we find an unanswered question.
        while (
            this.personalisationComponents[subpage] &&
            this.personalisationComponents[subpage].getSearch({})
        ) {
            subpage += 1;
        }

        if (subpage >= this.personalisationComponents.length) {
            var params = this.props.params;

            if (_.has(params, "page")) {
                this.history.replaceState(
                    null,
                    `/category/${params.page}`,
                    {}
                );
            } else if (_.has(params, "search")) {
                this.history.replaceState(
                    null,
                    `/search/${params.search}`,
                    {}
                );
            } else {
                throw new Error("Unexpected");
            }

        } else {
            this.setState({subpage: subpage});
        }
    }

    render(): ReactElement {
        var subpage = this.personalisationComponents[this.state.subpage];

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
