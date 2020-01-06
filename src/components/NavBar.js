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
                      <div className="BushfireNotice">
                        <h3>
                            Bushfire response January 2020
                        </h3>
                        <p>
                            We have added a new section to Ask Izzy for people
                            affected by the current bushfires across Australia.
                            Our regular categories are still below, but please
                            be aware that some services may be affected by the
                            fires.
                        </p>
                      </div>
                    <LinkListItem
                      className="CategoryListItem hero"
                      to={`/bushfire-relief`}
                      leftIcon={
                        <Warning className="ColoredIcon icon-fg-color big" />
                      }
                      rightIcon={<Chevron />}
                      primaryText='Bushfire support'
                      secondaryText='Information for those affected by bushfires'
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
