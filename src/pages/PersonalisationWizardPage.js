/* @flow */

import React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import Intro from "./personalisation/Intro";
import components from "../components";

class PersonalisationWizardPage extends BasePersonalisationPage {

    nextStep(): void {
        // Start from the beginning in case an earlier question
        // was not answered (eg we landed here via a bookmark)
        let nextSubpageIdx = 0;

        // Advance until we find an unanswered question.
        while (
            this.personalisationComponents[nextSubpageIdx] &&
            this.personalisationComponents[nextSubpageIdx].getSearch({})
        ) {
            nextSubpageIdx += 1;
        }

        if (nextSubpageIdx >= this.personalisationComponents.length) {
            // Go on to the category page
            this.navigate("");
        } else {
            const subpage = this.personalisationComponents[nextSubpageIdx];

            this.navigate(`personalise/page/${subpage.defaultProps.name}`);
        }
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
                    React.createElement(subpage) : <Intro/>
                }
            </div>
        );
    }

}

export default PersonalisationWizardPage;
