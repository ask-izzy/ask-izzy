/* @flow */

import * as React from "react";

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import storage from "../../storage";
import * as iss from "../../iss";
import icons from "../../icons";

type Props = {
    onDoneTouchTap: Function,
    name: string,
}

class Intro extends Personalisation<Props, {}> {
    static defaultProps = {
        name: "intro",
    };

    static title = "Intro";

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        return request;
    }

    get seekingHelpWith(): string {
        try {
            // flow:disable flowjs needs updating for optional chaining methods
            return this.props.category?.byline.toLocaleLowerCase() ||
                // flow:disable
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

    handleButtonClick = (userType: string) =>
        (event: SyntheticEvent<HTMLButtonElement>): void => {
            storage.setItem("user_type", userType);

            this.props.onDoneTouchTap();
        }

    render() {
        return (
            <div className="IntroPage">
                <components.HeaderBar
                    primaryText={
                        <div>
                            To help me find the right services
                            I'll ask you a few questions
                        </div>
                    }
                    secondaryText={
                        <div>
                            All of your answers are private and anonymous.
                        </div>
                    }
                    bannerName={this.bannerName}
                />
                <div className="body">
                    <h3>
                        I&#39;m looking for help for
                    </h3>
                    {this.renderDoneButton()}
                    {this.shouldShowBetaBox &&
                        <div className="betaPathwayWrapper">
                            <div className="betaPathway">
                                <header>
                                    <icons.Lightning />
                                    <h4>Ask Izzy Beta - Pandemic Support</h4>
                                </header>
                                <p>
                                    If you've been impacted by the pandemic and
                                    need support, we have a new version of Ask
                                    Izzy that might be helpful to you.{" "}
                                    <a href="https://beta.askizzy.org.au">
                                        Go to Ask Izzy Beta
                                    </a>
                                </p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

    renderDoneButton() {
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
}

export default Intro;
