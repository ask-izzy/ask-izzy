/* @flow */

import React from "react";

import categories from "../constants/categories";
import LinkListItem from "./LinkListItem";
import CategoryListItem from "./CategoryListItem";
import icons from "../icons";

class NavBar extends React.Component {
    props: {};
    state: void;

    static sampleProps = {default: {}};

    render() {
        const subject = "Ask Izzy - Feedback";
        const mailLink = `mailto:support@askizzy.org.au?subject=${subject}`;

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
                        className="CategoryListItem FeedbackLink"
                        href={mailLink}
                        leftIcon={
                            <icons.Logo
                                className="ColoredIcon icon-fg-color small"
                            />
                        }
                        primaryText="Ask Izzy feedback"
                        secondaryText={"Tell us what you think"}
                    />

                </div>
            </div>
        );
    }

}

export default NavBar;
