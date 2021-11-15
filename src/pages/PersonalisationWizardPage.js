/* @flow */

import * as React from "react";
import type {ElementConfig as ReactElementConfig} from "react";

import Intro from "./personalisation/Intro";
import NotFoundStaticPage from "./NotFoundStaticPage";
import routerContext from "../contexts/router-context";
import Category from "../constants/Category"
import {
    navigateToPersonalisationSubpath,
    getPersonalisationPages,
    getCurrentPersonalisationPage,
    getCurrentPersonalisationPageIndex,
    getCategoryFromRouter,
    getPageTitleFromRouter,
    setLocationFromUrl,
} from "../utils/personalisation"

import type {PersonalisationPage} from "../utils/personalisation"
type State = {
  showSubpage: boolean,
  category: ?Category,
  nextDisabled: boolean
}

class PersonalisationWizardPage extends React.Component<{}, State> {
    constructor(props: Object, context: Object) {
        super(props, context);

        this.state = {
            nextDisabled: false,
            showSubpage: true,
            category: getCategoryFromRouter(context.router),
        };
    }

    static contextType: any = routerContext;

    static getDerivedStateFromProps(
        props: ReactElementConfig<typeof PersonalisationWizardPage>,
        state: State
    ): State {
        return {
            ...state,
            nextDisabled: false,
            showSubpage: true,
        };
    }

    componentDidMount(): void {
        setLocationFromUrl(this.context.router)

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
        subpage: PersonalisationPage
    ): void {
        /* TODO: Narrow down which components don't have defaultProps */

        navigateToPersonalisationSubpath(
            this.context.router,
            `personalise/page/${subpage.defaultProps.name}`
        );
    }

    nextSubPage(): ?PersonalisationPage {
        return this.personalisationComponents.find((component, idx) =>
            (idx > this.currentComponentIdx) &&
            (component.getSearch ? !component.getSearch({}) : true)
        );
    }

    prevSubPage(): ?PersonalisationPage {
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
    get personalisationComponents(): Array<PersonalisationPage> {
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

        return currentComponent?.title ||
            getPageTitleFromRouter(this.context.router);
    }

    render(): React.Node {
        const Subpage = this.personalisationComponents[this.currentComponentIdx]

        if (!Subpage) {
            throw new Error("Unexpected");
        }

        if (
            !this.state.category &&
            !this.context.router.match.params.search
        ) {
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
                    category={this.state.category}
                    backToAnswers={false}
                />
            </div>
        );
    }

}

export default PersonalisationWizardPage;
