/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import * as React from "react";

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import Link from "../../components/Link";
import storage from "../../storage";
import * as iss from "../../iss";
import icons from "../../icons";
import QuestionStepper from "../QuestionStepper";
import {getCategory} from "../../constants/categories";
import {fetchAnswers, getSearchAnswers} from "../QuestionStepper.service";
import Category from "../../constants/Category";

type Props = {
    onDoneTouchTap: Function,
    name: string,
}

type State = {
    showStepper: boolean,
    category: ?Category,
}

class Intro extends Personalisation<Props, State> {
    static defaultProps: ReactElementConfig<typeof Personalisation> = {
        name: "intro",
    };

    static title: string = "Intro";

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
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
            // $FlowIgnore flowjs needs updating for optional chaining methods
            return this.props.category?.byline.toLocaleLowerCase() ||
                // $FlowIgnore
                `with ${this.props.category?.name?.toLocaleLowerCase() || ""}`;
        } catch (error) {
            const search = this.context.router.match.params.search;

            return `with ${search.toLocaleLowerCase()}`;
        }
    }

    get shouldShowBetaBox(): boolean {
        const allowList = [
            "Housing",
            "Food",
            "Everyday things",
            "Centrelink",
            "Money help",
            "Finding work",
        ]
        return Boolean(
            this.props.category && allowList.some(categoryName =>
                this.props.category && categoryName === this.props.category.name
            )
        )
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
                {this.renderHeaderBar()}
                <div className="body">
                    <fieldset tabIndex="0">
                        <legend>
                             I&#39;m looking for help for
                        </legend>
                        <h3>
                             I&#39;m looking for help for
                        </h3>
                        {this.renderDoneButton()}
                        {this.shouldShowBetaBox &&
                            <div className="betaPathwayWrapper">
                                <div className="betaPathway">
                                    <header>
                                        <icons.Lightning />
                                        <h4>
                                            Ask Izzy Beta - Pandemic Support
                                        </h4>
                                    </header>
                                    <p>
                                        If you've been impacted by the pandemic
                                        and
                                        need support, we have a new version of
                                        Ask
                                        Izzy that might be helpful to you.{" "}
                                        <Link
                                            to="https://beta.askizzy.org.au"
                                            className="BetaLink"
                                        >
                                            Go to Ask Izzy Beta
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        }
                    </fieldset>
                </div>
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
                    <div>
                        To help me find the right services
                        I'll ask you a few questions.
                    </div>
                }
                secondaryText={
                    <div>
                        All of your answers are private and anonymous.
                    </div>
                }
                taperColour={this.state.showStepper ? "LighterGrey"
                    : "HeaderBar"}
                bannerName={this.bannerName}
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
