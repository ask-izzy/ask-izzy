/* @flow */

import React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import Intro from "./personalisation/Intro";
import components from "../components";
import Chevron from "../icons/Chevron";

class PersonalisationWizardPage extends BasePersonalisationPage {

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    previousStep(): void {
        super.previousStep();
        this.setState({nextDisabled: false});
    }

    nextStep(): void {
        if (this.state.nextDisabled) {
            return
        }

        super.nextStep();
        this.setState({nextDisabled: false});

        const nextSubpageIdx = this.currentComponentIdx + 1;

        if (nextSubpageIdx >= this.personalisationComponents.length) {
            // Go on to the category page
            this.navigate("");
        } else {
            const subpage = this.personalisationComponents[nextSubpageIdx];

            this.navigate(`personalise/page/${subpage.defaultProps.name}`);
        }
    }

    render(): ReactElement {
        const Subpage = this.currentComponent || Intro;

        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title="Personalise"
                    onBackTouchTap={this.previousStep.bind(this)}
                    onForwardTouchTap={this.nextStep.bind(this)}
                    forwardMessage="Next"
                    forwardIcon={<Chevron />}
                    forwardEnabled={
                        !this.state.nextDisabled
                    }
                    slideForwardIn={true}
                />
                <Subpage ref="subpage" />
            </div>
        );
    }

}

export default PersonalisationWizardPage;
