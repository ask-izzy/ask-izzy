/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";
import _ from "underscore";

import categories from '../constants/categories';
import components from '../components';
import icons from '../icons';

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
class PersonalisationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            subpage: 0,
        };
    }

    // flow:disable
    static childContextTypes = {
        controller: React.PropTypes.instanceOf(PersonalisationPage),
    };

    getChildContext(): Object {
        return {
            controller: this,
        };
    }

    // flow:disable not supported yet
    get category(): categories.Category {
        if (this._category) {
            return this._category;
        }

        var category = _.findWhere(categories, {
            key: this.props.params.page,
        });

        if (category === undefined) {
            throw "No such category " + this.props.params.page;
        }

        this._category = category;
        return category;
    }

    previousStep(): void {
        var subpage = this.state.subpage - 1;

        if (subpage < 0) {
            this.goBack();
        } else {
            this.setState({subpage: subpage});
        }
    }

    nextStep(): void {
        var subpage = this.state.subpage + 1;

        if (subpage == this.category.personalisation.length) {
            this.replaceWith('category', this.getParams());
        } else {
            this.setState({subpage: subpage});
        }
    }

    render(): React.Element {
        var subpage = this.category.personalisation[this.state.subpage];
        console.log(subpage);

        return (
            <div className="PersonalisationPage">
                <components.AppBar
                    title="Personalise"
                    onBackTouchTap={this.previousStep.bind(this)}
                />
                {React.createElement(subpage)}
            </div>
        );
    }

}

export default PersonalisationPage;
