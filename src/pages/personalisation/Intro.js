/* @flow */
import * as React from "react";

import components from "../../components";
import storage from "../../storage";
import type {serviceSearchRequest} from "../../iss/serviceSearch";
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";
import {fetchAnswers, getSearchAnswers} from "../QuestionStepper.service";
import ScreenReader from "../../components/ScreenReader";
import routerContext from "../../contexts/router-context";
import {
    getBannerName,
} from "../../utils/personalisation"
import type {
    PersonalisationPageProps,
    PersonalisationPageDefaultProps,
    PersonalisationPageState,
} from "../../utils/personalisation";

// We need to create the defaultProps out of the component first otherwise flow
// doesn't typecheck it
const defaultProps: PersonalisationPageDefaultProps = {
    name: "intro",
}

class Intro extends React.Component<
    PersonalisationPageProps,
    PersonalisationPageState
> {
    static defaultProps: PersonalisationPageDefaultProps = defaultProps;

    static contextType: any = routerContext;

    static title: string = "Intro";

    static getSearch(request: serviceSearchRequest): ?serviceSearchRequest {
        return request;
    }

    constructor(props: Object) {
        super(props);
        this.state = {
            showStepper: false,
            category: undefined,
        }
    }


    componentDidMount(): void {
        const category = getCategory(
            this.context.router.match.params.page
        )
        const searchAnswers = getSearchAnswers();
        this.setState({
            showStepper: category ? fetchAnswers(category).length > 0
                : searchAnswers.length > 0,
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

    render(): React.Element<"div"> {
        return (
            <div className="IntroPage">
                <div
                    role="complementary"
                    aria-labelledby="header"
                >
                    <ScreenReader>
                        <span id="header">
                            Header.
                        </span>
                    </ScreenReader>
                    {this.renderHeaderBar()}
                </div>
                <main aria-labelledby="questions">
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

    renderHeaderBar(): React.Element<any> {
        const renderedHeaderBar = (
            <components.HeaderBar
                primaryText={
                    "I'm looking for help for"
                }
                infoText={
                    "All of your answers are private and anonymous."
                }
                taperColour={this.state.showStepper ? "LighterGrey"
                    : "HeaderBar"}
                fixedAppBar={true}
                bannerName={getBannerName(
                    this.state.category,
                    this.props.name
                )}
            />
        )
        if (this.state.showStepper) {
            return (
                <section className="page-header-section">
                    {renderedHeaderBar}
                    <QuestionStepper
                        intro={true}
                        onClear={() => this.setState(
                            {showStepper: false}
                        )}
                        category={this.state.category}
                    />
                </section>
            )
        } else {
            return renderedHeaderBar
        }
    }
}

export default Intro;
