import React from "react";
import Router, { Link } from "react-router";
import mui from "material-ui";
import icons from "../icons";

export default class CategoryListItem extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        category: {
            key: "material-aid",
            name: "Material Aid",
            byline: "Clothes and other goods",
            icon: icons.Things,
        },
    };

    href(): string {
        return this.context.router.makeHref(
            "category",
            {page: this.props.category.key},
            {}
        );
    }

    render(): React.Element {
        var Icon = this.props.category.icon || icons.House;

        return (
            <mui.ListItem
                href={this.href()}
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

CategoryListItem.contextTypes = Link.contextTypes;
