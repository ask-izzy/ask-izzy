/* flow:disable */

import * as React from "react";
import PropTypes from "proptypes";

import BasePersonalisationPage from "./BasePersonalisationPage";
import Intro from "./personalisation/Intro";
import components from "../components";
import Chevron from "../icons/Chevron";

class PersonalisationWizardPage extends BasePersonalisationPage {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    constructor(props: Object) {
        super(props);
        this.state = {nextDisabled: false};
    }

    componentWillReceiveProps(nextProps: Object): void {
        this.setState({nextDisabled: false});
    }

    previousStep(): void {
        if (this.refs.subpage && this.refs.subpage.onPreviousStep) {
            if (!this.refs.subpage.onPreviousStep(
                this.forceUpdate.bind(this)
            )) {
                return;
            }
        }

        this.setState({nextDisabled: false});

        const prevSubPage = this.prevSubPage();

        if (prevSubPage) {
            this.goToSubPage(prevSubPage);
        } else {
            this.context.router.push("/");
        }
    }

    goToCategoryPage(): void {
        this.navigate("");
    }

    goToSubPage(subpage: React.ComponentType<any>): void {
        /* TODO: Narrow down which components don't have defaultProps */

        // flow:disable
        this.navigate(`personalise/page/${subpage.defaultProps.name}`);
    }

    nextSubPage(): ?React.ComponentType<*> {
        return this.personalisationComponents.find((component, idx) =>
            (idx > this.currentComponentIdx) &&
            (!component.getSearch({}))
        );
    }

    prevSubPage(): ?React.ComponentType<*> {
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
    get personalisationComponents(): Array<React.ComponentType<any>> {
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

    get backMessage(): string {
        if (this.refs.subpage && this.refs.subpage.customBackMessage) {
            return this.refs.subpage.customBackMessage;
        }

        const prevPage = this.prevSubPage();

        return prevPage ? prevPage.title : "Categories";
    }

    get pageTitle(): string {
        if (this.refs.subpage && this.refs.subpage.customPageTitle) {
            return this.refs.subpage.customPageTitle;
        }

        return this.currentComponent.title || this.title;
    }

    render() {
        const Subpage = this.currentComponent;

        if (!Subpage) {
            throw new Error("Unexpected");
        }

        // FIXME: Tap-up is hitting the new questions on the next page
        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    // TODO: Find where the types are set for the Subpage line
                    // and resolve the issue.
                    // flow:disable
                    title={this.pageTitle}
                    // flow:enable
                    onBackTouchTap={this.previousStep.bind(this)}
                    backMessage={this.backMessage}
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
                    onNextStepCallback={this.forceUpdate.bind(this)}
                />
            </div>
        );
    }

}

export default PersonalisationWizardPage;
