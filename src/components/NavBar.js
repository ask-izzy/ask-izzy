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
