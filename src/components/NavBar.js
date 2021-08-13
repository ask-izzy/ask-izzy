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
                    <ul>
                        {
                            categories.map(category => {
                                return (
                                    <li key={category.key}>
                                        <CategoryListItem
                                            category={category}
                                            key={category.key}
                                        />
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default NavBar;
