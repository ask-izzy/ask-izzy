/* @flow */

import React from "react";
import LinkListItem from "./LinkListItem";
import Chevron from "../icons/Chevron";

import covidSupportCategories from "../constants/covidSupportCategories.js";

type Props = {
    children?: any,
    onClick?: Function
}

export default class CovidRelatedIssues extends React.Component<Props, {}> {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="CovidRelatedIssues">
                <div className="CovidRelatedIssues-container">
                    <h3>
                        Has your financial situation been affected by the{" "}
                        pandemic?
                    </h3>
                    <span>We have some useful information for you.</span>

                    <ul className="covidServices">
                        {covidSupportCategories.map(category =>
                            <LinkListItem
                                className="CategoryListItem hero"
                                to={"/covid-19-support/" + category.slug}
                                leftIcon={
                                    <category.icon
                                        className="ColoredIcon
                                            icon-fg-color big"
                                    />
                                }
                                key={category.slug}
                                rightIcon={<Chevron />}
                                primaryText={category.title}
                                secondaryText={category.subtitle}
                                onClick={this.props.onClick}
                            />
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}
