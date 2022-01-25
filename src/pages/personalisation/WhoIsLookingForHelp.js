/* @flow */
import * as React from "react";

import components from "../../components";
import storage from "../../storage";
import type {serviceSearchRequest} from "../../iss/serviceSearch";
import QuestionStepper from "../../components/QuestionStepper";
import {getCategory} from "../../constants/categories";
import ScreenReader from "../../components/ScreenReader";
import routerContext from "../../contexts/router-context";
import {
    getBannerName,
} from "../../utils/personalisation"
import type {
    PersonalisationPageProps,
    PersonalisationNonQuestionPageDefaultProps,
    PersonalisationPageState,
} from "../../utils/personalisation";

// We need to create the defaultProps out of the component first otherwise flow
// doesn't typecheck it
const defaultProps: PersonalisationNonQuestionPageDefaultProps = {
    name: "who-is-looking-for-help",
    noQuestionStepperBreadcrumb: true,
}

class WhoIsLookingForHelp extends React.Component<
    PersonalisationPageProps,
    PersonalisationPageState
> {
    static defaultProps: PersonalisationNonQuestionPageDefaultProps =
        defaultProps;

    static contextType: any = routerContext;

    static title: string = "Who is looking for help?";

    static getQueryModifier(): ?serviceSearchRequest {
        if (!WhoIsLookingForHelp.savedAnswer) {
            return null
        }
        return {};
    }

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
            storage.setItem(WhoIsLookingForHelp.defaultProps.name, userType);

            this.props.onDoneTouchTap();
        }

    static get savedAnswer(): string {
        let answer = storage.getItem(this.defaultProps.name);

        if (typeof answer !== "string") {
            return "";
        }

        return answer;
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
                        this.props.name
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
