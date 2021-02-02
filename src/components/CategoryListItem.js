/* @flow */

import React from "react";
import LinkListItem from "./LinkListItem";
import Things from "../icons/things.svg";
import House from "../icons/house.svg";
import Chevron from "../icons/chevron.svg";
import type Category from "../constants/Category";

type Props = {
    category: Category,
}

class CategoryListItem extends React.Component<Props, void> {
    static sampleProps = {default: {
        category: {
            key: "material-aid",
            name: "Material Aid",
            byline: "Clothes and other goods",
            icon: Things,
        },
    }};

    render() {
        let Icon = this.props.category.icon || House;

        return (
            <LinkListItem
                className="CategoryListItem hero"
                to={`/${this.props.category.key}`}
                leftIcon={
                    <Icon className="ColoredIcon icon-fg-color big" />
                }
                rightIcon={<Chevron />}
                primaryText={this.props.category.name}
                secondaryText={this.props.category.byline}
            />
        );
    }
}

export default CategoryListItem;
