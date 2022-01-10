/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import categories from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

class CategoriesList extends React.Component<{}, void> {

    render(): ReactElement<"div"> {

        return (
            <div className="CategoriesList">
                <div className="List categories">
                    {/*
                        role="list" here is needed since VoiceOver won't treat
                        lists as lists if they have list-style: none set
                        https://bugs.webkit.org/show_bug.cgi?id=170179
                    */}
                    <ul role="list">
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

export default CategoriesList;
