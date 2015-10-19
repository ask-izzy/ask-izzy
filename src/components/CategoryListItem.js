/* @flow */

import React from "react";
import { History, Link } from "react-router";
import reactMixin from "react-mixin";
import mui from "material-ui";

import icons from "../icons";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class CategoryListItem extends React.Component {

    // flow:disable not supported yet
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
            <Link
                className="plain-text"
                to={`/category/${this.props.category.key}`}
            >
                <div
                    className="CategoryListItem ListItem has-left-icon has-right-icon"
                    secondaryTextLines={1}
                >
                    <div>
                        <Icon className="leftIcon ColoredIcon icon-fg-color size-30" />
                        <icons.Chevron className="rightIcon" />
                        <div className="primaryText">
                            {this.props.category.name}
                        </div>
                        <div className="secondaryText oneline">
                            {this.props.category.byline}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}

export default CategoryListItem;
