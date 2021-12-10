/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import LinkListItem from "./LinkListItem";
import House from "../icons/house.svg";
import Chevron from "../icons/chevron.svg";
import type Category from "../constants/Category";
import Storage from "../storage";

type Props = {
    category: Category,
}

const PERSONALISATIONS_TO_CLEAR = [
    "are-you-safe",
    "sub-indigenous",
    "dfv-demographics",
]

class CategoryListItem extends React.Component<Props, void> {
    /**
     * This is to prevent confusion when going between categories which share,
     * the same questions
     * eg - going from domestic violence to housing, and having the
     * 'Are you safe' response appear in the breadcrumb.
     *
     * This may not be needed with filters
     * @return - Nothing
     */
    clearAreYouSafe(): void {
        PERSONALISATIONS_TO_CLEAR.forEach(answer => {
            if (Storage.getItem(answer)) {
                Storage.removeItem(answer)
            }
        })
    }

    render(): ReactNode {
        let Icon = this.props.category.icon || House;

        return (
            <LinkListItem
                className="CategoryListItem hero"
                to={`/${this.props.category.key}`}
                leftIcon={
                    <Icon className="ColoredIcon icon-fg-color big" />
                }
                aria-label={`${this.props.category.name}.
                ${this.props.category.byline}`}
                onClick={this.clearAreYouSafe}
                rightIcon={<Chevron />}
                primaryText={this.props.category.name}
                secondaryText={this.props.category.byline}
                analyticsEvent={{
                    event: "Link Followed - Category",
                    eventAction: "Category",
                    eventLabel: this.props.category.key,
                }}
            />
        );
    }
}

export default CategoryListItem;
