/* @flow */

"use strict";

import React from "react";
import Router from "react-router";
import reactMixin from "react-mixin";
import mui from "material-ui";

import icons from "../icons";

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
class CategoryListItem extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        category: {
            key: "material-aid",
            name: "Material Aid",
            byline: "Clothes and other goods",
            icon: icons.Things,
        },
    };

    render(): React.Element {
        var Icon = this.props.category.icon || icons.House;

        return (
            <mui.ListItem
                href={this.makeHref('category',
                                    {page: this.props.category.key})}
                onTouchTap={(event) => {
                    this.transitionTo('category',
                                      {page: this.props.category.key});
                }}

                primaryText={this.props.category.name}
                secondaryText={this.props.category.byline}
                secondaryTextLines={2}
                leftIcon={
                    <Icon className="ColoredIcon icon-fg-color" />
                }
                rightIcon={
                    <icons.Chevron className="ColoredIcon icon-fg-color" />
                }
            >
            </mui.ListItem>
        );
    }
}

export default CategoryListItem;
