/* @flow */

import * as React from "react";

import Personalisation from "../../mixins/Personalisation";
import {Category} from "../../constants/categories";
import components from "../../components";
import storage from "../../storage";
import * as iss from "../../iss";

type Props = {
    onDoneTouchTap: Function,
    name: string,
    category: ?Category
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
        const bannerName = this.props.category && this.props.category.bannerImage ? 
            this.props.category.bannerImage 
            : "purple"

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
                    <h3>
                        I&#39;m looking for help for
                    </h3>
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
