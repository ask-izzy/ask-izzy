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
                className="CategoryListItem"
                href={this.href()}
                primaryText={this.props.category.name}
                secondaryText={this.props.category.byline}
                secondaryTextLines={2}
                leftAvatar={
                    <mui.Avatar
                        className="colored-icon"
                        backgroundColor={mui.Styles.Colors.transparent}
                        icon={
                            <Icon />
                        }
                        style={{borderRadius: 0}}
                    />
                }
                rightAvatar={
                    <mui.Avatar
                        className="colored-icon"
                        backgroundColor={mui.Styles.Colors.transparent}
                        icon={
                            <icons.Chevron />
                        }
                        style={{borderRadius: 0}}
                    />
                }
            >
            </mui.ListItem>
        );
    }
}

CategoryListItem.contextTypes = Link.contextTypes;
