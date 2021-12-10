/* @flow */
import * as React from "react";

import components from "../../components";
import storage from "../../storage";
import Lightning from "../../icons/lightning.svg";
import type {serviceSearchRequest} from "../../iss/serviceSearch";
import QuestionStepper, {
    shouldShowQuestionStepper,
} from "../../components/QuestionStepper";
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
    name: "intro",
}

class Intro extends React.Component<
    PersonalisationPageProps,
    PersonalisationPageState
> {
    static defaultProps: PersonalisationNonQuestionPageDefaultProps =
        defaultProps;

    static contextType: any = routerContext;

    static title: string = "Intro";

    static getSearch(request: serviceSearchRequest): ?serviceSearchRequest {
        return request;
    }

    constructor(props: Object) {
        super(props);
        this.state = {
            showQuestionStepper: false,
            category: undefined,
        }
    }


    componentDidMount(): void {
        const category = getCategory(
            this.context.router.match.params.page
        )
        this.setState({
            showQuestionStepper: shouldShowQuestionStepper(
                category || undefined
            ),
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
            storage.setItem("user_type", userType);

            this.props.onDoneTouchTap();
        }

    static savedAnswer: empty

    static prettyPrintAnswer: empty

    render(): React.Element<"div"> {
        return (
            <div className="IntroPage">
                <div
                    role="complementary"
                    aria-labelledby="header"
                >
                    {this.renderHeaderSection()}
                </div>
                <main
                    id="mainPageContent"
                    aria-labelledby="questions"
                >
                    <ScreenReader>
                        <span id="questions">
                            Questions.
                        </span>
                    </ScreenReader>
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
                    taperColour={this.state.showQuestionStepper ? "LighterGrey"
                        : "HeaderBar"}
                    fixedAppBar={true}
                    bannerName={getBannerName(
                        this.state.category,
                        this.props.name
                    )}
                />
                {this.state.showQuestionStepper && (
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
                        <QuestionStepper
                            limitBreadcrumbsTo={["location"]}
                            showClearLocation={true}
                            onClearLocation={() => this.setState(
                                {showQuestionStepper: false}
                            )}
                            category={this.state.category}
                        />
                    </div>
                )}
            </section>
        )
    }
}

export default Intro;
