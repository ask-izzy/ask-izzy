/* @flow */

import * as React from "react";
import type {ElementConfig as ReactElementConfig} from "react";

import NotFoundStaticPage from "./NotFoundStaticPage";
import routerContext from "../contexts/router-context";
import Category from "../constants/Category"
import {
    navigateToPersonalisationSubpath,
    getCurrentPersonalisationPage,
    getCategoryFromRouter,
    setLocationFromUrl,
    getPersonalisationPagesToShow,
} from "../utils/personalisation"
import WhoIsLookingForHelpPage from "./personalisation/WhoIsLookingForHelp"
import storage from "../storage"

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
                "bushfires -\"closed due to the recent bushfires\""
        ) {
            this.setState({showSubpage: false });
        }
    }

    goToCategoryPage(): void {
        navigateToPersonalisationSubpath(this.context.router, "");
    }

    goToSubPage(
        subpage: PersonalisationPage,
        navigateOptions?: {}
    ): void {
        navigateToPersonalisationSubpath(
            this.context.router,
            `personalise/page/${subpage.defaultProps.name}`,
            navigateOptions
        );
    }

    nextStep: () => void = () => {
        if (this.state.nextDisabled) {
            return
        }

        this.refs?.subpage?.onNextStep?.();
        this.setState({nextDisabled: false});

        const nextPage = getPersonalisationPagesToShow(this.context.router)[0]

        if (!nextPage) {
            this.goToCategoryPage();
        } else {
            this.goToSubPage(nextPage);
        }
    }

    render(): React.Node {
        if (this.context.router.match.props.path.match(/\/personalise$/)) {
            const pagesToShow = getPersonalisationPagesToShow(
                this.context.router
            )
            if (pagesToShow.length > 0) {
                // Reset WhoIsLookingForHelp page
                storage.removeItem(WhoIsLookingForHelpPage.defaultProps.name);

                const firstPage = getPersonalisationPagesToShow(
                    this.context.router
                )[0]
                if (firstPage) {
                    this.goToSubPage(firstPage, { replace: true })
                    return null
                }

            }
        }

        const Subpage = getCurrentPersonalisationPage(this.context.router);

        if (!Subpage) {
            throw new Error(
                "Expected current personalisation page but none found"
            );
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
