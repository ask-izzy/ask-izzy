/* @flow */
import * as React from "react";

import components from "../../components";
import storage from "../../storage";
import QuestionStepper from "../../components/QuestionStepper";
import {getCategory} from "../../constants/categories";
import ScreenReader from "../../components/ScreenReader";
import routerContext from "../../contexts/router-context";
import Category from "../../constants/Category"
import {
    getBannerName,
} from "../../utils/personalisation"
import type {PersonalisationLookingForHelpPage} from
    "../../../flow/personalisation-page"
type Props = {
    onDoneTouchTap: () => void,
    backToAnswers?: boolean,
    details: PersonalisationLookingForHelpPage,
    goBack?: () => void
}

type State = {
    category: ?Category,
}

class WhoIsLookingForHelp extends React.Component<Props, State> {
    static contextType: any = routerContext;

    constructor(props: Object) {
        super(props);
        this.state = {
            category: undefined,
        }
    }

    componentDidMount(): void {
        const category = getCategory(
            this.context.router.match.params.page
        )
        this.setState({
            category,
        })
    }

    get seekingHelpWith(): string {
        try {
            return this.state.category?.byline.toLocaleLowerCase() ||
                `with ${this.state.category?.name?.toLocaleLowerCase() || ""}`;
        } catch (error) {
            const search = this.context.router.match.params.search;

            return `with ${search.toLocaleLowerCase()}`;
        }
    }

    handleButtonClick: (
        (userType: string) => (event: SyntheticEvent<HTMLButtonElement>) => void
    ) = (userType: string) =>
        (event: SyntheticEvent<HTMLButtonElement>): void => {
            storage.setItem(this.props.details.name, userType);

            this.props.onDoneTouchTap();
        }

    static prettyPrintAnswer: empty

    render(): React.Element<"div"> {
        return (
            <div className="WhoIsLookingForHelpPage">
                {this.renderHeaderSection()}
                <main
                    id="mainPageContent"
                    aria-label="Questions"
                >
                    <div className="body">
                        <fieldset>
                            <legend>
                                 I&#39;m looking for help for
                            </legend>
                            {this.renderDoneButton()}
                        </fieldset>
                    </div>
                </main>
            </div>
        );
    }

    renderDoneButton(): React.Element<"div"> {
        return (
            <div>
                <div className="done-button">
                    <components.FlatButton
                        label="A client or consumer"
                        onClick={this.handleButtonClick("User Worker")}
                    />
                    <components.FlatButton
                        label="Myself"
                        onClick={this.handleButtonClick("User Myself")}
                    />
                    <components.FlatButton
                        label="A friend or family member"
                        onClick={this.handleButtonClick("User Someone Else")}
                    />
                </div>
            </div>
        )
    }

    renderHeaderSection(): React.Element<any> {
        return (
            <section className="page-header-section">
                <components.HeaderBar
                    primaryText={
                        "I'm looking for help for"
                    }
                    infoText={
                        "All of your answers are private and anonymous."
                    }
                    taperColour={"LighterGrey"}
                    fixedAppBar={true}
                    bannerName={getBannerName(
                        this.state.category,
                        this.props.details.name
                    )}
                />
                <div className="questionsBar">
                    <ScreenReader>
                        <a
                            href="#mainPageContent"
                            aria-label={
                                "Skip your previously selected " +
                                "answers and go straight to the " +
                                "options."
                            }
                        >
                            Skip to make your selection
                        </a>
                    </ScreenReader>
                    <QuestionStepper />
                </div>
            </section>
        )
    }
}

export default WhoIsLookingForHelp;
