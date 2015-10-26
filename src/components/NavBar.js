/* @flow */

import React from "react";

import categories from "../constants/categories";
import LinkListItem from "./LinkListItem";
import CategoryListItem from "./CategoryListItem";
import icons from "../icons";

declare var SITE_DOMAIN: string;

class NavBar extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: {}};

    render(): ReactElement {
        const domain = SITE_DOMAIN;
        const mailLink = `mailto:support@${domain}`;

        return (
            <div className="NavBar">
                <div className="List categories">
                    {
                        categories.map(category => {
                            return (
                                <CategoryListItem
                                    category={category}
                                    key={category.key}
                                />
                            );
                        })
                    }

                    <LinkListItem
                        className="CategoryListItem"
                        to={mailLink}
                        leftIcon={
                            <icons.Logo className="ColoredIcon icon-fg-color size-30" />
                        }
                        primaryText="Ask Izzy feedback"
                        secondaryText={<div className="oneline">
                            Tell us what you think
                        </div>}
                    />

                </div>
            </div>
        );
    }

}

export default NavBar;
