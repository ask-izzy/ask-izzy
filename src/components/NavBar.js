/* @flow */

import React from "react";
import moment from "moment";

import categories from "../constants/categories";
import LinkListItem from "./LinkListItem";
import LimitedTimeMessage from "./LimitedTimeMessage";
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
                    <LimitedTimeMessage
                        to={moment({day: 1, month: 8, year: 2016})}
                    >
                        <LinkListItem
                            className="CategoryListItem CensusLink"
                            href={"/census-2016"}
                            leftIcon={
                                <icons.Census2016 className="census-logo" />
                            }
                            primaryText="2016 Census"
                            secondaryText={
                                "Information for the homeless on census night"
                            }
                        />
                    </LimitedTimeMessage>
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
