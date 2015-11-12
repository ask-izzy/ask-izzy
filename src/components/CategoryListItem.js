/* @flow */

import React from "react";
import { History } from "react-router";
import reactMixin from "react-mixin";

import components from "../components";
import icons from "../icons";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class CategoryListItem extends React.Component {

    static sampleProps = {default: {
        category: {
            key: "material-aid",
            name: "Material Aid",
            byline: "Clothes and other goods",
            icon: icons.Things,
        },
    }};

    render(): ReactElement {
        let Icon = this.props.category.icon || icons.House;

        return (
            <components.LinkListItem
                className="CategoryListItem hero"
                to={`/category/${this.props.category.key}`}
                leftIcon={
                    <Icon className="ColoredIcon icon-fg-color small" />
                }
                rightIcon={<icons.Chevron />}
                primaryText={this.props.category.name}
                secondaryText={this.props.category.byline}
            />
        );
    }
}

export default CategoryListItem;
