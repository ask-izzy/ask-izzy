/* @flow */

import React from "react";
import { Link } from "react-router";
import mui from "material-ui";

import categories from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

class NavBar extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: {}};

    render(): React.Component {
        return (
            <div className="NavBar">
                <mui.List className="List categories">
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
                    <mui.ListDivider />
                </mui.List>
            </div>
        );
    }

}

export default NavBar;
