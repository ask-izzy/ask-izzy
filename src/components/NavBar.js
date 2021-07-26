/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import categories from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

class NavBar extends React.Component<{}, void> {
    static sampleProps: any = {default: {}};

    render(): ReactElement<"div"> {

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
