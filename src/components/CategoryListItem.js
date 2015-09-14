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
    static sampleProps = {default: {
        category: {
            key: "material-aid",
            name: "Material Aid",
            byline: "Clothes and other goods",
            icon: icons.Things,
        },
    },};

    render(): React.Element {
        var Icon = this.props.category.icon || icons.House;

        return (
            <mui.ListItem
                className="CategoryListItem"
                containerElement={
                    <Router.Link
                        to="category"
                        params={{page: this.props.category.key}}
                    />
                }

                primaryText={
                    <div className="primaryText">
                        {this.props.category.name}
                    </div>
                }
                secondaryText={this.props.category.byline}
                secondaryTextLines={1}
                leftIcon={
                    <Icon className="ColoredIcon icon-fg-color size-30" />
                }
                rightIcon={
                    <icons.Chevron />
                }

                disableFocusRipple={true}
                disableTouchRipple={true}
            />
        );
    }
}

export default CategoryListItem;
