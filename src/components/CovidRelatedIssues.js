/* @flow */

import React from "react";
import LinkListItem from "./LinkListItem";
import Chevron from "../icons/Chevron";

import covidSupportCategories from "../constants/covidSupportCategories.js";

type Props = {
    children?: any,
    onClick?: Function
}

type State = {
    covidDismissed: boolean
}

export default class CovidRelatedIssues extends React.Component<Props, {}> {
    constructor() {
        super();
        this.state = {
            covidDismissed: false
        };
    }

    setCovidDismissed(isDismissed: boolean): void {
        this.setState({covidDismissed: isDismissed})
    }

    render() {
        return (
            <div className="CovidRelatedIssues">
                <div className="CovidRelatedIssues-container">
                    {this.state.covidDismissed
                        ? (<a href="#" onClick={() => this.setCovidDismissed(false)}>
                            Show me covid related info
                        </a>)
                        : (<React.Fragment>
                            <h3>Have you been put out by Corona (COVID-19)?</h3>
                            <span>We have some useful information for you. Please select an area you'd like to explore.</span>

                            <ul className="covidServices">
                                {covidSupportCategories.map(category =>
                                <LinkListItem
                                    className="CategoryListItem hero"
                                    to={"/covid-19-support/" + category.slug}
                                    leftIcon={<category.icon className="ColoredIcon icon-fg-color big"/>}
                                    key={category.slug}
                                    rightIcon={<Chevron />}
                                    primaryText={category.title}
                                    secondaryText={category.subtitle}
                                    onClick={this.props.onClick}
                                />
                                )}
                            </ul>
                            <a href="#" onClick={() => this.setCovidDismissed(true)}>
                                I'm ok. Dismiss
                            </a>
                        </React.Fragment>)
                    }
                </div>
            </div>
        );
    }
}
