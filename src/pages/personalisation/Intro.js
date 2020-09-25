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
            const category = this.context.controller.category;

            return category.byline.toLocaleLowerCase() ||
                `with ${category.name.toLocaleLowerCase()}`;
        } catch (error) {
            const search = this.context.controller.props.match.params.search;

            return `with ${search.toLocaleLowerCase()}`;
        }
    }

    handleButtonClick = (userType: string) =>
        (event: SyntheticEvent<HTMLButtonElement>): void => {
            storage.setItem("user_type", userType);

            this.props.onDoneTouchTap();
        }

    render() {
        let bannerName = "";

        try {
            bannerName = this.context.controller.props.match.params.page;
        } catch (err) {
            // continue with no banner
        }

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
                    bannerName={bannerName}
                />
                <div className="body">
                    <h3>
                        I&#39;m looking for help for
                    </h3>
                    {this.renderDoneButton()}
                    <div id="betaPathwayWrapper">
                        <div id="betaPathway">
                            <header>
                                <icons.Lightning />
                                <h4>Ask Izzy Beta - Pandemic Support</h4>
                            </header>
                            <p>
                                If you've been impacted by the pandemic and need
                                support, we have a new version of Ask Izzy that
                                might be helpful to you.{" "}
                                <a href="https://beta.askizzy.org.au">
                                    Go to Ask Izzy Beta
                                </a>
                            </p>
                        </div>
                    </div>
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
