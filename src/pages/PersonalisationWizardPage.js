/* @flow */

import React from "react";

import BasePersonalisationPage from "./BasePersonalisationPage";
import Intro from "./personalisation/Intro";
import components from "../components";
import Chevron from "../icons/Chevron";

class PersonalisationWizardPage extends BasePersonalisationPage {

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    constructor(props: Object) {
        super(props);
        this.state = {nextDisabled: false};
    }

    componentWillReceiveProps(nextProps: Object): void {
        this.setState({nextDisabled: false});
    }

    previousStep(): void {
        const prevSubPage = this.prevSubPage();

        this.setState({nextDisabled: false});

        if (prevSubPage) {
            this.goToSubPage(prevSubPage);
        } else {
            this.context.router.push("/");
        }
    }

    goToCategoryPage(): void {
        this.navigate("");
    }

    goToSubPage(subpage: ReactClass): void {
        this.navigate(`personalise/page/${subpage.defaultProps.name}`);
    }

    nextSubPage(): ?ReactClass {
        return this.personalisationComponents.find((component, idx) =>
            (idx > this.currentComponentIdx) &&
            (!component.getSearch({}))
        );
    }

    prevSubPage(): ?ReactClass {
        const nextSubpageIdx = this.currentComponentIdx - 1;

        return this.personalisationComponents[nextSubpageIdx];
    }

    nextStep(): void {
        if (this.state.nextDisabled) {
            return
        }

        super.nextStep();
        this.setState({nextDisabled: false});

        const nextPage = this.nextSubPage()

        if (!nextPage) {
            this.goToCategoryPage();
        } else {
            this.goToSubPage(nextPage);
        }
    }

    /**
     * personalisationComponents:
     *
     * An array of components required to personalise this category.
     */
    get personalisationComponents(): Array<ReactClass> {
        return [Intro].concat(super.personalisationComponents);
    }

    get currentComponentIdx(): number {
        const sup = super.currentComponentIdx;

        if (sup == -1) {
            return 0;
        } else {
            return sup;
        }
    }

    render(): ReactElement {
        const Subpage = this.currentComponent;
        const prevPage = this.prevSubPage()
        const backMessage = prevPage ?
            prevPage.title
            : "Categories";

        if (!Subpage) {
            throw new Error("Unexpected");
        }

        // FIXME: Tap-up is hitting the new questions on the next page
        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title={Subpage.title || this.title}
                    onBackTouchTap={this.previousStep.bind(this)}
                    backMessage={backMessage}
                    forwardMessage="Next"
                    forwardIcon={<Chevron alt="" />}
                    forwardEnabled={
                        !this.state.nextDisabled
                    }
                    slideForwardIn={true}
                />
                <Subpage
                    ref="subpage"
                    onDoneTouchTap={this.nextStep.bind(this)}
                />
            </div>
        );
    }

}

export default PersonalisationWizardPage;
