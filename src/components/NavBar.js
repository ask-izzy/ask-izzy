/* @flow */

import React from "react";
import { Link } from "react-router";
import mui from "material-ui";

import categories from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

class NavBar extends React.Component {

    render(): React.Component {
        return (
            <div className="NavBar">
                <mui.List className="NavBar-links">
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
                <div className="NavBar-locales">
                </div>
            </div>
        );
    }

}

export default NavBar;
