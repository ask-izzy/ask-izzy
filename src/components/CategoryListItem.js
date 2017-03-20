/* @flow */

import React from "react";
import LinkListItem from "./LinkListItem";
import icons from "../icons";
import type {Category} from "../constants/categories";

class CategoryListItem extends React.Component {
    props: {
        category: Category,
    };
    state: void;

    static sampleProps = {default: {
        category: {
            key: "material-aid",
            name: "Material Aid",
            byline: "Clothes and other goods",
            icon: icons.Things,
        },
    }};

    render() {
        let Icon = this.props.category.icon || icons.House;

        return (
            <LinkListItem
                className="CategoryListItem hero"
                to={`/${this.props.category.key}`}
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
