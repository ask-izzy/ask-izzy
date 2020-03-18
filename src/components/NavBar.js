/* @flow */

import React from "react";

import categories from "../constants/categories";
import CategoryListItem from "./CategoryListItem";
import LinkListItem from "./LinkListItem";
import Warning from "../icons/Warning";
import Chevron from "../icons/Chevron";

class NavBar extends React.Component<{}, void> {
    static sampleProps = {default: {}};

    render() {

        return (
            <div className="NavBar">
                <div className="List categories">
                    <LinkListItem
                        className="CategoryListItem hero"
                        to={"/covid-19-support"}
                        leftIcon={
                            <Warning
                                className="ColoredIcon icon-fg-color big"
                            />
                        }
                        rightIcon={<Chevron />}
                        primaryText="Coronavirus (COVID-19) support"
                        secondaryText={
                            "Information for those affected by coronavirus " +
                            "(COVID-19)"
                        }
                    />
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
                </div>
            </div>
        );
    }
}

export default NavBar;
