/* @flow */

import React from "react";
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import icons from "../../icons";
import * as iss from "../../iss";

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class Intro extends React.Component {
    // flow:disable
    static defaultProps = {
        name: "intro",
    };

    constructor(props: Object) {
        super(props);
        this.state = {
        };
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        return request;
    }

    // flow:disable
    get seekingHelpWith(): string {
        try {
            var category = this.context.controller.category;

            return category.byline.toLocaleLowerCase() ||
                `with ${category.name.toLocaleLowerCase()}`;
        } catch (e) {
            var search = this.context.controller.props.params.search;

            return `with ${search.toLocaleLowerCase()}`;
        }
    }

    onTouchDoneButton(event: Event): void {
        event.preventDefault();
        this.nextStep();
    }

    render(): ReactElement {
        return (
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            <icons.LogoLight />
                            These services can help you
                            {' '}{this.seekingHelpWith}.
                        </div>
                    }
                    secondaryText={
                        <div>
                            I'll ask you a few questions to help you
                            find the right places.
                        </div>
                    }
                />
                <div className="padded">
                    All of your answers are private and anonymous.
                </div>

                <div className="done-button">
                    <mui.FlatButton
                        label="Okay"
                        onTouchTap={this.onTouchDoneButton.bind(this)}
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    />
                </div>

            </div>
        );
    }

}

export default Intro;
