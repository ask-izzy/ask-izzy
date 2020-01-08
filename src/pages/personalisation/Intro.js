/* @flow */

import React from "react";
import { Link } from "react-router"

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import * as iss from "../../iss";

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
            const search = this.context.controller.props.params.search;

            return `with ${search.toLocaleLowerCase()}`;
        }
    }

    render() {
        let bannerName = "";

        try {
            bannerName = this.context.controller.props.params.page;
        } catch (err) {
            // continue with no banner
        }

        return (
            <div>
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
                    <p>
                        Please be aware that due to the bushfires currently
                        affecting many parts of Australia, some services listed
                        may not be operating or offering a more limited range of
                        services. We are working to update these as soon as
                        possible.
                    </p>
                    <p>
                        If you are looking for assistance (including food,
                        housing, clothing etc) as a result of the current
                        bushfires, please see our{" "}
                        <Link to="/bushfire-support">
                            bushfire response page
                        </Link>.
                    </p>
                    {this.renderDoneButton()}
                </div>
            </div>
        );
    }

    renderDoneButton() {
        return (
            <div>
                <div className="done-button">
                    <components.FlatButton
                        label="Okay"
                        autoFocus={true}
                        onClick={this.props.onDoneTouchTap}
                    />
                </div>
            </div>
        )
    }
}

export default Intro;
