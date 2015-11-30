/* @flow */

import React from "react";
import { History } from "react-router";
import reactMixin from "react-mixin";

import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import * as iss from "../../iss";

/*::`*/@reactMixin.decorate(History)/*::`;*/
/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class Intro extends React.Component {

    static defaultProps = {
        name: "intro",
    };

    constructor(props: Object) {
        super(props);
        this.state = {
        };
    }

    static title = "Intro";
    static nextStepLabel = "Okay";

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        return request;
    }

    // flow:disable
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

    render(): ReactElement {
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

            </div>
        );
    }

}

export default Intro;
