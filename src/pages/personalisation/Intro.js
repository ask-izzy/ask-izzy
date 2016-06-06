/* @flow */

import React from "react";
import reactMixin from "react-mixin";

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import * as iss from "../../iss";

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class Intro extends React.Component {
    props: Object;
    state: void;

    static defaultProps = {
        name: "intro",
    };

    static propTypes = {
        name: React.PropTypes.string.isRequired,
        onDoneTouchTap: React.PropTypes.func,
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
        return (
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            <components.LogoWithShadow />
                            To help me find the right services
                            I'll ask you a few questions
                        </div>
                    }
                    secondaryText={
                        <div>
                            All of your answers are private and anonymous.
                        </div>
                    }
                />
                {this.renderDoneButton()}
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
