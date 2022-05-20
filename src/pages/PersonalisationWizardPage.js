/* @flow */

import * as React from "react";
import type {ElementConfig as ReactElementConfig} from "react";

import NotFoundStaticPage from "./NotFoundStaticPage";
import routerContext from "../contexts/router-context";
import Category from "../constants/Category"
import {
    navigateToPersonalisationSubpath,
    setLocationFromUrl,
} from "../utils/personalisation"
import {
    getPersonalisationPagesToShow,
    getCurrentPersonalisationPage,
    getCategoryFromRouter,
} from "../utils/routing"
import WhoIsLookingForHelp from
    "../constants/personalisation-pages/WhoIsLookingForHelp"
import storage from "../storage"

import type {PersonalisationPage} from "../../flow/personalisation-page"

import RenderPersonalisationPage
    from "./personalisation/RenderPersonalisationPage"

type State = {
  showSubpage: boolean,
  category: ?Category,
}

class PersonalisationWizardPage extends React.Component<{}, State> {
    constructor(props: Object, context: Object) {
        super(props, context);

        this.state = {
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
            `personalise/page/${subpage.name}`,
            navigateOptions
        );
    }

    nextStep: () => void = () => {
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
                storage.removeItem(WhoIsLookingForHelp.name);

                const firstPage = getPersonalisationPagesToShow(
                    this.context.router
                )[0]
                if (firstPage) {
                    this.goToSubPage(firstPage, { replace: true })
                    return null
                }

            }
        }

        const personalisationPage = getCurrentPersonalisationPage(
            this.context.router
        );

        if (!personalisationPage) {
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
                <RenderPersonalisationPage
                    personalisationPage={personalisationPage}
                    onDoneTouchTap={this.nextStep}
                    backToAnswers={false}
                />
            </div>
        );
    }

}

export default PersonalisationWizardPage;
