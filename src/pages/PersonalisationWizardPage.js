/* @flow */

import * as React from "react";
import type {ElementConfig as ReactElementConfig} from "react";

import BaseCategoriesPage from "./BaseCategoriesPage";
import Intro from "./personalisation/Intro";
import NotFoundStaticPage from "./NotFoundStaticPage";
import routerContext from "../contexts/router-context";
import {
    navigateToPersonalisationSubpath,
    getPersonalisationPages,
    getCurrentPersonalisationPage,
    getCurrentPersonalisationPageIndex,
} from "../utils/personalisation"

import type {PersonalisationPageType} from "../utils/personalisation"
type State = {
  showSubpage: boolean,
}

class PersonalisationWizardPage extends BaseCategoriesPage<{}, State> {

    constructor(props: Object, state: Object) {
        super(props, state);

        this.state = {
            nextDisabled: false,
            showSubpage: true,
        };
    }

    static contextType: any = routerContext;

    static getDerivedStateFromProps(
        props: ReactElementConfig<typeof PersonalisationWizardPage>,
        state: State
    ): State {
        return {nextDisabled: false, showSubpage: true};
    }

    componentDidMount(): void {
        if (
            this.context.router.match.params.search ===
                "bushfires -(closed due to the recent bushfires)"
        ) {
            this.setState({showSubpage: false });
        }
    }

    goToCategoryPage(): void {
        navigateToPersonalisationSubpath(this.context.router, "");
    }

    goToSubPage(
        subpage: PersonalisationPageType
    ): void {
        /* TODO: Narrow down which components don't have defaultProps */

        navigateToPersonalisationSubpath(
            this.context.router,
            `personalise/page/${subpage.defaultProps.name}`
        );
    }

    nextSubPage(): ?PersonalisationPageType {
        return this.personalisationComponents.find((component, idx) =>
            (idx > this.currentComponentIdx) &&
            (component.getSearch ? !component.getSearch({}) : true)
        );
    }

    prevSubPage(): ?PersonalisationPageType {
        const nextSubpageIdx = this.currentComponentIdx - 1;

        return this.personalisationComponents[nextSubpageIdx];
    }

    nextStep: () => void = () => {
        if (this.state.nextDisabled) {
            return
        }

        this.refs?.subpage?.onNextStep?.();
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
    get personalisationComponents(): Array<PersonalisationPageType> {
        return [
            Intro,
            ...getPersonalisationPages(
                this.context.router
            ),
        ];
    }

    get currentComponentIdx(): number {
        const sup = getCurrentPersonalisationPageIndex(
            this.context.router,
            this.personalisationComponents
        );

        if (sup === -1) {
            return 0;
        }

        return sup;
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

        const currentComponent = getCurrentPersonalisationPage(
            this.context.router
        )

        return currentComponent?.title || this.title;
    }

    render(): React.Node {
        const Subpage = this.personalisationComponents[this.currentComponentIdx]

        if (!Subpage) {
            throw new Error("Unexpected");
        }

        if (!this.category &&
            (this.search.q === "undefined-search")) {
            return (
                <NotFoundStaticPage/>
            )
        }

        if (!this.state.showSubpage) {
            this.nextStep();
        }

        // FIXME: Tap-up is hitting the new questions on the next page
        return (
            <div className="PersonalisationPage">
                <Subpage
                    ref="subpage"
                    onDoneTouchTap={this.nextStep}
                    category={this.category}
                    backToAnswers={false}
                />
            </div>
        );
    }

}

export default PersonalisationWizardPage;
